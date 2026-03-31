import React from 'react';
import '../../styles/admin/AdminTable.css';

const AdminTable = ({ columns, data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <div className="no-data">No data available</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              {columns.map((col) => {
                let value = item[col];
                if (typeof value === 'boolean') {
                  value = value ? '✓' : '✗';
                } else if (Array.isArray(value)) {
                  value = value.slice(0, 2).join(', ') + (value.length > 2 ? '...' : '');
                } else if (value && typeof value === 'object') {
                  value = JSON.stringify(value).slice(0, 30) + '...';
                }
                return <td key={col}>{value || '-'}</td>;
              })}
              <td className="table-actions">
                <button className="edit-btn" onClick={() => onEdit(item)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => onDelete(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
