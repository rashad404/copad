import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PencilIcon, PlusIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { getBlogPosts, getTopTags } from '../api';
import BlogPostCard from '../components/BlogPostCard';
import TagList from '../components/TagList';
import BlogSearch from '../components/BlogSearch';
import Breadcrumb from '../components/Breadcrumb';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import i18n from '../i18n';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const isAdmin = isAuthenticated && user?.roles?.includes('ADMIN');
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setPostsLoading(true);
        setTagsLoading(true);
        
        console.log("THIS IS CALLED");
        // Fetch posts and tags in parallel
        const [postsResponse, tagsResponse] = await Promise.all([
          getBlogPosts(0, 9, 'publishedAt', 'desc', i18n.language),
          getTopTags(10)
        ]);
        
        // Check if the response has content property (it should be a Spring Data Page object)
        if (postsResponse.data && postsResponse.data.content) {
          setPosts(postsResponse.data.content);
          setHasMore(postsResponse.data.content.length < postsResponse.data.totalElements);
        } else if (Array.isArray(postsResponse.data)) {
          // Handle case where the API returns an array directly
          setPosts(postsResponse.data);
          setHasMore(false); // Can't determine if there's more without page info
        } else {
          // Fallback to empty array
          setPosts([]);
          setHasMore(false);
        }
        
        // Handle tags with similar safety checks
        if (tagsResponse.data) {
          setTags(Array.isArray(tagsResponse.data) ? tagsResponse.data : []);
        } else {
          setTags([]);
        }
        setPage(0);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError(err.response?.data?.message || err.message || t('common.errors.generic'));
      } finally {
        setPostsLoading(false);
        setTagsLoading(false);
      }
    };
    
    fetchInitialData();
    
    // Add scroll event listener for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [t, i18n.language]);
  
  const loadMorePosts = async () => {
    if (!hasMore) return;
    
    try {
      setPostsLoading(true);
      const nextPage = page + 1;
      const response = await getBlogPosts(nextPage, 9, 'publishedAt', 'desc', i18n.language);
      
      if (response.data && response.data.content && response.data.content.length > 0) {
        setPosts(prev => [...prev, ...response.data.content]);
        setPage(nextPage);
        setHasMore(posts.length + response.data.content.length < response.data.totalElements);
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        setPosts(prev => [...prev, ...response.data]);
        setPage(nextPage);
        setHasMore(false); // Can't determine if there's more without page info
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more posts:', err);
      setError(err.response?.data?.message || err.message || t('common.errors.generic'));
    } finally {
      setPostsLoading(false);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 font-medium">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorBoundary>
          <Breadcrumb 
            items={[
              { label: t('navbar.home'), to: '/' },
              { label: t('blog.title') }
            ]}
          />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('blog.title')}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">{t('blog.subtitle')}</p>
            </div>
            
            {isAdmin && (
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Link 
                  to="/blog/new" 
                  className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg transition-colors shadow-sm"
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  {t('blog.admin.createPost')}
                </Link>
                <Link 
                  to="/blog/manage-tags" 
                  className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors shadow-sm"
                >
                  <PencilIcon className="h-5 w-5 mr-1" />
                  {t('blog.admin.manageTags')}
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-3/4">
              {postsLoading && posts.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-xl bg-gray-200 dark:bg-gray-700 h-80"></div>
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                  
                  {hasMore && (
                    <div className="mt-10 text-center">
                      <button
                        onClick={loadMorePosts}
                        disabled={postsLoading}
                        className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium rounded-full border border-gray-300 dark:border-gray-600 shadow-sm transition-colors duration-200 disabled:opacity-70"
                      >
                        {postsLoading ? t('common.loading') : t('common.loadMore')}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">{t('blog.empty.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{t('blog.empty.description')}</p>
                  {isAdmin && (
                    <Link 
                      to="/blog/new" 
                      className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                    >
                      <PlusIcon className="h-5 w-5 mr-1" />
                      {t('blog.admin.createPost')}
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            <div className="w-full lg:w-1/4 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('blog.search.title')}</h3>
                <BlogSearch />
              </div>
              
              {tagsLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : tags.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('blog.filter.byTag')}</h3>
                  <TagList tags={tags} />
                </div>
              ) : null}
            </div>
          </div>
          
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
              aria-label={t('common.scrollToTop')}
            >
              <ArrowUpIcon className="h-6 w-6" />
            </button>
          )}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;