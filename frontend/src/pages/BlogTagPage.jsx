import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, TagIcon } from '@heroicons/react/24/outline';
import { getBlogPostsByTag, getTagBySlug } from '../api';
import Breadcrumb from '../components/Breadcrumb';
import BlogPostCard from '../components/BlogPostCard';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import i18n from '../i18n';

const BlogTagPage = () => {
  const { tagSlug } = useParams();
  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { t } = useTranslation();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch tag and posts in parallel
        const [tagResponse, postsResponse] = await Promise.all([
          getTagBySlug(tagSlug),
          getBlogPostsByTag(tagSlug, 0, 9, i18n.language)
        ]);
        
        setTag(tagResponse.data);
        if (postsResponse.data && postsResponse.data.content) {
          setPosts(postsResponse.data.content);
          setHasMore(!postsResponse.data.last);
        } else if (Array.isArray(postsResponse.data)) {
          setPosts(postsResponse.data);
          setHasMore(false);
        } else {
          setPosts([]);
          setHasMore(false);
        }
        setPage(0);
      } catch (err) {
        console.error('Error fetching tag data:', err);
        setError(err.message || 'Error loading tag data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tagSlug, i18n.language]);
  
  const loadMorePosts = async () => {
    if (!hasMore) return;
    
    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await getBlogPostsByTag(tagSlug, nextPage, 9, i18n.language);
      
      if (response.data && response.data.content && response.data.content.length > 0) {
        setPosts(prev => [...prev, ...response.data.content]);
        setPage(nextPage);
        setHasMore(!response.data.last);
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        setPosts(prev => [...prev, ...response.data]);
        setPage(nextPage);
        setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more posts:', err);
      setError(err.message || 'Error loading more posts');
    } finally {
      setLoading(false);
    }
  };
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="text-red-500 font-medium mb-4">{error}</div>
        <Link 
          to="/blog" 
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          {t('blog.backToList')}
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb 
          items={[
            { label: t('navbar.home'), to: '/' },
            { label: t('blog.title'), to: '/blog' },
            { label: tag?.name || t('blog.tags') }
          ]}
        />
        <div className="mt-8 mb-10">
          {tag && (
            <div className="flex items-center mb-6">
              <TagIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {tag.name}
              </h1>
            </div>
          )}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            {t('blog.backToList')}
          </Link>
        </div>
        {loading && posts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-200 dark:bg-gray-700 h-80"></div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {posts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mb-10">
                <button
                  onClick={loadMorePosts}
                  disabled={loading}
                  className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium rounded-full border border-gray-300 dark:border-gray-600 shadow-sm transition-colors duration-200 disabled:opacity-70"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {t('blog.tag.empty', { tag: tag?.name })}
            </h3>
            <Link 
              to="/blog" 
              className="inline-flex items-center px-4 py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {t('blog.backToList')}
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogTagPage;