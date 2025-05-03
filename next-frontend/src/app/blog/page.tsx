'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PencilIcon, PlusIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { getBlogPosts, getTopTags } from '@/api';
import BlogPostCard from '@/components/BlogPostCard';
import TagList from '@/components/TagList';
import BlogSearch from '@/components/BlogSearch';
import Breadcrumb from '@/components/Breadcrumb';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layouts/MainLayout';
import type { BlogPostListItem, Tag } from '@/api/blog';

const BlogPage = () => {
  console.log('Rendering BlogPage component');
  
  // Test direct API call
  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing direct API call...');
        const response = await getBlogPosts(0, 9);
        console.log('Direct API test response:', response?.data);
      } catch (err) {
        console.error('Direct API test failed:', err);
      }
    };
    
    testApi();
  }, []);
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';
  
  // Use a ref to prevent duplicate API calls during hydration
  const didFetchRef = useRef(false);
  
  // Use a separate flag to track if we've already started fetching
  const [hasFetchStarted, setHasFetchStarted] = useState(false);
  
  useEffect(() => {
    // Override all the existing blog fetch logic with a direct fetch
    const fetchWithFetch = async () => {
      console.log('Using direct fetch API...');
      try {
        // Direct fetch call
        const response = await fetch('http://localhost:8080/api/blog?page=0&size=9&sortBy=publishedAt&direction=desc', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Direct fetch results:', data);
        
        if (data && data.content) {
          setPosts(data.content);
          setHasMore(data.content.length < data.totalElements);
        } else {
          setPosts([]);
          setHasMore(false);
        }
        
        // Also fetch tags
        const tagsResponse = await fetch('http://localhost:8080/api/tags/top?limit=10');
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setTags(tagsData);
        }
        
        setPostsLoading(false);
        setTagsLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setPostsLoading(false);
        setTagsLoading(false);
      }
    };
    
    fetchWithFetch();
    
    // The original implementation remains below but is not used
    const fetchInitialData = async () => {
      // Check for cached data in sessionStorage first
      if (typeof window !== 'undefined') {
        const cachedBlogData = sessionStorage.getItem('blog_data');
        const cachedTagData = sessionStorage.getItem('blog_tags');
        
        if (cachedBlogData && cachedTagData) {
          try {
            console.log('Using cached blog data');
            const blogData = JSON.parse(cachedBlogData);
            const tagData = JSON.parse(cachedTagData);
            
            // Only use cache if language matches
            if (blogData.language === i18n.resolvedLanguage) {
              setPosts(blogData.posts);
              setHasMore(blogData.hasMore);
              setTags(tagData);
              setPostsLoading(false);
              setTagsLoading(false);
              didFetchRef.current = true;
              return;
            }
          } catch (e) {
            console.error('Error parsing cached data', e);
            // Continue with fetching if parsing fails
          }
        }
      }
      
      // Skip if we've already started fetching
      if (hasFetchStarted) return;
      setHasFetchStarted(true);
      
      try {
        setPostsLoading(true);
        setTagsLoading(true);
        
        console.log('Fetching blog posts and tags...', new Date().toISOString());
        console.log('Language:', i18n.resolvedLanguage);
        // Fetch posts and tags in parallel
        const [postsResponse, tagsResponse] = await Promise.all([
          getBlogPosts(0, 9, 'publishedAt', 'desc', i18n.resolvedLanguage),
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
        didFetchRef.current = true;
        
        // Cache the results in sessionStorage
        if (typeof window !== 'undefined') {
          const postsToCache = postsResponse.data && postsResponse.data.content ? 
            postsResponse.data.content : 
            (Array.isArray(postsResponse.data) ? postsResponse.data : []);
            
          const hasMoreToCache = postsResponse.data && postsResponse.data.content ? 
            postsResponse.data.content.length < postsResponse.data.totalElements : 
            false;
            
          sessionStorage.setItem('blog_data', JSON.stringify({
            posts: postsToCache,
            hasMore: hasMoreToCache,
            language: i18n.resolvedLanguage,
            timestamp: Date.now()
          }));
          
          const tagsToCache = tagsResponse.data ? 
            (Array.isArray(tagsResponse.data) ? tagsResponse.data : []) : 
            [];
            
          sessionStorage.setItem('blog_tags', JSON.stringify(tagsToCache));
        }
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
  }, []);
  
  const loadMorePosts = async () => {
    if (!hasMore) return;
    
    try {
      setPostsLoading(true);
      const nextPage = page + 1;
      const response = await getBlogPosts(nextPage, 9, 'publishedAt', 'desc', i18n.resolvedLanguage);
      
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
      <MainLayout>
        <div className="p-8 text-center">
          <div className="text-red-500 font-medium">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {t('common.retry')}
          </button>
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
                href="/blog/new" 
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg transition-colors shadow-sm"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                {t('blog.admin.createPost')}
              </Link>
              <Link 
                href="/blog/manage-tags" 
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-gray-200 dark:bg-gray-700 h-80"></div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                    href="/blog/new" 
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
      </main>
    </MainLayout>
  );
};

export default BlogPage;