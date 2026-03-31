import Internship from '../models/Internship.js';
import fs from 'fs';
import path from 'path';

export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find().sort({ priority: -1, createdAt: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const createInternship = async (req, res) => {
  try {
    const { type, company, role, duration, desc, link, priority } = req.body;

    if (!type || !company || !role) {
      return res.status(400).json({ message: 'Type, company, and role are required', error: true });
    }

    const internshipData = {
      type,
      company,
      role,
      duration,
      desc,
      link,
      priority: priority === 'true' || priority === true,
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

export const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found', error: true });
    }

    const { type, company, role, duration, desc, link, priority } = req.body;

    internship.type = type || internship.type;
    internship.company = company || internship.company;
    internship.role = role || internship.role;
    internship.duration = duration || internship.duration;
    internship.desc = desc || internship.desc;
    internship.link = link || internship.link;
    internship.priority = priority !== undefined ? (priority === 'true' || priority === true) : internship.priority;

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

export default { getInternships, createInternship, updateInternship, deleteInternship };
