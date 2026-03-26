import React, { useState, useEffect } from 'react';
import {
  getContacts,
  updateContactStatus,
  deleteContact,
} from '../../services/api';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      alert('Error loading contacts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this contact?')) {
      try {
        await deleteContact(id);
        loadContacts();
      } catch (error) {
        alert('Error deleting contact: ' + error.message);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateContactStatus(id, { status: newStatus });
      loadContacts();
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  return (
    <div className="admin-section">
      <h2>Contact Messages ({contacts.length})</h2>

      {contacts.length === 0 ? (
        <p className="no-data">No contacts yet</p>
      ) : (
        <div className="contacts-list">
          {contacts.map((contact) => (
            <div key={contact._id} className="contact-card">
              <div className="contact-header">
                <div className="contact-info">
                  <h3>{contact.name}</h3>
                  <p>{contact.email}</p>
                  {contact.phone && <p>{contact.phone}</p>}
                </div>
                <div className="contact-actions">
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                    className={`status-select status-${contact.status}`}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                  </select>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(contact._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="contact-message">
                <p>{contact.message}</p>
              </div>

              {contact.response && (
                <div className="contact-response">
                  <strong>Response:</strong>
                  <p>{contact.response}</p>
                </div>
              )}

              <div className="contact-meta">
                <small>Received: {new Date(contact.createdAt).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
