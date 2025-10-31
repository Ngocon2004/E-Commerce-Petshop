import React from 'react';
import { FiX } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

const AdminModal = ({
  show,
  onClose,
  title,
  children,
  size = 'lg',
  footer,
}) => {
  if (!show) return null;

  const sizeClass =
    {
      sm: 'modal-sm',
      lg: 'modal-lg',
      xl: 'modal-xl',
    }[size] || 'modal-lg';

  return (
    <>
      <div
        className="modal show d-block"
        tabIndex="-1"
        style={{ zIndex: 1050 }}
      >
        <div className={`modal-dialog ${sizeClass} modal-dialog-scrollable`}>
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title fw-bold">{title}</h5>
              <div
                className="close_ "
                onClick={onClose}
                style={{ cursor: 'pointer' }}
              >
                <IoMdClose style={{ fontSize: '24px' }} />
              </div>
            </div>
            <div
              className="modal-body p-4"
              style={{ maxHeight: '70vh', overflowY: 'auto' }}
            >
              {children}
            </div>
            {footer && (
              <div className="modal-footer bg-light border-0">{footer}</div>
            )}
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
    </>
  );
};

export default AdminModal;
