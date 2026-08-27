/**
 * AI Knowledge Trainer Service
 * Fetches ALL data from MongoDB collections and builds a comprehensive
 * knowledge graph for the AI Assistant to query against.
 */

import AIKnowledge from '../models/AIKnowledge.js';
import Bio from '../models/Bio.js';
import Project from '../models/Project.js';
import Certificate from '../models/Certificate.js';
import Internship from '../models/Internship.js';
import Skill from '../models/Skill.js';
import Contact from '../models/Contact.js';
import { personalIdentity, coreSkills, interests, testimonials, faqEntries } from '../data/leelaKnowledge.js';

/**
 * Extract all unique technologies from projects, internships, and skills
 */
const extractTechnologies = (projects, internships, skills) => {
  const techSet = new Set();

  // From projects - meta field (e.g., "Python | ML" -> ["Python", "ML"])
  projects.forEach((project) => {
    if (project.meta) {
      project.meta.split('|').forEach((t) => {
        const trimmed = t.trim();
        if (trimmed) techSet.add(trimmed);
      });
    }
  });

  // From internships - technologies array
  internships.forEach((internship) => {
    if (internship.technologies && Array.isArray(internship.technologies)) {
      internship.technologies.forEach((t) => {
        if (t) techSet.add(t.trim());
      });
    }
  });

  // From skills - individual skill names
  skills.forEach((skill) => {
    if (skill.skills && Array.isArray(skill.skills)) {
      skill.skills.forEach((s) => {
        if (s) techSet.add(s.trim());
      });
    }
    if (skill.name) techSet.add(skill.name.trim());
  });

  return Array.from(techSet);
};

/**
 * Extract all unique domains/categories
 */
const extractDomains = (projects, internships, skills) => {
  const domainSet = new Set();

  projects.forEach((p) => {
    if (p.category) domainSet.add(p.category);
  });

  internships.forEach((i) => {
    if (i.type) domainSet.add(i.type);
    if (i.role) domainSet.add(i.role);
  });

  skills.forEach((s) => {
    if (s.title) domainSet.add(s.title);
    if (s.category) domainSet.add(s.category);
  });

  return Array.from(domainSet);
};

/**
 * Calculate aggregate experience info from internships
 */
const extractExperience = (internships) => {
  const yearsSet = new Set();
  const companies = [];

  internships.forEach((i) => {
    if (i.company) companies.push(i.company);
    if (i.duration) {
      const years = i.duration.match(/\d{4}/g);
      if (years) years.forEach((y) => yearsSet.add(parseInt(y)));
    }
  });

  const sorted = Array.from(yearsSet).sort();
  const currentYear = new Date().getFullYear();
  const yearsOfExperience =
    sorted.length > 0 ? Math.max(1, currentYear - Math.min(...sorted)) : 1;

  return { yearsOfExperience, companies };
};

/**
 * Build a searchable text corpus from all data
 */
const buildSearchCorpus = (bio, projects, certificates, internships, skills) => {
  const corpus = [];

  // Bio entries
  if (bio) {
    Object.entries(bio).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length > 0) {
        corpus.push({
          type: 'bio',
          field: key,
          text: value,
          keywords: value.toLowerCase().split(/\s+/),
        });
      }
    });
  }

  // Projects
  projects.forEach((project) => {
    const text = [project.title, project.desc, project.category, project.meta]
      .filter(Boolean)
      .join(' ');
    corpus.push({
      type: 'project',
      id: project._id?.toString(),
      title: project.title,
      text,
      keywords: text.toLowerCase().split(/\s+/),
      category: project.category,
      priority: project.priority,
    });
  });

  // Certificates
  certificates.forEach((cert) => {
    const text = [cert.title, cert.issuer, cert.category, cert.description]
      .filter(Boolean)
      .join(' ');
    corpus.push({
      type: 'certificate',
      id: cert._id?.toString(),
      title: cert.title,
      text,
      keywords: text.toLowerCase().split(/\s+/),
      issuer: cert.issuer,
    });
  });

  // Internships
  internships.forEach((internship) => {
    const text = [internship.role, internship.company, internship.desc, internship.duration]
      .filter(Boolean)
      .join(' ');
    corpus.push({
      type: 'internship',
      id: internship._id?.toString(),
      title: `${internship.role} at ${internship.company}`,
      text,
      keywords: text.toLowerCase().split(/\s+/),
      company: internship.company,
    });
  });

  // Skills
  skills.forEach((skill) => {
    const individualSkills = skill.skills || [];
    const text = [skill.title, skill.category, ...individualSkills].filter(Boolean).join(' ');
    corpus.push({
      type: 'skill',
      id: skill._id?.toString(),
      title: skill.title || skill.category,
      text,
      keywords: text.toLowerCase().split(/\s+/),
      skills: individualSkills,
    });
  });

  return corpus;
};

/**
 * Main training function - fetches all data and builds knowledge base
 */
