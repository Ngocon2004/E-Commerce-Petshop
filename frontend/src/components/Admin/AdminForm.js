import React from 'react';

const AdminForm = ({ onSubmit, children, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
};

export const FormGroup = ({
  label,
  required = false,
  children,
  className = '',
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      <label className="form-label fw-semibold text-dark">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      {children}
    </div>
  );
};

export const FormInput = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      className={`form-control ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      {...props}
    />
  );
};

export const FormSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Chọn...',
  required = false,
  className = '',
  ...props
}) => {
  return (
    <select
      className={`form-select ${className}`}
      value={value}
      onChange={onChange}
      required={required}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const FormTextarea = ({
  value,
  onChange,
  rows = 3,
  placeholder,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <textarea
      className={`form-control ${className}`}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      required={required}
      {...props}
    />
  );
};

export const FormImagePreview = ({ src, alt = 'Preview', className = '' }) => {
  if (!src) return null;

  return (
    <div className="mt-2">
      <img
        src={src}
        alt={alt}
        className={`img-thumbnail ${className}`}
        style={{
          maxWidth: '200px',
          maxHeight: '150px',
          objectFit: 'cover',
        }}
        onError={e => {
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default AdminForm;
