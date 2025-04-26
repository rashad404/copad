import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { getBlogPostBySlug, deleteBlogPost, getBlogPosts } from '../api';
import Breadcrumb from '../components/Breadcrumb';
import TagList from '../components/TagList';
import BlogPostCard from '../components/BlogPostCard';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DOMPurify from 'dompurify';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const isAdmin = isAuthenticated && user?.roles?.includes('ADMIN');
  const isAuthor = isAuthenticated && post?.author?.id === user?.id;
  const canEdit = isAdmin || isAuthor;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getBlogPostBySlug(slug);
        setPost(response.data);
        
        // Fetch related posts
        if (response.data.tags && response.data.tags.length > 0) {
          const tagIds = response.data.tags.map(tag => tag.id);
          const relatedResponse = await getBlogPosts(0, 3);
          
          // Defensively handle different response formats
          let postsToFilter = [];
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
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err.message || 'Error loading blog post');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);
  
  const handleDelete = async () => {
    try {
      await deleteBlogPost(post.id);
      navigate('/blog');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err.message || t('blog.admin.messages.error'));
    }
  };
  
  if (loading) {
    return (
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
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="text-red-500 font-medium mb-4">{error}</div>
        <Link 
          to="/blog" 
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          {t('blog.backToList')}
        </Link>
      </div>
    );
  }
  
  if (!post) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb 
          items={[
            { label: t('navbar.home'), to: '/' },
            { label: t('blog.title'), to: '/blog' },
            { label: post.title }
          ]}
        />
        
        <article className="mt-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          {/* Featured Image */}
          <div className="w-full h-80 sm:h-96 relative overflow-hidden">
            <img 
              src={post.featuredImage || 'https://placehold.co/600x400?text=No+Image'} 
              alt={post.title} 
              className="w-full h-full object-cover"
              onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
            />
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
                    <span>{post.author.fullName}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{t('blog.publishedOn')} {format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
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
                    to={`/blog/edit/${post.id}`} 
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
            <div className="text-lg text-gray-700 dark:text-gray-300 italic border-l-4 border-indigo-500 pl-4 mb-8">
              {post.summary}
            </div>
            
            {/* Post Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
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
            to="/blog" 
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
      <Footer />
    </div>
  );
};

export default BlogPostPage;