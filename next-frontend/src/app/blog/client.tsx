'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PencilIcon, PlusIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { getBlogPosts } from '@/api';
import BlogPostCard from '@/components/BlogPostCard';
import TagList from '@/components/TagList';
import BlogSearch from '@/components/BlogSearch';
import Breadcrumb from '@/components/Breadcrumb';
import { useAuth } from '@/context/AuthContext';
import { useSiteContext } from '@/context/SiteContext';
import MainLayout from '@/components/layouts/MainLayout';
import type { BlogPostListItem, Tag } from '@/api/blog';

interface BlogClientProps {
  initialPosts: BlogPostListItem[];
  initialTags: Tag[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
    size: number;
  };
  lang: string;
}

const BlogClient = ({ initialPosts, initialTags, pagination, lang }: BlogClientProps) => {
  const [posts, setPosts] = useState<BlogPostListItem[]>(initialPosts);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(pagination?.currentPage || 0);
  const [hasMore, setHasMore] = useState(pagination?.hasNext || initialPosts.length >= 9);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && (user?.role === 'ADMIN' || (user?.roles && user?.roles.includes('ADMIN')));
  
  // Set language based on server-side detected language
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  useEffect(() => {
    // Add scroll event listener for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const loadMorePosts = async () => {
    if (!hasMore || postsLoading) return;
    
    try {
      setPostsLoading(true);
      const nextPage = page + 1;
      const response = await getBlogPosts(nextPage, 9, 'publishedAt', 'desc', i18n.resolvedLanguage);
      
      // Handle Spring Data format (common in Spring Boot apps)
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        setPosts(prev => [...prev, ...response.data.content]);
        setPage(nextPage);
        setHasMore(response.data.number < response.data.totalPages - 1);
      } 
      // Handle simple array format
      else if (Array.isArray(response.data)) {
        setPosts(prev => [...prev, ...response.data]);
        setPage(nextPage);
        setHasMore(response.data.length >= 9); // If we got a full page, assume there might be more
      }
      // Handle direct content field 
      else if (response.data && Array.isArray(response.data)) {
        setPosts(prev => [...prev, ...response.data]);
        setPage(nextPage);
        setHasMore(response.data.length >= 9);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error('Error loading more posts:', err);
      setError(err.message || t('common.errors.generic'));
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
                href="/admin/posts/create" 
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg transition-colors shadow-sm"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                {t('blog.admin.createPost')}
              </Link>
              <Link 
                href="/admin/tags" 
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
                    href="/admin/posts/create" 
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
            
            {tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('blog.filter.byTag')}</h3>
                <TagList tags={tags} />
              </div>
            )}
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

export default BlogClient;