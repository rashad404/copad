import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { getBlogPostBySlug, createBlogPost, updateBlogPost, getAllTags, createTag } from '../api';

// Import a rich text editor - for a production app, you might want to use a more robust solution
// Such as TinyMCE, CKEditor, or Quill. This is a simplified version for the example.
const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div 
      ref={editorRef}
      contentEditable={true}
      className="border border-gray-300 dark:border-gray-600 rounded-md p-4 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
      dangerouslySetInnerHTML={{ __html: value }}
      onInput={handleInput}
    />
  );
};

const AdminPostForm = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    tagNames: [],
    published: false,
    featuredImage: '',
    language: 'en',
  });
  
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  
  // Language options
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'az', name: 'Azerbaijani' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ru', name: 'Russian' },
  ];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getAllTags();
        if (response.data) {
          setAvailableTags(response.data);
        }
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    
    fetchTags();
    
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await getBlogPostBySlug(id);
          const post = response.data;
          
          // Populate form data
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            summary: post.summary || '',
            content: post.content || '',
            tagNames: post.tags ? post.tags.map(tag => tag.name) : [],
            published: post.published || false,
            featuredImage: post.featuredImage || '',
            language: post.language || 'en',
          });
        } catch (err) {
          console.error('Error fetching post:', err);
          setError(err.message || 'Failed to load post');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [id, isEditMode]);

  // Warn before leaving if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formTouched && !success) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formTouched, success]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = t('admin.posts.form.errors.titleRequired');
    }
    
    if (!formData.summary.trim()) {
      newErrors.summary = t('admin.posts.form.errors.summaryRequired');
    } else if (formData.summary.length > 500) {
      newErrors.summary = t('admin.posts.form.errors.summaryTooLong');
    }
    
    if (!formData.content.trim()) {
      newErrors.content = t('admin.posts.form.errors.contentRequired');
    }
    
    if (!formData.featuredImage.trim()) {
      newErrors.featuredImage = t('admin.posts.form.errors.imageRequired');
    } else if (!isValidUrl(formData.featuredImage)) {
      newErrors.featuredImage = t('admin.posts.form.errors.invalidUrl');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormTouched(true);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleContentChange = (content) => {
    setFormTouched(true);
    setFormData(prev => ({
      ...prev,
      content
    }));
    
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: null }));
    }
  };
  
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    setFormTouched(true);
    
    // Check if tag already exists in current selection
    if (formData.tagNames.includes(newTag.trim())) {
      setNewTag('');
      return;
    }
    
    // Check if tag exists in available tags
    const tagExists = availableTags.some(tag => 
      tag.name.toLowerCase() === newTag.trim().toLowerCase()
    );
    
    if (!tagExists) {
      try {
        // Create new tag
        const response = await createTag(newTag.trim());
        if (response.data) {
          setAvailableTags(prev => [...prev, response.data]);
        }
      } catch (err) {
        console.error('Error creating tag:', err);
      }
    }
    
    // Add tag to form data
    setFormData(prev => ({
      ...prev,
      tagNames: [...prev.tagNames, newTag.trim()]
    }));
    
    setNewTag('');
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormTouched(true);
    setFormData(prev => ({
      ...prev,
      tagNames: prev.tagNames.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSelectTag = (tag) => {
    if (formData.tagNames.includes(tag.name)) return;
    
    setFormTouched(true);
    setFormData(prev => ({
      ...prev,
      tagNames: [...prev.tagNames, tag.name]
    }));
  };
  
  const handleGenerateSlug = () => {
    if (!formData.title.trim()) return;
    
    // Generate slug from title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
    
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };
  
  const handleSave = async (publishStatus = null) => {
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }
    
    setSaving(true);
    
    try {
      // Determine if we should publish based on the button clicked
      const dataToSave = {
        ...formData
      };
      
      // Override publish status if specified
      if (publishStatus !== null) {
        dataToSave.published = publishStatus;
      }
      
      if (isEditMode) {
        await updateBlogPost(id, dataToSave);
        setSuccess(t('admin.posts.form.updateSuccess'));
      } else {
        await createBlogPost(dataToSave);
        setSuccess(t('admin.posts.form.createSuccess'));
      }
      
      // Set form as untouched after successful save
      setFormTouched(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/posts');
      }, 1500);
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.message || t('admin.posts.form.saveError'));
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };
  
  const togglePreview = () => {
    setShowPreview(prev => !prev);
  };
  
  const handleCancel = () => {
    if (formTouched && !success) {
      setConfirmLeave(true);
    } else {
      navigate('/admin/posts');
    }
  };
  
  const confirmNavigateAway = () => {
    navigate('/admin/posts');
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded max-w-md mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? t('admin.posts.form.editTitle') : t('admin.posts.form.createTitle')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditMode ? t('admin.posts.form.editDescription') : t('admin.posts.form.createDescription')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {t('admin.posts.form.cancel')}
          </button>
          <button
            type="button"
            onClick={togglePreview}
            className="inline-flex items-center px-4 py-2 border border-indigo-300 dark:border-indigo-700 shadow-sm text-sm font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <EyeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {showPreview ? t('admin.posts.form.editMode') : t('admin.posts.form.preview')}
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{t('common.error')}</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">{t('common.success')}</h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>{success}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreview ? (
        /* Preview Mode */
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{formData.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">{formData.slug}</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            {formData.featuredImage && (
              <div className="w-full h-64 overflow-hidden">
                <img 
                  src={formData.featuredImage} 
                  alt={formData.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/600x400?text=Invalid+Image';
                  }}
                />
              </div>
            )}
            <div className="px-4 py-5 sm:p-6">
              <div className="text-sm italic text-gray-600 dark:text-gray-400 mb-4">{formData.summary}</div>
              <div 
                className="prose dark:prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: formData.content }} 
              />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
              <div className="flex flex-wrap gap-2">
                {formData.tagNames.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <form className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('admin.posts.form.title')} *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
                errors.title
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
              } dark:bg-gray-800 dark:text-white`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <div className="flex justify-between">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('admin.posts.form.slug')}
              </label>
              <button
                type="button"
                onClick={handleGenerateSlug}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                {t('admin.posts.form.generateSlug')}
              </button>
            </div>
            <input
              type="text"
              name="slug"
              id="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder={t('admin.posts.form.slugPlaceholder')}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {t('admin.posts.form.slugHelp')}
            </p>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('admin.posts.form.summary')} *
            </label>
            <div className="mt-1">
              <textarea
                id="summary"
                name="summary"
                rows={3}
                value={formData.summary}
                onChange={handleInputChange}
                className={`block w-full shadow-sm sm:text-sm rounded-md ${
                  errors.summary
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                } dark:bg-gray-800 dark:text-white`}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {t('admin.posts.form.summaryHelp')}
            </p>
            {errors.summary && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.summary}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('admin.posts.form.content')} *
            </label>
            <div className="mt-1">
              <RichTextEditor 
                value={formData.content} 
                onChange={handleContentChange} 
              />
            </div>
            {errors.content && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
            )}
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('admin.posts.form.featuredImage')} *
            </label>
            <input
              type="text"
              name="featuredImage"
              id="featuredImage"
              value={formData.featuredImage}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${
                errors.featuredImage
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
              } dark:bg-gray-800 dark:text-white`}
            />
            {errors.featuredImage && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.featuredImage}</p>
            )}
            {formData.featuredImage && !errors.featuredImage && (
              <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/600x400?text=Invalid+Image';
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('admin.posts.form.tags')}
            </label>
            <div className="mt-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tagNames.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 flex-shrink-0 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700"
                    >
                      <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  id="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder={t('admin.posts.form.addTag')}
                  className="block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                  {t('admin.posts.form.addTagButton')}
                </button>
              </div>
            </div>
            {availableTags.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('admin.posts.form.availableTags')}:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {availableTags
                    .filter(tag => !formData.tagNames.includes(tag.name))
                    .slice(0, 10)
                    .map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleSelectTag(tag)}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {tag.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('admin.posts.form.language')}
            </label>
            <select
              id="language"
              name="language"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
              value={formData.language}
              onChange={handleInputChange}
            >
              {languageOptions.map(option => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Published Checkbox */}
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={formData.published}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="published" className="font-medium text-gray-700 dark:text-gray-300">
                {t('admin.posts.form.published')}
              </label>
              <p className="text-gray-500 dark:text-gray-400">{t('admin.posts.form.publishedHelp')}</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('admin.posts.form.cancel')}
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('admin.posts.form.saveDraft')}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {saving ? t('admin.posts.form.saving') : t('admin.posts.form.publish')}
            </button>
          </div>
        </form>
      )}

      {/* Confirm Leave Modal */}
      {confirmLeave && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900">
                  <ExclamationCircleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    {t('admin.posts.form.unsavedChanges')}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('admin.posts.form.unsavedChangesWarning')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  onClick={confirmNavigateAway}
                >
                  {t('admin.posts.form.leaveAnyway')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setConfirmLeave(false)}
                >
                  {t('admin.posts.form.stayAndEdit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};