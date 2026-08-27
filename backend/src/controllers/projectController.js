import Project from '../models/Project.js';
import fs from 'fs';
import path from 'path';

export const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Public endpoint: only return non-archived projects
    const projects = await Project.find({ archived: { $ne: true } }).lean();

    // Check if custom sortOrder has been applied (any item has sortOrder > 0)
    const hasCustomOrder = projects.some(p => p.sortOrder && p.sortOrder > 0);
    if (hasCustomOrder) {
      // Use admin-defined order
      projects.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
    } else {
      // Auto-sort by priority then createdAt (most recent first)
      projects.sort((a, b) => {
        if (a.priority !== b.priority) return (b.priority ? 1 : 0) - (a.priority ? 1 : 0);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    const paginated = projects.slice(skip, skip + limit);
    const total = await Project.countDocuments({ archived: { $ne: true } });

    res.json({
      projects: paginated,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

/**
 * Admin-only endpoint: returns ALL projects including archived ones.
 * Requires auth token (protected in routes).
 */
export const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const skip = (page - 1) * limit;

    const projects = await Project.find().lean();

    // Check if custom sortOrder has been applied (any item has sortOrder > 0)
    const hasCustomOrder = projects.some(p => p.sortOrder && p.sortOrder > 0);
    if (hasCustomOrder) {
      // Use admin-defined order
      projects.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
    } else {
      // Auto-sort by priority then createdAt (most recent first)
      projects.sort((a, b) => {
        if (a.priority !== b.priority) return (b.priority ? 1 : 0) - (a.priority ? 1 : 0);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    const paginated = projects.slice(skip, skip + limit);
    const total = await Project.countDocuments();

    res.json({
      projects: paginated,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const reorderProjects = async (req, res) => {
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
    await Project.bulkWrite(bulkOps);
    const projects = await Project.find().lean();
    projects.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
    res.json({ message: 'Reordered successfully', projects });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const createProject = async (req, res) => {
  try {
    const { category, title, desc, link, githubLink, videoUrl, meta, priority, archived, sortOrder } = req.body;

    if (!category || !title) {
      return res.status(400).json({ message: 'Category and title are required', error: true });
    }

    const projectData = {
      category,
      title,
      desc,
      link,
      githubLink,
      videoUrl,
      meta,
      priority: priority === 'true' || priority === true,
      archived: archived === 'true' || archived === true,
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
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

    const { category, title, desc, link, githubLink, videoUrl, meta, priority, archived, sortOrder } = req.body;

    project.category = category || project.category;
    project.title = title || project.title;
    project.desc = desc || project.desc;
    project.link = link || project.link;
    project.githubLink = githubLink !== undefined ? githubLink : project.githubLink;
    project.videoUrl = videoUrl !== undefined ? videoUrl : project.videoUrl;
    project.meta = meta || project.meta;
    project.priority = priority !== undefined ? (priority === 'true' || priority === true) : project.priority;
    project.archived = archived !== undefined ? (archived === 'true' || archived === true) : project.archived;
    if (sortOrder !== undefined) {
      project.sortOrder = Number(sortOrder);
    }

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

export default { getProjects, getAllProjects, createProject, updateProject, deleteProject, reorderProjects };
