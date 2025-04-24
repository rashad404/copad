import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getBlogPostBySlug } from '../api';
import Breadcrumb from '../components/Breadcrumb';
import BlogPostForm from '../components/BlogPostForm';

const BlogFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If editing, fetch the post data
    if (isEdit) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await getBlogPostBySlug(id);
          setPost(response.data);
        } catch (err) {
          console.error('Error fetching post data:', err);
          setError(err.message || 'Error loading post data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [id, isEdit]);
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="text-red-500 font-medium mb-4">{error}</div>
        <button 
          onClick={() => navigate('/blog')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          {t('blog.backToList')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb 
        items={[
          { label: t('navbar.home'), path: '/' },
          { label: t('blog.title'), path: '/blog' },
          { label: isEdit ? t('blog.admin.editPost') : t('blog.admin.createPost') }
        ]}
      />
      
      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {isEdit ? t('blog.admin.editPost') : t('blog.admin.createPost')}
        </h1>
        
        <button 
          onClick={() => navigate('/blog')}
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          {t('blog.backToList')}
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <BlogPostForm postData={post} isEdit={isEdit} />
      </div>
    </div>
  );
};

export default BlogFormPage;