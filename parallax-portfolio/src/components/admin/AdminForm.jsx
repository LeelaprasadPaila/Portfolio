import React from 'react';
import '../../styles/admin/AdminForm.css';

const AdminForm = ({
  title,
  fields,
  formData,
  setFormData,
  onSubmit,
  isLoading,
  onCancel,
  submitText = 'Submit',
  onFieldChange,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Allow custom field change handler if provided
    if (onFieldChange && onFieldChange(name, value, type, checked, files)) {
      return;
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="form-groups">
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                disabled={isLoading}
                rows="4"
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                disabled={isLoading}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="checkbox-wrapper">
                <input
                  id={field.name}
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name] || false}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor={field.name} className="checkbox-label">
                  {field.label}
                </label>
              </div>
            ) : (
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                value={
                  field.type === 'file'
                    ? ''
                    : formData[field.name] || ''
                }
                onChange={handleChange}
                placeholder={field.placeholder}
                accept={field.accept}
                required={field.required}
                disabled={isLoading}
              />
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : submitText}
        </button>
        {onCancel && (
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AdminForm;
