'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { getBlogPostBySlug, deleteBlogPost, getBlogPosts } from '@/api';
import Breadcrumb from '@/components/Breadcrumb';
import TagList from '@/components/TagList';
import BlogPostCard from '@/components/BlogPostCard';
import { useAuth } from '@/context/AuthContext';
import DOMPurify from 'dompurify';
import MainLayout from '@/components/layouts/MainLayout';
import type { BlogPost, BlogPostListItem } from '@/api/blog';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

const BlogPostPage = ({ params }: BlogPostPageProps) => {
  // Unwrap the params with React.use() as recommended by Next.js
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';
  // User ID may be stored as string or number, so use == for comparison
  const isAuthor = isAuthenticated && post?.author?.id && user?.id && String(post.author.id) === String(user.id);
  const canEdit = isAdmin || isAuthor;
  
  // Use a ref to prevent duplicate API calls during hydration
  const didFetchRef = useRef(false);
  
  // Use a separate flag to track if we've already started fetching
  const [hasFetchStarted, setHasFetchStarted] = useState(false);

  useEffect(() => {
    
    const fetchData = async () => {
      // Check for cached data in sessionStorage first
      if (typeof window !== 'undefined') {
        const cachedPostKey = `blog_post_${slug}`;
        const cachedRelatedPostsKey = `blog_related_posts_${slug}`;
        const cachedPostData = sessionStorage.getItem(cachedPostKey);
        const cachedRelatedPosts = sessionStorage.getItem(cachedRelatedPostsKey);
        
        if (cachedPostData && cachedRelatedPosts) {
          try {
            console.log('Using cached blog post data');
            const postData = JSON.parse(cachedPostData);
            const relatedPostsData = JSON.parse(cachedRelatedPosts);
            
            setPost(postData);
            setRelatedPosts(relatedPostsData);
            setLoading(false);
            didFetchRef.current = true;
            return;
          } catch (e) {
            console.error('Error parsing cached post data', e);
            // Continue with fetching if parsing fails
          }
        }
      }
      
      // Skip if we've already started fetching for this slug
      if (hasFetchStarted) return;
      setHasFetchStarted(true);
      
      try {
        setLoading(true);
        console.log('Fetching blog post:', slug);
        const response = await getBlogPostBySlug(slug);
        setPost(response.data);
        
        // Fetch related posts
        if (response.data.tags && response.data.tags.length > 0) {
          const tagIds = response.data.tags.map((tag: any) => tag.id);
          const relatedResponse = await getBlogPosts(0, 3);
          
          // Defensively handle different response formats
          let postsToFilter: BlogPostListItem[] = [];
          if (relatedResponse.data && relatedResponse.data.content) {
            postsToFilter = relatedResponse.data.content;
          } else if (Array.isArray(relatedResponse.data)) {
            postsToFilter = relatedResponse.data;
          }
          
          // Now filter the posts safely
          const filtered = postsToFilter.filter(p => 
            p && p.id !== response.data.id && p.tags && Array.isArray(p.tags) && 
            p.tags.some(t => t && tagIds.includes(t.id))
          );
          
          setRelatedPosts(filtered.slice(0, 3));
          
          // Cache related posts
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(`blog_related_posts_${slug}`, JSON.stringify(filtered.slice(0, 3)));
          }
        }
        
        // Cache the post data
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`blog_post_${slug}`, JSON.stringify(response.data));
        }
        
        didFetchRef.current = true;
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        setError(err.message || 'Error loading blog post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, hasFetchStarted]);
  
  // Reset fetch flag when slug changes
  useEffect(() => {
    setHasFetchStarted(false);
  }, [slug]);
  
  const handleDelete = async () => {
    try {
      if (post) {
        await deleteBlogPost(post.id);
        router.push('/blog');
      }
    } catch (err: any) {
      console.error('Error deleting post:', err);
      setError(err.message || t('blog.admin.messages.error'));
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
              {/* Using regular img for better error handling */}
              <img 
                src={post.featuredImage && !post.featuredImage.includes('example.com') 
                  ? post.featuredImage 
                  : 'https://placehold.co/600x400?text=No+Image'} 
                alt={post.title} 
                className="w-full h-full object-cover"
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
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{t('blog.publishedOn')} {format(new Date(post.publishedAt || new Date()), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{t('blog.readingTime', { minutes: post.readingTimeMinutes })}</span>
                  </div>
                </div>
                
                <TagList tags={post.tags} className="mb-6" />
              </div>
              
              {canEdit && (
                <div className="flex space-x-2 mt-2">
                  <Link 
                    href={`/blog/edit/${post.id}`} 
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
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t('blog.admin.deletePost')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
};

export default BlogPostPage;