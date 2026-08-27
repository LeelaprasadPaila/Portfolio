import Internship from '../models/Internship.js';
import fs from 'fs';
import path from 'path';

// Helper: parse duration string like "Jan 2024 - Feb 2024" or "ongoing" into a Date for sorting
const parseDurationStart = (duration) => {
  if (!duration) return null;
  const lower = duration.toLowerCase();
  if (lower === 'ongoing' || lower === 'present') return new Date(9999, 11, 31);
  const parts = duration.split(/[-–—to]+/).map(s => s.trim());
  const startStr = parts[0];
  if (!startStr) return null;
  const months = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
  const match = startStr.match(/([a-zA-Z]+)\s+(\d{4})/);
  if (match) {
    const month = months[match[1].toLowerCase().slice(0, 3)];
    const year = parseInt(match[2]);
    if (month !== undefined && !isNaN(year)) return new Date(year, month, 1);
  }
  const yearMatch = startStr.match(/(\d{4})/);
  if (yearMatch) return new Date(parseInt(yearMatch[1]), 0, 1);
  return null;
};

export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ archived: { $ne: true } }).lean();
    // Check if custom sortOrder has been applied (any item has sortOrder > 0)
    const hasCustomOrder = internships.some(i => i.sortOrder && i.sortOrder > 0);
    if (hasCustomOrder) {
      // Use admin-defined order
      internships.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
    } else {
      // Auto-sort by duration date (most recent first), items without dates at bottom
      internships.sort((a, b) => {
        const dateA = parseDurationStart(a.duration);
        const dateB = parseDurationStart(b.duration);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;  // a goes to bottom
        if (!dateB) return -1; // b goes to bottom
        return dateB - dateA;  // most recent first
      });
    }
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find().lean();
    const hasCustomOrder = internships.some(i => i.sortOrder && i.sortOrder > 0);
    if (hasCustomOrder) {
      internships.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
    } else {
      internships.sort((a, b) => {
        const dateA = parseDurationStart(a.duration);
        const dateB = parseDurationStart(b.duration);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB - dateA;
      });
    }
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const createInternship = async (req, res) => {
  try {
    let { type, company, role, duration, desc, link, priority, archived, technologies, achievements } = req.body;

    if (!type || !company || !role) {
      return res.status(400).json({ message: 'Type, company, and role are required', error: true });
    }

    // Parse technologies and achievements from string to array
    if (typeof technologies === 'string') {
      technologies = technologies.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (typeof achievements === 'string') {
      achievements = achievements.split(',').map(a => a.trim()).filter(Boolean);
    }

    const internshipData = {
      type,
      company,
      role,
      duration,
      desc,
      link,
      priority: priority === 'true' || priority === true,
      archived: archived === 'true' || archived === true,
      technologies: technologies || [],
      achievements: achievements || [],
      sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : undefined,
    };

    if (req.file) {
      internshipData.image = `/uploads/${req.file.filename}`;
    }

    const internship = new Internship(internshipData);
    await internship.save();
    res.status(201).json({ message: 'Internship created successfully', internship });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const reorderInternships = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds array is required', error: true });
    }
    // Filter out any IDs that are undefined/null (new items without _id)
    const validIds = orderedIds.filter(id => id);
    if (validIds.length === 0) {
      return res.status(400).json({ message: 'No valid IDs provided', error: true });
    }
    const bulkOps = validIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder: index + 1 } }, // start from 1 so 0 means unset
      },
    }));
    await Internship.bulkWrite(bulkOps);
    const internships = await Internship.find().lean();
    internships.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
    res.json({ message: 'Reordered successfully', internships });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found', error: true });
    }

    let { type, company, role, duration, desc, link, priority, archived, technologies, achievements, sortOrder } = req.body;

    internship.type = type || internship.type;
    internship.company = company || internship.company;
    internship.role = role || internship.role;
    internship.duration = duration || internship.duration;
    internship.desc = desc || internship.desc;
    internship.link = link || internship.link;
    internship.priority = priority !== undefined ? (priority === 'true' || priority === true) : internship.priority;
    internship.archived = archived !== undefined ? (archived === 'true' || archived === true) : internship.archived;
    if (sortOrder !== undefined) {
      internship.sortOrder = Number(sortOrder);
    }

    if (technologies !== undefined) {
      internship.technologies = typeof technologies === 'string'
        ? technologies.split(',').map(t => t.trim()).filter(Boolean)
        : Array.isArray(technologies) ? technologies : [];
    }
    if (achievements !== undefined) {
      internship.achievements = typeof achievements === 'string'
        ? achievements.split(',').map(a => a.trim()).filter(Boolean)
        : Array.isArray(achievements) ? achievements : [];
    }

    if (req.file) {
      if (internship.image) {
        const oldImagePath = path.join('uploads', internship.image.split('/').pop());
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      internship.image = `/uploads/${req.file.filename}`;
    }

    await internship.save();
    res.json({ message: 'Internship updated successfully', internship });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found', error: true });
    }

    if (internship.image) {
      const imagePath = path.join('uploads', internship.image.split('/').pop());
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export default { getInternships, getAllInternships, createInternship, updateInternship, deleteInternship, reorderInternships };
