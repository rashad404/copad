'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PlusCircle, 
  Trash2, 
  Search, 
  Tag as TagIcon, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { getAllTags, createTag, updateTag, deleteTag } from '@/api/admin';
import { Tag } from '@/api/blog';

export default function AdminTagManagement() {
  const { t } = useTranslation();
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch tags
  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTags();
      
      // Handle response based on backend implementation
      if (Array.isArray(response.data)) {
        setTags(response.data);
        setFilteredTags(response.data);
      } else {
        // Handle case where response might be wrapped
        setTags([]);
        setFilteredTags([]);
      }
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      setError(err.message || t('common.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  // Load tags on component mount
  useEffect(() => {
    fetchTags();
  }, [t]);

  // Filter tags when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTags(tags);
    } else {
      const filtered = tags.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [searchQuery, tags]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTagName.trim()) return;
    
    try {
      setIsCreating(true);
      
      // Check if tag already exists
      const exists = tags.some(tag => 
        tag.name.toLowerCase() === newTagName.trim().toLowerCase()
      );
      
      if (exists) {
        setError(t('admin.tags.alreadyExists', { name: newTagName }));
        return;
      }
      
      const response = await createTag(newTagName.trim());
      
      // Add new tag to list
      setTags([...tags, response.data]);
      
      // Clear input
      setNewTagName('');
      
      // Show success message
      setSuccessMessage(t('admin.tags.createSuccess'));
      
      // Clear any error
      setError(null);
    } catch (err: any) {
      console.error('Error creating tag:', err);
      setError(err.message || t('common.errors.generic'));
    } finally {
      setIsCreating(false);
    }
  };

  const startEditingTag = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const cancelEditingTag = () => {
    setEditingTagId(null);
    setEditingTagName('');
  };

  const saveTagEdit = async (tag: Tag) => {
    if (!editingTagName.trim() || editingTagName === tag.name) {
      cancelEditingTag();
      return;
    }
    
    try {
      setIsEditing(true);
      
      // Check if tag name already exists
      const exists = tags.some(t => 
        t.id !== tag.id && 
        t.name.toLowerCase() === editingTagName.trim().toLowerCase()
      );
      
      if (exists) {
        setError(t('admin.tags.alreadyExists', { name: editingTagName }));
        return;
      }
      
      const response = await updateTag(tag.id, editingTagName.trim());
      
      // Update tag in list
      setTags(tags.map(t => t.id === tag.id ? response.data : t));
      
      // Clear editing state
      cancelEditingTag();
      
      // Show success message
      setSuccessMessage(t('admin.tags.updateSuccess'));
      
      // Clear any error
      setError(null);
    } catch (err: any) {
      console.error('Error updating tag:', err);
      setError(err.message || t('common.errors.generic'));
    } finally {
      setIsEditing(false);
    }
  };

  const confirmDeleteTag = (tag: Tag) => {
    setTagToDelete(tag);
    setShowDeleteModal(true);
  };

  const handleDeleteTag = async () => {
    if (!tagToDelete) return;
    
    try {
      setIsDeleting(true);
      
      await deleteTag(tagToDelete.id);
      
      // Remove tag from list
      setTags(tags.filter(t => t.id !== tagToDelete.id));
      
      // Close modal
      setShowDeleteModal(false);
      setTagToDelete(null);
      
      // Show success message
      setSuccessMessage(t('admin.tags.deleteSuccess'));
      
      // Clear any error
      setError(null);
    } catch (err: any) {
      console.error('Error deleting tag:', err);
      setError(err.message || t('common.errors.generic'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('admin.tags.title')}</h1>
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
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Create Tag Form */}
          <form onSubmit={handleCreateTag} className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {t('admin.tags.create')}
            </h2>
            <div className="flex">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder={t('admin.tags.namePlaceholder')}
                className="flex-1 rounded-l-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={isCreating || !newTagName.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <PlusCircle className="h-4 w-4 mr-2" />
                )}
                {t('admin.tags.add')}
              </button>
            </div>
          </form>

          {/* Search and Filter */}
          <div className="mb-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('admin.tags.search')}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Tags List */}
          {loading ? (
            <div className="animate-pulse py-8">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-5/6"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
            </div>
          ) : filteredTags.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTags.map(tag => (
                <li key={tag.id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TagIcon className="h-5 w-5 text-indigo-500 mr-3" />
                      
                      {editingTagId === tag.id ? (
                        <input
                          type="text"
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveTagEdit(tag);
                            } else if (e.key === 'Escape') {
                              cancelEditingTag();
                            }
                          }}
                        />
                      ) : (
                        <div 
                          className="text-gray-900 dark:text-white font-medium cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-400"
                          onClick={() => startEditingTag(tag)}
                        >
                          {tag.name}
                        </div>
                      )}
                      
                      {tag.postCount !== undefined && (
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                          {t('admin.tags.postsCount', { count: tag.postCount })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {editingTagId === tag.id ? (
                        <>
                          <button
                            type="button"
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            onClick={() => saveTagEdit(tag)}
                            disabled={isEditing}
                          >
                            <CheckCircle className="h-5 w-5" />
                            <span className="sr-only">Save</span>
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={cancelEditingTag}
                            disabled={isEditing}
                          >
                            <XCircle className="h-5 w-5" />
                            <span className="sr-only">Cancel</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => confirmDeleteTag(tag)}
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">{t('admin.tags.delete')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchQuery ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <TagIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-lg">{t('admin.tags.noSearchResults')}</p>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <TagIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-lg">{t('admin.tags.noTags')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && tagToDelete && (
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
                      {t('admin.tags.confirmDelete')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('admin.tags.deleteWarning')}
                      </p>
                      <p className="mt-2 font-medium text-gray-900 dark:text-white">
                        {tagToDelete.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteTag}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin mr-2"></div>
                  ) : null}
                  {t('admin.tags.delete')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTagToDelete(null);
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