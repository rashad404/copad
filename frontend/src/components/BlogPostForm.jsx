import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { createBlogPost, updateBlogPost, getAllTags, createTag } from '../api';

const BlogPostForm = ({ postData, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tagNames: [],
    published: false,
    featuredImage: ''
  });
  
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    // Load available tags
    const loadTags = async () => {
      try {
        const response = await getAllTags();
        setAvailableTags(response.data);
      } catch (err) {
        console.error('Error loading tags:', err);
      }
    };
    
    loadTags();
    
    // If editing, populate form with existing data
    if (isEdit && postData) {
      setFormData({
        title: postData.title || '',
        summary: postData.summary || '',
        content: postData.content || '',
        tagNames: postData.tags ? postData.tags.map(tag => tag.name) : [],
        published: postData.published || false,
        featuredImage: postData.featuredImage || ''
      });
    }
  }, [isEdit, postData]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = t('blog.admin.form.title') + ' ' + t('errors.required');
    } else if (formData.title.length < 5) {
      newErrors.title = t('blog.admin.form.title') + ' must be at least 5 characters';
    }
    
    if (!formData.summary.trim()) {
      newErrors.summary = t('blog.admin.form.summary') + ' ' + t('errors.required');
    } else if (formData.summary.length < 10) {
      newErrors.summary = t('blog.admin.form.summary') + ' must be at least 10 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = t('blog.admin.form.content') + ' ' + t('errors.required');
    }
    
    if (!formData.featuredImage.trim()) {
      newErrors.featuredImage = t('blog.admin.form.featuredImage') + ' ' + t('errors.required');
    } else if (!isValidUrl(formData.featuredImage)) {
      newErrors.featuredImage = 'Please enter a valid URL';
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
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleAddTag = async (e) => {
    e.preventDefault();
    
    if (!newTag.trim()) return;
    
    // Check if tag already exists in availableTags
    const tagExists = availableTags.some(tag => 
      tag.name.toLowerCase() === newTag.trim().toLowerCase()
    );
    
    const tagAlreadyAdded = formData.tagNames.some(tag => 
      tag.toLowerCase() === newTag.trim().toLowerCase()
    );
    
    if (tagAlreadyAdded) {
      setNewTag('');
      return;
    }
    
    // If tag doesn't exist in available tags, create it
    if (!tagExists) {
      try {
        const response = await createTag(newTag.trim());
        setAvailableTags(prev => [...prev, response.data]);
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
    setFormData(prev => ({
      ...prev,
      tagNames: prev.tagNames.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSelectTag = (tagName) => {
    if (formData.tagNames.includes(tagName)) return;
    
    setFormData(prev => ({
      ...prev,
      tagNames: [...prev.tagNames, tagName]
    }));
  };
  
  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();
    
    // Override published status based on saveAsDraft parameter
    const submissionData = {
      ...formData,
      published: saveAsDraft ? false : formData.published
    };
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEdit && postData) {
        await updateBlogPost(postData.id, submissionData);
        setSubmitMessage({
          type: 'success',
          text: t('blog.admin.messages.updateSuccess')
        });
      } else {
        await createBlogPost(submissionData);
        setSubmitMessage({
          type: 'success',
          text: t('blog.admin.messages.createSuccess')
        });
      }
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/blog');
      }, 1500);
    } catch (err) {
      console.error('Error saving post:', err);
      setSubmitMessage({
        type: 'error',
        text: t('blog.admin.messages.error')
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form className="space-y-6">
      {/* Title */}
      <div>
        <label 
          htmlFor="title" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('blog.admin.form.title')}
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder={t('blog.admin.form.titlePlaceholder')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-800"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>
      
      {/* Summary */}
      <div>
        <label 
          htmlFor="summary" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('blog.admin.form.summary')}
        </label>
        <textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder={t('blog.admin.form.summaryPlaceholder')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-800"
        />
        {errors.summary && (
          <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
        )}
      </div>
      
      {/* Content */}
      <div>
        <label 
          htmlFor="content" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('blog.admin.form.content')}
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder={t('blog.admin.form.contentPlaceholder')}
          rows={15}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-800"
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content}</p>
        )}
      </div>
      
      {/* Featured Image URL */}
      <div>
        <label 
          htmlFor="featuredImage" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('blog.admin.form.featuredImage')}
        </label>
        <input
          id="featuredImage"
          name="featuredImage"
          type="text"
          value={formData.featuredImage}
          onChange={handleChange}
          placeholder={t('blog.admin.form.featuredImagePlaceholder')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-800"
        />
        {errors.featuredImage && (
          <p className="text-red-500 text-sm mt-1">{errors.featuredImage}</p>
        )}
        {formData.featuredImage && isValidUrl(formData.featuredImage) && (
          <div className="mt-2 h-40 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img 
              src={formData.featuredImage} 
              alt="Featured" 
              className="h-full w-full object-cover"
              onError={(e) => {e.target.onerror = null; e.target.src = 'https://placehold.co/600x400?text=Invalid+Image'}}
            />
          </div>
        )}
      </div>
      
      {/* Tags */}
      <div>
        <label 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('blog.admin.form.tags')}
        </label>
        
        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tagNames.map(tag => (
            <div 
              key={tag} 
              className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
              <button 
                type="button"
                onClick={() => handleRemoveTag(tag)} 
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Add New Tag */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder={t('blog.admin.form.tagsPlaceholder')}
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-800"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            {t('blog.admin.form.newTag')}
          </button>
        </div>
        
        {/* Available Tags */}
        {availableTags.length > 0 && (
          <div className="mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Available tags:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {availableTags
                .filter(tag => !formData.tagNames.includes(tag.name))
                .map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleSelectTag(tag.name)}
                    className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {tag.name}
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>
      
      {/* Publishing Options */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center">
          <input
            id="published"
            name="published"
            type="checkbox"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label 
            htmlFor="published" 
            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {formData.published ? t('blog.admin.form.published') : t('blog.admin.form.draft')}
          </label>
        </div>
      </div>
      
      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/blog')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {t('blog.admin.form.cancel')}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {t('blog.admin.form.saveAsDraft')}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e)}
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
        >
          {isSubmitting ? '...' : isEdit ? t('blog.admin.form.update') : t('blog.admin.form.publish')}
        </button>
      </div>
      
      {/* Submission Message */}
      {submitMessage.text && (
        <div className={`p-4 rounded-lg ${
          submitMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
        }`}>
          {submitMessage.text}
        </div>
      )}
    </form>
  );
};

export default BlogPostForm;