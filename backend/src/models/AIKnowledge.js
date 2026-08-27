import mongoose from 'mongoose';

const aiKnowledgeSchema = new mongoose.Schema(
  {
    lastTrainedAt: {
      type: Date,
      default: null,
    },
    version: {
      type: Number,
      default: 1,
    },
    knowledgeGraph: {
      bio: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
      projects: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
      certificates: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
      internships: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
      skills: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
      contacts: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
      // Personal identity - always populated from portfolio source data
      personal: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
      // Pre-built FAQ entries with 100% accurate answers
      faq: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
      // Additional personal data
      interests: {
        type: [String],
        default: [],
      },
      testimonials: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
      coreSkills: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
    },
    stats: {
      totalProjects: { type: Number, default: 0 },
      totalCertificates: { type: Number, default: 0 },
      totalInternships: { type: Number, default: 0 },
      totalSkills: { type: Number, default: 0 },
      totalContacts: { type: Number, default: 0 },
      totalTechnologies: { type: Number, default: 0 },
      totalDomains: { type: Number, default: 0 },
      totalInterests: { type: Number, default: 0 },
      totalTestimonials: { type: Number, default: 0 },
      totalFaqEntries: { type: Number, default: 0 },
    },
    metadata: {
      trainingDuration: { type: Number, default: 0 }, // in ms
      dataVersion: { type: String, default: '1.0' },
      status: {
        type: String,
        enum: ['idle', 'training', 'ready', 'error'],
        default: 'idle',
      },
    },
  },
  { timestamps: true }
);

// Index for quick lookup
aiKnowledgeSchema.index({ version: -1 });
aiKnowledgeSchema.index({ 'metadata.status': 1 });

export default mongoose.model('AIKnowledge', aiKnowledgeSchema);

