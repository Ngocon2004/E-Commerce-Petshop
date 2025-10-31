import React from 'react';
import { FiSearch } from 'react-icons/fi';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export const AdminPageHeader = ({ title, children }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="fw-bold text-dark mb-0">{title}</h2>
      {children}
    </div>
  );
};

export const AdminSearch = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
}) => {
  return (
    <div className="mb-4">
      <TextField
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: <FiSearch className="me-2 text-muted" />,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#f8f9fa',
            '&:hover': {
              backgroundColor: '#e9ecef',
            },
            '&.Mui-focused': {
              backgroundColor: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export const AdminTable = ({
  headers = [],
  data = [],
  emptyMessage = 'Không có dữ liệu',
  children,
}) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="bg-primary text-white">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="border-0 fw-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="text-center py-5">
                  <div className="text-muted">
                    <p className="mb-0">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-center py-3 border-top bg-light">
      <div className="d-flex align-items-center gap-2">
        <Button
          variant="outlined"
          disabled={currentPage === 1 || disabled}
          onClick={() => onPageChange(currentPage - 1)}
          size="small"
        >
          Trước
        </Button>
        <span className="px-3 py-1 bg-white rounded border text-muted">
          Trang {currentPage} / {totalPages}
        </span>
        <Button
          variant="outlined"
          disabled={currentPage >= totalPages || disabled}
          onClick={() => onPageChange(currentPage + 1)}
          size="small"
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

export const AdminCard = ({ title, children, className = '' }) => {
  return (
    <div className={`card shadow-sm border-0 ${className}`}>
      {title && (
        <div className="card-header bg-white border-0">
          <h5 className="card-title mb-0 fw-semibold">{title}</h5>
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

export const AdminGrid = ({ children, cols = 3, className = '' }) => {
  const colClass =
    {
      2: 'col-md-6',
      3: 'col-md-4',
      4: 'col-md-3',
      6: 'col-md-2',
    }[cols] || 'col-md-4';

  return (
    <div className={`row ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className={`${colClass} mb-4`}>
          {child}
        </div>
      ))}
    </div>
  );
};

export const AdminLoading = () => {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mt-2">Đang tải...</p>
    </div>
  );
};

export const AdminEmptyState = ({
  message = 'Không có dữ liệu',
  icon = 'fas fa-inbox',
}) => {
  return (
    <div className="text-center py-5">
      <p className="text-muted">{message}</p>
    </div>
  );
};
