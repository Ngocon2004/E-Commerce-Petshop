import React from 'react';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiSave,
} from 'react-icons/fi';
import Button from '@mui/material/Button';

export const AddButton = ({
  onClick,
  children = 'Thêm mới',
  variant = 'contained',
}) => {
  return (
    <Button
      variant={variant}
      startIcon={<FiPlus />}
      onClick={onClick}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1,
        mr: 2,
      }}
    >
      {children}
    </Button>
  );
};

export const EditButton = ({ onClick, size = 'small' }) => {
  return (
    <button
      className={`btn btn-sm btn-outline-primary ${size === 'small' ? 'px-2 py-1' : 'px-3 py-2'} mr-2`}
      onClick={onClick}
      style={{ borderRadius: '8px' }}
      title="Chỉnh sửa"
    >
      <FiEdit />
    </button>
  );
};

export const DeleteButton = ({ onClick, size = 'small' }) => {
  return (
    <button
      className={`btn btn-sm btn-outline-danger ${size === 'small' ? 'px-2 py-1' : 'px-3 py-2'} mr-2`}
      onClick={onClick}
      style={{ borderRadius: '8px' }}
      title="Xóa"
    >
      <FiTrash2 />
    </button>
  );
};

export const ViewButton = ({ onClick, size = 'small' }) => {
  return (
    <button
      className={`btn btn-sm btn-outline-info ${size === 'small' ? 'px-2 py-1' : 'px-3 py-2'} mr-2`}
      onClick={onClick}
      style={{ borderRadius: '8px' }}
      title="Xem chi tiết"
    >
      <FiEye />
    </button>
  );
};

export const ToggleButton = ({ onClick, isActive, size = 'small' }) => {
  return (
    <button
      className={`btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-success'} ${size === 'small' ? 'px-2 py-1' : 'px-3 py-2'}`}
      onClick={onClick}
      style={{ borderRadius: '8px' }}
      title={isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
    >
      {isActive ? <FiX /> : <FiCheck />}
    </button>
  );
};

export const SaveButton = ({ onClick, loading = false, children = 'Lưu' }) => {
  return (
    <Button
      variant="contained"
      startIcon={<FiSave />}
      onClick={onClick}
      disabled={loading}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1,
      }}
    >
      {loading ? 'Đang lưu...' : children}
    </Button>
  );
};

export const CancelButton = ({ onClick, children = 'Hủy' }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1,
        mr: 2,
      }}
    >
      {children}
    </Button>
  );
};

export const ActionButtons = ({
  onEdit,
  onDelete,
  onView,
  onToggle,
  isActive,
  showEdit = true,
  showDelete = true,
  showView = false,
  showToggle = false,
}) => {
  return (
    <div className="d-flex gap-2">
      {showView && <ViewButton onClick={onView} />}
      {showEdit && <EditButton onClick={onEdit} />}
      {showToggle && <ToggleButton onClick={onToggle} isActive={isActive} />}
      {showDelete && <DeleteButton onClick={onDelete} />}
    </div>
  );
};