export const trainAIKnowledge = async () => {
  const startTime = Date.now();

  // Update status to training
  await AIKnowledge.findOneAndUpdate(
    {},
    { 'metadata.status': 'training' },
    { upsert: true, new: true }
  );

  try {
    // Fetch all data in parallel
    const [bio, projects, certificates, internships, skills, contacts] = await Promise.all([
      Bio.findOne().lean().catch(() => null),
      Project.find().lean().catch(() => []),
      Certificate.find().lean().catch(() => []),
      Internship.find().lean().catch(() => []),
      Skill.find().lean().catch(() => []),
      Contact.find().lean().catch(() => []),
    ]);

    // Build knowledge graph
    const technologies = extractTechnologies(projects, internships, skills);
    const domains = extractDomains(projects, internships, skills);
    const experience = extractExperience(internships);
    const searchCorpus = buildSearchCorpus(bio, projects, certificates, internships, skills);

    // Merge seed bio with database bio (seed is always the source of truth for identity)
    const mergedBio = {
      ...(bio || {}),
      ...personalIdentity,
      title: bio?.title || personalIdentity.title,
      intro: bio?.intro || personalIdentity.intro,
    };

    const knowledgeGraph = {
      bio: mergedBio,
      projects: projects || [],
      certificates: certificates || [],
      internships: internships || [],
      skills: skills || [],
      contacts: contacts || [],
      // Personal identity - always from portfolio source data
      personal: personalIdentity,
      // Pre-built FAQ with 100% accurate answers
      faq: faqEntries,
      // Additional personal data
      interests,
      testimonials,
      coreSkills,
      // Derived data
      derived: {
        technologies,
        domains,
        experience,
        searchCorpus,
        totalTechnologies: technologies.length,
        totalDomains: domains.length,
        yearsOfExperience: experience.yearsOfExperience,
        companiesWorked: experience.companies,
      },
    };

    const trainingDuration = Date.now() - startTime;

    // Get the latest version
    const latest = await AIKnowledge.findOne().sort({ version: -1 });
    const newVersion = (latest?.version || 0) + 1;

    // Upsert the knowledge base
    const knowledge = await AIKnowledge.findOneAndUpdate(
      {},
      {
        lastTrainedAt: new Date(),
        version: newVersion,
        knowledgeGraph,
        stats: {
          totalProjects: projects.length,
          totalCertificates: certificates.length,
          totalInternships: internships.length,
          totalSkills: skills.length,
          totalContacts: contacts.length,
          totalTechnologies: technologies.length,
          totalDomains: domains.length,
          totalInterests: interests.length,
          totalTestimonials: testimonials.length,
          totalFaqEntries: faqEntries.length,
        },
        metadata: {
          trainingDuration,
          dataVersion: `v${newVersion}`,
          status: 'ready',
        },
      },
      { upsert: true, new: true }
    );

    console.log(`\n🧠 AI Knowledge Base Trained Successfully`);
    console.log(`   Version: v${newVersion}`);
    console.log(`   Duration: ${trainingDuration}ms`);
    console.log(`   Stats: ${projects.length} projects, ${certificates.length} certs, ${internships.length} internships, ${skills.length} skills, ${technologies.length} technologies`);

    return knowledge;
  } catch (error) {
    console.error('❌ AI Training Error:', error.message);

    // Update status to error
    await AIKnowledge.findOneAndUpdate(
      {},
      {
        'metadata.status': 'error',
        'metadata.trainingDuration': Date.now() - startTime,
      },
      { upsert: true, new: true }
    );

    throw error;
  }
};

/**
 * Get current AI knowledge status
 */
export const getAIKnowledgeStatus = async () => {
  const knowledge = await AIKnowledge.findOne().sort({ version: -1 });
  if (!knowledge) {
    return {
      trained: false,
      status: 'idle',
      lastTrainedAt: null,
      version: 0,
      stats: null,
    };
  }

  return {
    trained: knowledge.metadata.status === 'ready',
    status: knowledge.metadata.status,
    lastTrainedAt: knowledge.lastTrainedAt,
    version: knowledge.version,
    stats: knowledge.stats,
    trainingDuration: knowledge.metadata.trainingDuration,
  };
};

/**
 * Query the knowledge base using keyword matching
 */
export const queryKnowledge = async (query) => {
  const knowledge = await AIKnowledge.findOne().sort({ version: -1 });

  if (!knowledge || knowledge.metadata.status !== 'ready') {
    return {
      trained: false,
      message: 'Knowledge base is not yet trained. Admin needs to sync data.',
      results: null,
    };
  }

  const q = query.toLowerCase();
  const corpus = knowledge.knowledgeGraph?.derived?.searchCorpus || [];
  const results = [];

  // Search through corpus
  corpus.forEach((entry) => {
    const relevance = entry.keywords.filter((kw) => q.includes(kw) || kw.includes(q)).length;
    if (relevance > 0) {
      results.push({ ...entry, relevance });
    }
  });

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);

  // Get all data for comprehensive responses
  const kg = knowledge.knowledgeGraph;

  // Match against FAQ entries for 100% accurate answers
  const faq = kg.faq || [];
  const faqMatches = faq
    .map((entry) => {
      const patternHits = entry.patterns.filter((p) => q.includes(p)).length;
      return { entry, patternHits };
    })
    .filter((match) => match.patternHits > 0)
    .sort((a, b) => b.patternHits - a.patternHits)
    .map((match) => match.entry);

  return {
    trained: true,
    query,
    results: results.slice(0, 20),
    totalMatches: results.length,
    faqMatch: faqMatches.length > 0 ? faqMatches[0] : null,
    faqMatches: faqMatches.slice(0, 3),
    knowledge: {
      bio: kg.bio,
      personal: kg.personal,
      projects: kg.projects,
      certificates: kg.certificates,
      internships: kg.internships,
      skills: kg.skills,
      interests: kg.interests,
      testimonials: kg.testimonials,
      coreSkills: kg.coreSkills,
      faq: kg.faq,
      derived: kg.derived,
    },
    stats: knowledge.stats,
    lastTrainedAt: knowledge.lastTrainedAt,
    version: knowledge.version,
  };
};

export default {
  trainAIKnowledge,
  getAIKnowledgeStatus,
  queryKnowledge,
};

