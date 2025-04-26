import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  DocumentTextIcon, 
  TagIcon, 
  UsersIcon,
  ChartBarIcon,
  EyeIcon,
  PencilSquareIcon 
} from '@heroicons/react/24/outline';
import { getBlogPosts, getTopTags } from '../api';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalTags: 0,
    totalUsers: 0,
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts data
        const postsResponse = await getBlogPosts(0, 5, 'createdAt', 'desc');
        let posts = [];
        let publishedCount = 0;
        let draftCount = 0;
        
        if (postsResponse.data && postsResponse.data.content) {
          posts = postsResponse.data.content;
          publishedCount = posts.filter(post => post.published).length;
          draftCount = posts.filter(post => !post.published).length;
        } else if (Array.isArray(postsResponse.data)) {
          posts = postsResponse.data;
          publishedCount = posts.filter(post => post.published).length;
          draftCount = posts.filter(post => !post.published).length;
        }
        
        // Fetch tags data
        const tagsResponse = await getTopTags(100);
        const tagsCount = Array.isArray(tagsResponse.data) ? tagsResponse.data.length : 0;
        
        // Update stats (users would need a separate API call in a real implementation)
        setStats({
          totalPosts: publishedCount + draftCount,
          publishedPosts: publishedCount,
          draftPosts: draftCount,
          totalTags: tagsCount,
          totalUsers: 5, // This is a placeholder; would come from an API in production
        });
        
        setRecentPosts(posts.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-white">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5 bg-gray-200 dark:bg-gray-700 h-8 w-48 rounded"></h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
          ))}
        </div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mt-8 mb-4 bg-gray-200 dark:bg-gray-700 h-6 w-32 rounded"></h2>
        <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{t('common.error')}</h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {t('common.retry')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5">{t('admin.dashboard')}</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title={t('admin.stats.totalPosts')} 
          value={stats.totalPosts} 
          icon={DocumentTextIcon} 
          color="bg-indigo-500"
        />
        <StatCard 
          title={t('admin.stats.publishedPosts')} 
          value={stats.publishedPosts} 
          icon={EyeIcon} 
          color="bg-green-500"
        />
        <StatCard 
          title={t('admin.stats.draftPosts')} 
          value={stats.draftPosts} 
          icon={PencilSquareIcon} 
          color="bg-yellow-500"
        />
        <StatCard 
          title={t('admin.stats.tags')} 
          value={stats.totalTags} 
          icon={TagIcon} 
          color="bg-purple-500"
        />
        <StatCard 
          title={t('admin.stats.users')} 
          value={stats.totalUsers} 
          icon={UsersIcon} 
          color="bg-blue-500"
        />
        <StatCard 
          title={t('admin.stats.views')} 
          value="1,234" 
          icon={ChartBarIcon} 
          color="bg-pink-500"
        />
      </div>
      
      {/* Recent Posts */}
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mt-8 mb-4">{t('admin.recentPosts')}</h2>
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <li key={post.id}>
                <Link to={`/admin/posts/edit/${post.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                          {post.title}
                        </p>
                        <div className={`ml-2 flex-shrink-0 flex ${post.published ? 'text-green-400' : 'text-yellow-400'}`}>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.published 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {post.published ? t('admin.posts.published') : t('admin.posts.draft')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex sm:flex-col">
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <TagIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                            {post.tags.map(tag => tag.name).join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                        <UsersIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                        <p>
                          {post.author ? post.author.fullName : t('admin.unknownAuthor')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              <p>{t('admin.noPosts')}</p>
              <Link 
                to="/admin/posts/create" 
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t('admin.posts.create')}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;