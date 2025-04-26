import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { getAllTags, createTag } from '../../api';

const AdminTagManagement = () => {
  const { t } = useTranslation();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await getAllTags();
      
      if (response.data) {
        setTags(response.data);
      } else {
        setTags([]);
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError(err.message || 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTag = async (e) => {
    e.preventDefault();
    
    if (!newTagName.trim()) return;
    
    try {
      const response = await createTag(newTagName.trim());
      if (response.data) {
        setTags(prev => [...prev, response.data]);
        setNewTagName('');
        setSuccess(t('admin.tags.createSuccess'));
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error creating tag:', err);
      setError(err.message || 'Failed to create tag');
    }
  };

  const handleEditTag = (tag) => {
    setEditTagId(tag.id);
    setEditTagName(tag.name);
  };

  const handleUpdateTag = async (id) => {
    if (!editTagName.trim()) return;
    
    try {
      // In a real implementation, you would call an updateTag API
      // For this example, we'll update the local state as if the API call succeeded
      setTags(prev => 
        prev.map(tag => 
          tag.id === id ? { ...tag, name: editTagName.trim() } : tag
        )
      );
      
      setEditTagId(null);
      setEditTagName('');
      setSuccess(t('admin.tags.updateSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating tag:', err);
      setError(err.message || 'Failed to update tag');
    }
  };

  const handleCancelEdit = () => {
    setEditTagId(null);
    setEditTagName('');
  };

  const handleDeleteTag = async (id) => {
    try {
      // In a real implementation, you would call a deleteTag API
      // For this example, we'll update the local state as if the API call succeeded
      setTags(prev => prev.filter(tag => tag.id !== id));
      setConfirmDelete(null);
      setSuccess(t('admin.tags.deleteSuccess'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting tag:', err);
      setError(err.message || 'Failed to delete tag');
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('admin.tags.title')}</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {t('admin.tags.description')}
          </p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-900 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{t('common.error')}</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 dark:bg-green-900 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">{t('common.success')}</h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Tag Form */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('admin.tags.create')}</h2>
        <form onSubmit={handleCreateTag} className="flex">
          <input
            type="text"
            placeholder={t('admin.tags.namePlaceholder')}
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {t('admin.tags.add')}
          </button>
        </form>
      </div>

      {/* Tags List */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder={t('admin.tags.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        ) : filteredTags.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTags.map((tag) => (
              <li key={tag.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  {editTagId === tag.id ? (
                    <div className="flex-1 mr-4">
                      <input
                        type="text"
                        value={editTagName}
                        onChange={(e) => setEditTagName(e.target.value)}
                        className="block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mr-2">
                        {tag.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {tag.postCount !== undefined ? (
                          t('admin.tags.postsCount', { count: tag.postCount })
                        ) : null}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {editTagId === tag.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateTag(tag.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditTag(tag)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(tag.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-6 text-gray-500 dark:text-gray-400">
            {searchTerm ? t('admin.tags.noSearchResults') : t('admin.tags.noTags')}
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {confirmDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      {t('admin.tags.confirmDelete')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('admin.tags.deleteWarning')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteTag(confirmDelete)}
                >
                  {t('admin.tags.delete')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setConfirmDelete(null)}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTagManagement;