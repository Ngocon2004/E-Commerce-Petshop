import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import Chip from '@mui/material/Chip';
import {
  AdminPageHeader,
  AdminSearch,
  AdminTable,
  AdminLoading,
  ActionButtons,
  AdminModal,
  AdminForm,
  FormGroup,
  FormInput,
  FormSelect,
  AddButton,
} from '../../components/Admin';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_email: '',
    user_password: '',
    user_name: '',
    user_gender: 'male',
    user_birth: '',
    user_role: 'user',
    user_active: true,
  });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers({
        search: searchTerm ? searchTerm : undefined,
      });
      if (response?.data) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      return;
    }

    try {
      await adminAPI.deleteUser(id);
      toast.success('Đã xóa người dùng');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Không thể xóa người dùng');
    }
  };

  const handleToggleActive = async (user, isActive) => {
    try {
      await adminAPI.updateUser(user.id, { user_active: !isActive });
      toast.success('Đã cập nhật trạng thái người dùng');
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleCreateUser = async e => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      if (formData.user_password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự');
        setCreateLoading(false);
        return;
      }
      if (formData.user_name.length < 2) {
        toast.error('Tên phải có ít nhất 2 ký tự');
        setCreateLoading(false);
        return;
      }
      if (!formData.user_email.includes('@')) {
        toast.error('Email không hợp lệ');
        setCreateLoading(false);
        return;
      }
      if (formData.user_gender === '') {
        toast.error('Giới tính không được để trống');
        setCreateLoading(false);
        return;
      }
      if (formData.user_birth === '') {
        toast.error('Ngày sinh không được để trống');
        setCreateLoading(false);
        return;
      }
      if (formData.user_role === '') {
        toast.error('Vai trò không được để trống');
        setCreateLoading(false);
        return;
      }
      await adminAPI.createUser(formData);
      toast.success('Đã tạo người dùng mới');
      setShowCreateModal(false);
      setFormData({
        user_email: '',
        user_password: '',
        user_name: '',
        user_gender: 'male',
        user_birth: '',
        user_role: 'user',
        user_active: true,
      });
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Không thể tạo người dùng');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div>
      <AdminPageHeader title="Người dùng" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <AdminSearch
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm người dùng..."
        />
        <AddButton onClick={() => setShowCreateModal(true)}>
          Thêm người dùng
        </AddButton>
      </div>

      <AdminTable
        headers={[
          'ID',
          'Tên',
          'Email',
          'Vai trò',
          'Trạng thái',
          'Ngày tạo',
          'Thao tác',
        ]}
        data={users}
        emptyMessage="Không có người dùng nào"
      >
        {users.map(user => (
          <tr key={user.id}>
            <td>
              <span className="badge">#{user.id}</span>
            </td>
            <td>
              <strong className="text-dark">{user.user_name || 'N/A'}</strong>
            </td>
            <td>
              <span className="text-muted">{user.user_email}</span>
            </td>
            <td>
              <Chip
                label={user.user_role || 'user'}
                color={user.user_role === 'admin' ? 'primary' : 'default'}
                size="small"
                variant="outlined"
              />
            </td>
            <td>
              <Chip
                label={user.user_active ? 'Hoạt động' : 'Vô hiệu hóa'}
                color={user.user_active ? 'success' : 'error'}
                size="small"
                variant="outlined"
              />
            </td>
            <td>
              <small className="text-muted">
                {new Date(user.created_at).toLocaleDateString('vi-VN')}
              </small>
            </td>
            <td>
              <div className="d-flex gap-2">
                <button
                  className={`btn btn-sm mr-2 ${user.user_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                  onClick={() => handleToggleActive(user, user.user_active)}
                  title={user.user_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                >
                  {user.user_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                </button>
                <ActionButtons
                  onDelete={() => handleDelete(user.id)}
                  showView={false}
                  showEdit={false}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      {/* Create User Modal */}
      <AdminModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        title="Tạo người dùng mới"
        size="lg"
      >
        <AdminForm onSubmit={handleCreateUser}>
          <FormGroup label="Email" required>
            <FormInput
              name="user_email"
              type="email"
              value={formData.user_email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup label="Mật khẩu" required>
            <FormInput
              name="user_password"
              type="password"
              value={formData.user_password}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup label="Tên" required>
            <FormInput
              name="user_name"
              type="text"
              value={formData.user_name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup label="Giới tính" required>
            <FormSelect
              name="user_gender"
              className="form-control"
              value={formData.user_gender}
              onChange={handleInputChange}
              options={[
                { value: 'male', label: 'Nam' },
                { value: 'female', label: 'Nữ' },
                { value: 'other', label: 'Khác' },
              ]}
            />
          </FormGroup>

          <FormGroup label="Ngày sinh" required>
            <FormInput
              name="user_birth"
              type="date"
              value={formData.user_birth}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup label="Vai trò" required>
            <FormSelect
              label="Vai trò"
              name="user_role"
              value={formData.user_role}
              className="form-control"
              onChange={handleInputChange}
              options={[
                { value: 'user', label: 'Người dùng' },
                { value: 'admin', label: 'Quản trị viên' },
              ]}
            />
          </FormGroup>

          <FormGroup>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="user_active"
                checked={formData.user_active}
                onChange={handleInputChange}
                id="user_active"
              />
              <label className="form-check-label" htmlFor="user_active">
                Tài khoản hoạt động
              </label>
            </div>
          </FormGroup>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary mr-2"
              onClick={() => setShowCreateModal(false)}
              disabled={createLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createLoading}
            >
              {createLoading ? 'Đang tạo...' : 'Tạo người dùng'}
            </button>
          </div>
        </AdminForm>
      </AdminModal>
    </div>
  );
};

export default AdminUsers;
