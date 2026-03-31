import Project from '../models/Project.js';
import fs from 'fs';
import path from 'path';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ priority: -1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const createProject = async (req, res) => {
  try {
    const { category, title, desc, link, meta, priority } = req.body;

    if (!category || !title) {
      return res.status(400).json({ message: 'Category and title are required', error: true });
    }

    const projectData = {
      category,
      title,
      desc,
      link,
      meta,
      priority: priority === 'true' || priority === true,
    };

    // Handle file upload
    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }

    const project = new Project(projectData);
    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found', error: true });
    }

    const { category, title, desc, link, meta, priority } = req.body;

    project.category = category || project.category;
    project.title = title || project.title;
    project.desc = desc || project.desc;
    project.link = link || project.link;
    project.meta = meta || project.meta;
    project.priority = priority !== undefined ? (priority === 'true' || priority === true) : project.priority;

    // Handle file upload
    if (req.file) {
      // Delete old file if exists
      if (project.image) {
        const oldImagePath = path.join('uploads', project.image.split('/').pop());
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      project.image = `/uploads/${req.file.filename}`;
    }

    await project.save();
    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found', error: true });
    }

    // Delete image file if exists
    if (project.image) {
      const imagePath = path.join('uploads', project.image.split('/').pop());
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export default { getProjects, createProject, updateProject, deleteProject };
