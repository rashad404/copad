'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { getBlogPostsByTag, getTagBySlug } from '@/api';
import BlogPostCard from '@/components/BlogPostCard';
import Breadcrumb from '@/components/Breadcrumb';
import MainLayout from '@/components/layouts/MainLayout';
import type { BlogPostListItem, Tag } from '@/api/blog';

interface BlogTagPageProps {
  params: {
    slug: string;
  };
}

const BlogTagPage = ({ params }: BlogTagPageProps) => {
  // Unwrap the params with React.use() as recommended by Next.js
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  const [tag, setTag] = useState<Tag | null>(null);
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t, i18n } = useTranslation();
  
  // Use a ref to prevent duplicate API calls during hydration
  const didFetchRef = useRef(false);
  
  // Use a separate flag to track if we've already started fetching
  const [hasFetchStarted, setHasFetchStarted] = useState(false);

  useEffect(() => {
    
    const fetchData = async () => {
      // Check for cached data in sessionStorage first
      if (typeof window !== 'undefined') {
        const cachedKey = `blog_tag_${slug}_${i18n.resolvedLanguage}`;
        const cachedData = sessionStorage.getItem(cachedKey);
        
        if (cachedData) {
          try {
            console.log('Using cached tag data');
            const data = JSON.parse(cachedData);
            
            setTag(data.tag);
            setPosts(data.posts);
            setHasMore(data.hasMore);
            setPage(0);
            setLoading(false);
            didFetchRef.current = true;
            return;
          } catch (e) {
            console.error('Error parsing cached tag data', e);
            // Continue with fetching if parsing fails
          }
        }
      }
      
      // Skip if we've already started fetching
      if (hasFetchStarted) return;
      setHasFetchStarted(true);
      
      try {
        setLoading(true);
        
        console.log('Fetching tag data:', slug);
        // Fetch tag details and posts in parallel
        const [tagResponse, postsResponse] = await Promise.all([
          getTagBySlug(slug),
          getBlogPostsByTag(slug, 0, 9, i18n.resolvedLanguage)
        ]);
        
        setTag(tagResponse.data);
        
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
        
        setPage(0);
        didFetchRef.current = true;
        
        // Cache the results
        if (typeof window !== 'undefined') {
          const cachedKey = `blog_tag_${slug}_${i18n.resolvedLanguage}`;
          const dataToCache = {
            tag: tagResponse.data,
            posts: postsResponse.data && postsResponse.data.content ? 
              postsResponse.data.content : 
              (Array.isArray(postsResponse.data) ? postsResponse.data : []),
            hasMore: postsResponse.data && postsResponse.data.content ? 
              postsResponse.data.content.length < postsResponse.data.totalElements : 
              false,
            timestamp: Date.now()
          };
          
          sessionStorage.setItem(cachedKey, JSON.stringify(dataToCache));
        }
      } catch (err: any) {
        console.error('Error fetching tag data:', err);
        setError(err.response?.data?.message || err.message || t('common.errors.generic'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Add scroll event listener for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, t, i18n, hasFetchStarted]);
  
  // Reset fetch flag when slug changes
  useEffect(() => {
    setHasFetchStarted(false);
  }, [slug]);
  
  const loadMorePosts = async () => {
    if (!hasMore) return;
    
    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await getBlogPostsByTag(slug, nextPage, 9, i18n.resolvedLanguage);
      
      if (response.data && response.data.content && response.data.content.length > 0) {
        setPosts(prev => [...prev, ...response.data.content]);
        setPage(nextPage);
        setHasMore(posts.length + response.data.content.length < response.data.totalElements);
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        setPosts(prev => [...prev, ...response.data]);
        setPage(nextPage);
        setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error('Error loading more posts:', err);
      setError(err.response?.data?.message || err.message || t('common.errors.generic'));
    } finally {
      setLoading(false);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (error) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <div className="text-red-500 font-medium">{error}</div>
          <Link 
            href="/blog" 
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t('blog.backToList')}
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb 
          items={[
            { label: t('navbar.home'), href: '/' },
            { label: t('blog.title'), href: '/blog' },
            { label: tag?.name || t('blog.tags') }
          ]}
        />
        
        <div className="flex justify-between items-center mb-10 mt-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('blog.postsTaggedWith')} "{tag?.name || ''}"
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              {t('blog.tagDescription', { tag: tag?.name || '', count: tag?.postCount || 0 })}
            </p>
          </div>
          
          <Link 
            href="/blog" 
            className="hidden md:flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMorePosts}
                  disabled={loading}
                  className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium rounded-full border border-gray-300 dark:border-gray-600 shadow-sm transition-colors duration-200 disabled:opacity-70"
                >
                  {loading ? t('common.loading') : t('common.loadMore')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {t('blog.noPostsWithTag', { tag: tag?.name || '' })}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('blog.checkOtherTags')}
            </p>
            <Link 
              href="/blog" 
              className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {t('blog.backToList')}
            </Link>
          </div>
        )}
        
        <div className="md:hidden mt-8 text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t('blog.backToList')}
          </Link>
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
      </main>
    </MainLayout>
  );
};

export default BlogTagPage;