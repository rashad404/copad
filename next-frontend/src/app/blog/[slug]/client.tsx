'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { deleteBlogPost } from '@/api';
import Breadcrumb from '@/components/Breadcrumb';
import TagList from '@/components/TagList';
import BlogPostCard from '@/components/BlogPostCard';
import { useAuth } from '@/context/AuthContext';
import { useSiteContext } from '@/context/SiteContext';
import DOMPurify from 'dompurify';
import MainLayout from '@/components/layouts/MainLayout';
import type { BlogPost, BlogPostListItem } from '@/api/blog';

interface BlogPostClientProps {
  initialPost: BlogPost | null;
  initialRelatedPosts: BlogPostListItem[];
  initialError?: string;
  slug: string;
  lang: string;
}

const BlogPostClient = ({ 
  initialPost, 
  initialRelatedPosts, 
  initialError,
  slug,
  lang
}: BlogPostClientProps) => {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostListItem[]>(initialRelatedPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  // Set language based on server-side detected language
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Check if user is admin or author
  const isAdmin = isAuthenticated && (user?.role === 'ADMIN' || (user?.roles && user?.roles.includes('ADMIN')));
  const isAuthor = isAuthenticated && post?.author?.id && user?.id && String(post.author.id) === String(user.id);
  const canEdit = isAdmin || isAuthor;
  
  const handleDelete = async () => {
    try {
      if (post) {
        setLoading(true);
        await deleteBlogPost(post.id);
        router.push('/blog');
      }
    } catch (err: any) {
      console.error('Error deleting post:', err);
      setError(err.message || t('blog.admin.messages.error'));
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="text-red-500 font-medium mb-4">{error}</div>
          <Link 
            href="/blog" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t('blog.backToList')}
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  if (!post) return null;
  
  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb 
          items={[
            { label: t('navbar.home'), href: '/' },
            { label: t('blog.title'), href: '/blog' },
            { label: post.title }
          ]}
        />
        
        <article className="mt-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          {/* Featured Image */}
          <div className="w-full h-80 sm:h-96 relative overflow-hidden">
            <div className="w-full h-full relative">
              <Image 
                src={post.featuredImage && !post.featuredImage.includes('example.com') && post.featuredImage !== '' 
                  ? post.featuredImage 
                  : '/images/no_image.svg'} 
                alt={post.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                priority={true} // Load featured image with high priority
                sizes="(max-width: 768px) 100vw, 1200px"
                quality={90}
              />
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            {/* Post Header */}
            <div className="flex flex-wrap justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-4 mb-4">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span>{post.author?.name || t('blog.anonymous')}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{t('blog.publishedOn')} {format(new Date(post.publishedAt || new Date()), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{t('blog.readingTime', { minutes: post.readingTimeMinutes || 5 })}</span>
                  </div>
                </div>
                
                <TagList tags={post.tags || []} className="mb-6" />
              </div>
              
              {canEdit && (
                <div className="flex space-x-2 mt-2">
                  <Link 
                    href={`/admin/posts/edit/${post.id}`} 
                    className="flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    {t('blog.admin.editPost')}
                  </Link>
                  <button 
                    onClick={() => setShowDeleteConfirm(true)} 
                    className="flex items-center px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    {t('blog.admin.deletePost')}
                  </button>
                </div>
              )}
            </div>
            
            {/* Post Summary */}
            <div className="text-lg text-gray-700 dark:text-gray-300 italic border-l-4 border-indigo-500 pl-4 mb-8 whitespace-pre-line">
              {post.summary}
            </div>
            
            {/* Post Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />
          </div>
        </article>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('blog.relatedPosts')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
        
        {/* Back to Blog Link */}
        <div className="mt-10 text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t('blog.backToList')}
          </Link>
        </div>
        
        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">{t('blog.admin.confirmDelete')}</h3>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('blog.admin.form.cancel')}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {loading ? t('common.processing') : t('blog.admin.deletePost')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
};

export default BlogPostClient;