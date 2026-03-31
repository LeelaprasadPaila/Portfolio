import Certificate from '../models/Certificate.js';
import fs from 'fs';
import path from 'path';

export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ priority: -1, createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const { title, category, description, issuer, issueDate, priority } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required', error: true });
    }

    const certData = {
      title,
      category,
      description,
      issuer,
      issueDate,
      priority: priority === 'true' || priority === true,
    };

    if (req.file) {
      certData.image = `/uploads/${req.file.filename}`;
    }

    const certificate = new Certificate(certData);
    await certificate.save();
    res.status(201).json({ message: 'Certificate created successfully', certificate });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found', error: true });
    }

    const { title, category, description, issuer, issueDate, priority } = req.body;

    certificate.title = title || certificate.title;
    certificate.category = category || certificate.category;
    certificate.description = description || certificate.description;
    certificate.issuer = issuer || certificate.issuer;
    certificate.issueDate = issueDate || certificate.issueDate;
    certificate.priority = priority !== undefined ? (priority === 'true' || priority === true) : certificate.priority;

    if (req.file) {
      if (certificate.image) {
        const oldImagePath = path.join('uploads', certificate.image.split('/').pop());
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      certificate.image = `/uploads/${req.file.filename}`;
    }

    await certificate.save();
    res.json({ message: 'Certificate updated successfully', certificate });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found', error: true });
    }

    if (certificate.image) {
      const imagePath = path.join('uploads', certificate.image.split('/').pop());
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export default { getCertificates, createCertificate, updateCertificate, deleteCertificate };
