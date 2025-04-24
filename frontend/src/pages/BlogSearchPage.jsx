import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { searchBlogPosts } from '../api';
import Breadcrumb from '../components/Breadcrumb';
import BlogPostCard from '../components/BlogPostCard';
import BlogSearch from '../components/BlogSearch';

const BlogSearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const { t } = useTranslation();
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) return;
      
      try {
        setLoading(true);
        setPage(0);
        setPosts([]);
        
        const response = await searchBlogPosts(query, 0, 9);
        if (response.data && response.data.content) {
          setPosts(response.data.content);
          setTotalElements(response.data.totalElements || response.data.content.length);
          setHasMore(!response.data.last);
        } else if (Array.isArray(response.data)) {
          setPosts(response.data);
          setTotalElements(response.data.length);
          setHasMore(false);
        } else {
          setPosts([]);
          setTotalElements(0);
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error searching blog posts:', err);
        setError(err.message || 'Error searching blog posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);
  
  const loadMorePosts = async () => {
    if (!hasMore) return;
    
    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await searchBlogPosts(query, nextPage, 9);
      
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
      console.error('Error loading more search results:', err);
      setError(err.message || 'Error loading more search results');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb 
        items={[
          { label: t('navbar.home'), path: '/' },
          { label: t('blog.title'), path: '/blog' },
          { label: t('blog.search.results') }
        ]}
      />
      
      <div className="mt-8 mb-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('blog.search.results')}: "{query}"
        </h1>
        
        <BlogSearch className="max-w-2xl" />
      </div>
      
      {loading && posts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-200 dark:bg-gray-700 h-80"></div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            {totalElements} {totalElements === 1 ? 'result' : 'results'} found
          </div>
          
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
          <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{t('blog.search.noResults')}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or browse all posts</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full shadow-sm transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t('blog.backToList')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogSearchPage;