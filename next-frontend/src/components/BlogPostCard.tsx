import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { BlogPostListItem } from '@/api/blog';

interface BlogPostCardProps {
  post: Partial<BlogPostListItem>;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const { t } = useTranslation();
  
  // Return null if post is undefined or null
  if (!post) return null;
  
  // Default values for potential missing properties
  const {
    slug = 'post',
    title = 'Untitled Post',
    featuredImage = '',
    tags = [],
    publishedAt = new Date().toISOString(),
    readingTimeMinutes = 5,
    summary = '',
    author = { name: 'Anonymous' }
  } = post;
  
  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <div className="w-full h-full relative">
            <Image 
              src={featuredImage && !featuredImage.includes('example.com') && featuredImage !== ''
                ? featuredImage 
                : '/images/no_image.svg'}
              alt={title as string}
              width={600}
              height={400}
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              {tags.slice(0, 2).map(tag => (
                <span 
                  key={tag?.id || `tag-${tag?.name || Math.random()}`} 
                  className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full shadow-sm"
                >
                  {tag?.name || 'Unnamed Tag'}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="px-3 py-1 text-xs font-medium bg-gray-700 text-white rounded-full shadow-sm">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{format(new Date(publishedAt || new Date()), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{t('blog.readingTime', { minutes: readingTimeMinutes })}</span>
          </div>
        </div>
        
        <Link href={`/blog/${slug}`} className="block">
          <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {summary}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{author?.name || 'Anonymous'}</span>
          </div>
          
          <Link 
            href={`/blog/${slug}`} 
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            {t('blog.readMore')} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;