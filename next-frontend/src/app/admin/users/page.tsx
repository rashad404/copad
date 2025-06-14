'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Trash2, 
  Search, 
  User, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Eye, 
  EyeOff,
  UserX,
  UserCheck
} from 'lucide-react';
import { getAllUsers, updateUserRole, deleteUser, activateUser, deactivateUser } from '@/api/admin';
import { UserListItem } from '@/api/admin';

export default function AdminUserManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'admin', 'user'
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToUpdateRole, setUserToUpdateRole] = useState<UserListItem | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers(page, pageSize);
      
      // Handle response based on backend implementation
      if (response.data && response.data.content) {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
        // Estimate total pages if not provided
        setTotalPages(Math.ceil(response.data.length / pageSize));
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || t('common.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount and when page/pageSize changes
  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, t]);

  // Filter users when search query or filter changes
  useEffect(() => {
    if (!users.length) {
      setFilteredUsers([]);
      return;
    }
    
    let filtered = [...users];
    
    // Apply role filter
    if (filter === 'admin') {
      filtered = filtered.filter(user => user.roles.includes('ADMIN'));
    } else if (filter === 'user') {
      filtered = filtered.filter(user => !user.roles.includes('ADMIN'));
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user => user.name.toLowerCase().includes(query) || 
               user.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchQuery, filter, users]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const openRoleModal = (user: UserListItem) => {
    setUserToUpdateRole(user);
    setSelectedRole(user.roles.includes('ADMIN') ? 'ADMIN' : 'USER');
    setShowRoleModal(true);
  };

  const handleRoleUpdate = async () => {
    if (!userToUpdateRole || !selectedRole) return;
    
    try {
      setIsUpdating(true);
      
      await updateUserRole(userToUpdateRole.id, selectedRole);
      
      // Update user in list
      setUsers(users.map(u => {
        if (u.id === userToUpdateRole.id) {
          // Create a new roles array based on the selected role
          const newRoles = selectedRole === 'ADMIN' 
            ? ['USER', 'ADMIN']  // If ADMIN, include both USER and ADMIN roles
            : ['USER'];          // If USER, only include USER role
            
          return { ...u, roles: newRoles };
        }
        return u;
      }));
      
      // Close modal
      setShowRoleModal(false);
      setUserToUpdateRole(null);
      
      // Show success message
      setSuccessMessage(t('admin.users.roleUpdateSuccess'));
      
    } catch (err: any) {
      console.error('Error updating user role:', err);
      setError(err.message || t('common.errors.generic'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleUserStatus = async (user: UserListItem) => {
    try {
      setIsUpdating(true);
      
      if (user.active) {
        await deactivateUser(user.id);
      } else {
        await activateUser(user.id);
      }
      
      // Update user in list
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, active: !u.active } : u
      ));
      
      // Show success message
      setSuccessMessage(
        user.active 
          ? t('admin.users.deactivateSuccess') 
          : t('admin.users.activateSuccess')
      );
      
    } catch (err: any) {
      console.error('Error toggling user status:', err);
      setError(err.message || t('common.errors.generic'));
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDeleteUser = (user: UserListItem) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      
      await deleteUser(userToDelete.id);
      
      // Remove user from list
      setUsers(users.filter(u => u.id !== userToDelete.id));
      
      // Close modal
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      // Show success message
      setSuccessMessage(t('admin.users.deleteSuccess'));
      
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.message || t('common.errors.generic'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('admin.users.title')}</h1>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 p-4 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-md flex items-center">
          <XCircle className="h-5 w-5 mr-2" />
          {error}
          <button
            className="ml-auto text-sm font-medium text-red-700 dark:text-red-200 hover:text-red-800 dark:hover:text-red-100"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-6">
            <div className="w-full sm:w-64">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('admin.users.search')}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'all' 
                    ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => setFilter('all')}
              >
                <User className="h-4 w-4 inline mr-1" />
                {t('admin.users.filters.all')}
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'admin' 
                    ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => setFilter('admin')}
              >
                <Shield className="h-4 w-4 inline mr-1" />
                {t('admin.users.filters.admins')}
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === 'user' 
                    ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => setFilter('user')}
              >
                <User className="h-4 w-4 inline mr-1" />
                {t('admin.users.filters.regularUsers')}
              </button>
            </div>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="animate-pulse py-8">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.users.table.user')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.users.table.role')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.users.table.status')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.users.table.joined')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.users.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openRoleModal(user)}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.roles.includes('ADMIN')
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          }`}
                        >
                          {user.roles.includes('ADMIN') ? (
                            <Shield className="h-3 w-3 inline mr-1" />
                          ) : (
                            <User className="h-3 w-3 inline mr-1" />
                          )}
                          {user.roles.includes('ADMIN') 
                            ? t('admin.users.roles.admin') 
                            : t('admin.users.roles.user')}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.active
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {user.active 
                            ? t('admin.users.status.active') 
                            : t('admin.users.status.inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={`text-${user.active ? 'yellow' : 'green'}-600 hover:text-${user.active ? 'yellow' : 'green'}-900 dark:text-${user.active ? 'yellow' : 'green'}-400 dark:hover:text-${user.active ? 'yellow' : 'green'}-300`}
                            title={user.active ? t('admin.users.deactivate') : t('admin.users.activate')}
                          >
                            {user.active ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(user)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title={t('admin.users.delete')}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <User className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-lg">
                {searchQuery
                  ? t('admin.users.noSearchResults')
                  : t('admin.users.noUsers')}
              </p>
            </div>
          )}

          {/* Pagination - would implement if needed */}
        </div>
      </div>

      {/* Role Update Modal */}
      {showRoleModal && userToUpdateRole && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 sm:mx-0 sm:h-10 sm:w-10">
                    <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {t('admin.users.updateRole')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('admin.users.updateRoleDescription')}
                      </p>
                      <div className="mt-2">
                        <label className="text-gray-700 dark:text-gray-300 text-sm font-medium">{t('admin.users.selectRole')}:</label>
                        <div className="mt-1 space-y-2">
                          <div className="flex items-center">
                            <input
                              id="role-user"
                              name="role"
                              type="radio"
                              checked={selectedRole === 'USER'}
                              onChange={() => setSelectedRole('USER')}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                            />
                            <label htmlFor="role-user" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                              <User className="h-4 w-4 inline mr-1" />
                              {t('admin.users.roles.user')}
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="role-admin"
                              name="role"
                              type="radio"
                              checked={selectedRole === 'ADMIN'}
                              onChange={() => setSelectedRole('ADMIN')}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                            />
                            <label htmlFor="role-admin" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                              <Shield className="h-4 w-4 inline mr-1" />
                              {t('admin.users.roles.admin')}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleRoleUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin mr-2"></div>
                  ) : null}
                  {t('admin.users.saveRole')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowRoleModal(false);
                    setUserToUpdateRole(null);
                  }}
                  disabled={isUpdating}
                >
                  {t('admin.posts.form.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-300" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {t('admin.users.confirmDelete')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('admin.users.deleteWarning')}
                      </p>
                      <div className="mt-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{userToDelete.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{userToDelete.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin mr-2"></div>
                  ) : null}
                  {t('admin.users.delete')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  disabled={isDeleting}
                >
                  {t('admin.posts.form.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}