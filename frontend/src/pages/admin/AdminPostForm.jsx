import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { getBlogPostById, createBlogPost, updateBlogPost, getAllTags, createTag, uploadImage } from '../../api';

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
          // Use getBlogPostById instead of getBlogPostBySlug
          const response = await getBlogPostById(id);
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
    
    if (!formData.featuredImage) {
      newErrors.featuredImage = t('admin.posts.form.errors.imageRequired');
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
    
    // First replace Turkish characters with English equivalents
    const turkishToEnglish = {
      'ə': 'e', 'ü': 'u', 'ç': 'c', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ğ': 'g',
      'Ə': 'E', 'Ü': 'U', 'Ç': 'C', 'Ş': 'S', 'I': 'I', 'Ö': 'O', 'Ğ': 'G'
    };
    
    let slugText = formData.title;
    
    // Replace each Turkish character with its English equivalent
    Object.entries(turkishToEnglish).forEach(([turkish, english]) => {
      slugText = slugText.replace(new RegExp(turkish, 'g'), english);
    });
    
    // Then generate slug as before
    const slug = slugText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
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

  const inputClassName = "mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white shadow-sm";

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
        <form className="space-y-6 dark:bg-gray-900">
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
              className={`${inputClassName} ${
                errors.title
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                  : ''
              }`}
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
              className={`${inputClassName} ${
                errors.slug
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                  : ''
              }`}
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
                className={`${inputClassName} ${
                  errors.summary
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
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
              <textarea
                id="content"
                name="content"
                rows={15}
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                className={`${inputClassName} ${
                  errors.content
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                    : ''
                }`}
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
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="featuredImage"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      setSaving(true);
                      const formData = new FormData();
                      formData.append('file', file);
                      const response = await uploadImage(formData);
                      console.log('Upload response:', response);
                      console.log('Image URL:', response.data.original);
                      
                      // Construct a valid URL by ensuring it starts with http(s)://
                      const imageUrl = response.data.original.startsWith('http') 
                        ? response.data.original 
                        : `http://${window.location.host}${response.data.original}`;
                      console.log('Full image URL:', imageUrl);
                      
                      setFormData(prev => ({
                        ...prev,
                        featuredImage: imageUrl
                      }));
                      setErrors(prev => ({ ...prev, featuredImage: null }));
                    } catch (err) {
                      console.error('Error uploading image:', err);
                      setErrors(prev => ({
                        ...prev,
                        featuredImage: t('admin.posts.form.errors.imageUploadFailed')
                      }));
                    } finally {
                      setSaving(false);
                    }
                  }
                }}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 dark:file:bg-indigo-900
                  file:text-indigo-700 dark:file:text-indigo-300
                  hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800"
              />
            </div>
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
                    console.error('Image failed to load:', e.target.src);
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
                  className={`${inputClassName} ${
                    errors.newTag
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
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
              value={formData.language}
              onChange={handleInputChange}
              className={`${inputClassName} ${
                errors.language
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
                  : ''
              }`}
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Publish Status */}
          <div>
            <label htmlFor="published" className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {t('admin.posts.form.publish')}
              </span>
            </label>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => handleSave()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('admin.posts.form.save')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminPostForm;