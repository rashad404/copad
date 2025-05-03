'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Eye, 
  Search,
  ChevronLeft, 
  ChevronRight, 
  Filter 
} from 'lucide-react';
import { getAllPosts, deletePost } from '@/api/admin';
import { BlogPostListItem } from '@/api/blog';

export default function AdminPostList() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllPosts(page, pageSize, sortBy, sortDirection);
      
      // Handle response format based on backend implementation
      if (response.data && response.data.content) {
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else if (Array.isArray(response.data)) {
        setPosts(response.data);
        // Estimate total pages if not provided
        setTotalPages(Math.ceil(response.data.length / pageSize));
        setTotalElements(response.data.length);
      }
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message || t('common.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, pageSize, sortBy, sortDirection, t]);

  // Filter posts based on selected filter
  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    if (filter === 'published') return post.published;
    if (filter === 'draft') return !post.published;
    return true;
  }).filter((post) => {
    if (!searchText) return true;
    return post.title.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleDeleteClick = (id: number) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        // Update the posts list after deletion
        setPosts(posts.filter(post => post.id !== postToDelete));
        
        // If we deleted the last post on this page and it's not the first page, go to previous page
        if (filteredPosts.length === 1 && page > 0) {
          setPage(page - 1);
        } else {
          // Otherwise, refetch the current page
          fetchPosts();
        }
      } catch (err: any) {
        console.error('Error deleting post:', err);
        setError(err.message || t('common.errors.generic'));
      } finally {
        // Close modal regardless of result
        setShowDeleteModal(false);
        setPostToDelete(null);
      }
    }
  };

  const toggleSelectPost = (id: number) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(postId => postId !== id));
    } else {
      setSelectedPosts([...selectedPosts, id]);
    }
  };

  const selectAllPosts = () => {
    if (selectedPosts.length === filteredPosts.length) {
      // Deselect all if all are selected
      setSelectedPosts([]);
    } else {
      // Select all filtered posts
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('admin.posts.title')}</h1>
        <Link 
          href="/admin/posts/create" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          {t('admin.posts.create')}
        </Link>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
            <Filter className="inline h-4 w-4 mr-1" />
            {t('admin.filtersText')}:
          </span>
          <select 
            className="border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">{t('admin.filters.all')}</option>
            <option value="published">{t('admin.filters.published')}</option>
            <option value="draft">{t('admin.filters.draft')}</option>
          </select>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder={t('admin.search')}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Selected posts actions */}
      {selectedPosts.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 p-3 mb-4 rounded-md flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t('admin.posts.selected', { count: selectedPosts.length })}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                // Bulk delete logic would go here
                // For now, just clear selection
                setSelectedPosts([]);
              }} 
              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-1 h-4 w-4" aria-hidden="true" />
              {t('admin.posts.delete')}
            </button>
          </div>
        </div>
      )}

      {/* Posts table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="animate-pulse py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-5/6"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">
            <p>{error}</p>
            <button 
              onClick={() => fetchPosts()} 
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                        checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                        onChange={selectAllPosts}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('admin.posts.table.title')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('admin.posts.table.status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('admin.posts.table.tags')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('admin.posts.table.created')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('admin.posts.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                            checked={selectedPosts.includes(post.id)}
                            onChange={() => toggleSelectPost(post.id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{post.summary}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.published 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {post.published ? t('admin.posts.published') : t('admin.posts.draft')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {post.tags && post.tags.length > 0 
                            ? post.tags.map(tag => tag.name).join(', ') 
                            : t('admin.posts.noTags')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.publishedAt || "").toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/blog/${post.slug}`} 
                            target="_blank"
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <Eye className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">{t('admin.posts.view')}</span>
                          </Link>
                          <Link 
                            href={`/admin/posts/edit/${post.id}`} 
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Pencil className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">{t('admin.posts.edit')}</span>
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(post.id)} 
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">{t('admin.posts.delete')}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <p>{t('admin.posts.empty')}</p>
                      <Link 
                        href="/admin/posts/create" 
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                        {t('admin.posts.create')}
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {t('admin.pagination.showing', {
                        from: page * pageSize + 1,
                        to: Math.min((page + 1) * pageSize, totalElements),
                        total: totalElements
                      })}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                          page === 0 
                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="sr-only">{t('admin.pagination.previous')}</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {/* Page number display */}
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {page + 1} / {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                          page >= totalPages - 1 
                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="sr-only">{t('admin.pagination.next')}</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
                      {t('admin.posts.confirmDelete')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('admin.posts.deleteWarning')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  {t('admin.posts.delete')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
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