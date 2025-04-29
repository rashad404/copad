import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TagIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { getAdminBlogPosts, deleteBlogPost } from '../../api';
import { format } from 'date-fns';

const AdminPostList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('all'); // all, published, draft
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    fetchPosts();
  }, [page, size, filter, sortBy, sortDirection]);

  const fetchPosts = async (search = searchTerm) => {
    try {
      setLoading(true);
      const response = await getAdminBlogPosts(page, size, sortBy, sortDirection);
      
      let fetchedPosts = [];
      if (response.data && response.data.content) {
        fetchedPosts = response.data.content;
        setTotalPages(response.data.totalPages);
      } else if (Array.isArray(response.data)) {
        fetchedPosts = response.data;
        setTotalPages(Math.ceil(response.data.length / size));
      }
      
      // Apply filters
      if (filter !== 'all') {
        const isPublished = filter === 'published';
        fetchedPosts = fetchedPosts.filter(post => post.published === isPublished);
      }
      
      // Apply search if provided
      if (search) {
        fetchedPosts = fetchedPosts.filter(post => 
          post.title?.toLowerCase().includes(search.toLowerCase()) || 
          post.summary?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlogPost(id);
      // Remove from selected posts if it was selected
      setSelectedPosts(prev => prev.filter(postId => postId !== id));
      // Refresh posts list
      fetchPosts();
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err.message || 'Failed to delete post');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPosts(posts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (id) => {
    setSelectedPosts(prev => {
      if (prev.includes(id)) {
        return prev.filter(postId => postId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleBulkDelete = async () => {
    if (confirm(t('admin.posts.confirmBulkDelete', { count: selectedPosts.length }))) {
      try {
        // In a real implementation, you might want to use a batch delete endpoint
        // For now, we'll delete one by one
        for (const id of selectedPosts) {
          await deleteBlogPost(id);
        }
        setSelectedPosts([]);
        fetchPosts();
      } catch (err) {
        console.error('Error performing bulk delete:', err);
        setError(err.message || 'Failed to delete selected posts');
      }
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('admin.posts.title')}</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {t('admin.posts.description')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/admin/posts/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {t('admin.posts.create')}
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{t('admin.filtersText')}:</span>
          <div className="ml-2 space-x-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                filter === 'all'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {t('admin.filters.all')}
            </button>
            <button
              type="button"
              onClick={() => setFilter('published')}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                filter === 'published'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {t('admin.filters.published')}
            </button>
            <button
              type="button"
              onClick={() => setFilter('draft')}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                filter === 'draft'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {t('admin.filters.draft')}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 sm:mt-0">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md"
                placeholder={t('admin.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('admin.search')}
            </button>
          </form>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="mt-4 bg-indigo-50 dark:bg-indigo-900 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-indigo-700 dark:text-indigo-300">
                {t('admin.posts.selected', { count: selectedPosts.length })}
              </span>
            </div>
            <div>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                {t('admin.posts.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
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

      {/* Posts Table */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-5/6"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        id="select-all"
                        name="select-all"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded"
                        checked={selectedPosts.length === posts.length && posts.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('title')}
                  >
                    <div className="flex items-center">
                      <span>{t('admin.posts.table.title')}</span>
                      {sortBy === 'title' && (
                        <span className="ml-2">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.posts.table.status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.posts.table.tags')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      <span>{t('admin.posts.table.created')}</span>
                      {sortBy === 'createdAt' && (
                        <span className="ml-2">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.posts.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          id={`select-${post.id}`}
                          name={`select-${post.id}`}
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded"
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => handleSelectPost(post.id)}
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
                        {post.tags && post.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag.id} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                                {tag.name}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic text-xs">{t('admin.posts.noTags')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.createdAt ? format(new Date(post.createdAt), 'PP') : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          to={`/blog/${post.slug}`} 
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <EyeIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">{t('admin.posts.view')}</span>
                        </Link>
                        <Link 
                          to={`/admin/posts/edit/${post.id}`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">{t('admin.posts.edit')}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(post.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">{t('admin.posts.delete')}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            <p>{t('admin.posts.empty')}</p>
            <Link 
              to="/admin/posts/create" 
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('admin.posts.create')}
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {posts.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between py-3 bg-white dark:bg-gray-800 px-4 mt-4 rounded-md shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage(page => Math.max(0, page - 1))}
              disabled={page === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 ${
                page === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t('admin.pagination.previous')}
            </button>
            <button
              onClick={() => setPage(page => Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 ${
                page === totalPages - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t('admin.pagination.next')}
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {t('admin.pagination.showing', {
                  from: page * size + 1,
                  to: Math.min((page + 1) * size, posts.length),
                  total: posts.length,
                })}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(page => Math.max(0, page - 1))}
                  disabled={page === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 ${
                    page === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="sr-only">{t('admin.pagination.previous')}</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {/* Page numbers */}
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number}
                    onClick={() => setPage(number)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      page === number
                        ? 'z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 text-indigo-600 dark:text-indigo-200'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } text-sm font-medium`}
                  >
                    {number + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setPage(page => Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 ${
                    page === totalPages - 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="sr-only">{t('admin.pagination.next')}</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

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
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDelete(confirmDelete)}
                >
                  {t('admin.posts.delete')}
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

export default AdminPostList;