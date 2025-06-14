'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ArrowUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchBlogPosts } from '@/api';
import BlogPostCard from '@/components/BlogPostCard';
import BlogSearch from '@/components/BlogSearch';
import Breadcrumb from '@/components/Breadcrumb';
import MainLayout from '@/components/layouts/MainLayout';
import type { BlogPostListItem } from '@/api/blog';

interface BlogSearchClientProps {
  initialPosts: BlogPostListItem[];
  initialQuery: string;
  lang: string;
}

const BlogSearchClient = ({ initialPosts, initialQuery, lang }: BlogSearchClientProps) => {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || initialQuery;
  const [posts, setPosts] = useState<BlogPostListItem[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 9); // Assume we can load more if we got the max items
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t, i18n } = useTranslation();
  
  // Set language based on server-side detected language
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  // Fetch more results when query changes (after initial server-side render)
  useEffect(() => {
    // Skip if we're rendering with the initial query
    if (query === initialQuery && posts.length > 0) {
      return;
    }
    
    const fetchResults = async () => {
      if (!query.trim()) {
        setPosts([]);
        return;
      }
      
      try {
        setLoading(true);
        
        const response = await searchBlogPosts(query, 0, 9);
        
        if (response.data && response.data.content) {
          setPosts(response.data.content);
          setHasMore(response.data.content.length < response.data.totalElements);
        } else if (Array.isArray(response.data)) {
          setPosts(response.data);
          setHasMore(false);
        } else {
          setPosts([]);
          setHasMore(false);
        }
        
        setPage(0);
      } catch (err: any) {
        console.error('Error searching blog posts:', err);
        setError(err.message || t('common.errors.generic'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query, initialQuery, t]);
  
  useEffect(() => {
    // Add scroll event listener for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const loadMorePosts = async () => {
    if (!hasMore || !query.trim() || loading) return;
    
    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await searchBlogPosts(query, nextPage, 9);
      
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
      console.error('Error loading more search results:', err);
      setError(err.message || t('common.errors.generic'));
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
            { label: t('blog.search.results') }
          ]}
        />
        
        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('blog.search.resultsFor')} "{query}"
          </h1>
          
          <div className="w-full max-w-2xl">
            <BlogSearch className="mb-6" />
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {loading ? (
                t('blog.search.searching')
              ) : posts.length > 0 ? (
                t('blog.search.foundResults', { count: posts.length })
              ) : (
                t('blog.search.noResults')
              )}
            </p>
            
            <Link 
              href="/blog" 
              className="hidden md:flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {t('blog.backToList')}
            </Link>
          </div>
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
        ) : query ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {t('blog.search.noResultsFor', { query })}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              {t('blog.search.tryAgain')}
            </p>
            <Link 
              href="/blog" 
              className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {t('blog.backToList')}
            </Link>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {t('blog.search.enterQuery')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              {t('blog.search.enterQueryDescription')}
            </p>
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

export default BlogSearchClient;