import Contact from '../models/Contact.js';
import { sendContactEmail } from '../services/emailService.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required', error: true });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await contact.save();

    // Send email
    await sendContactEmail({ name, email, phone, message });

    res.status(201).json({ message: 'Message submitted successfully', contact });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { status, response } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, response },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found', error: true });
    }

    res.json({ message: 'Contact updated successfully', contact });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found', error: true });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export default { getContacts, submitContact, updateContactStatus, deleteContact };
