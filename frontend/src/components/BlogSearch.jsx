import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const BlogSearch = ({ className = "" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder={t('blog.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent outline-none transition-all duration-200 shadow-sm placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-200"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
        >
          {t('blog.search.button')}
        </button>
      </form>
    </div>
  );
};

export default BlogSearch;