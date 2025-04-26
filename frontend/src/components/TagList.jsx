import { Link } from 'react-router-dom';
import { TagIcon } from '@heroicons/react/24/outline';

const TagList = ({ tags, className = "" }) => {
  // Return null if tags is undefined, null, or empty array
  if (!tags || !Array.isArray(tags) || tags.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <TagIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-1" />
      {tags.map(tag => {
        // Skip if tag is null or doesn't have required properties
        if (!tag || !tag.slug) return null;
        
        return (
          <Link 
            key={tag.id || `tag-${tag.slug}`} 
            to={`/blog/tag/${tag.slug}`}
            className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors duration-200"
          >
            {tag.name || 'Unnamed Tag'}
            {typeof tag.postCount === 'number' && tag.postCount > 0 && (
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({tag.postCount})</span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default TagList;