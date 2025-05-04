'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { 
  Save, 
  ArrowLeft, 
  X, 
  Plus, 
  Image as ImageIcon, 
  Check,
  FileText,
  Eye
} from 'lucide-react';
import { createPost, uploadImage } from '@/api/admin';
import { getAllTags } from '@/api';
import { Tag } from '@/api/blog';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function CreatePostPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [published, setPublished] = useState(false);
  const [language, setLanguage] = useState(i18n.language);
  const [tagInput, setTagInput] = useState('');
  
  // UI state
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({
    title: '',
    summary: '',
    content: '',
    featuredImage: '',
  });

  // Load available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getAllTags();
        if (Array.isArray(response.data)) {
          setAvailableTags(response.data);
        }
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    
    fetchTags();
  }, []);

  // Mark form as having unsaved changes when any field changes
  useEffect(() => {
    if (title || summary || content || featuredImage || selectedTags.length > 0) {
      setUnsavedChanges(true);
    }
  }, [title, summary, content, featuredImage, selectedTags]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  const generateSlug = () => {
    // First replace Turkish and Azerbaijani characters with English equivalents
    const turkishToEnglish = {
      'ə': 'e', 'ü': 'u', 'ç': 'c', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ğ': 'g',
      'Ə': 'E', 'Ü': 'U', 'Ç': 'C', 'Ş': 'S', 'I': 'I', 'Ö': 'O', 'Ğ': 'G'
    };
    
    let slugText = title.toLowerCase();
    
    // Replace each Turkish/Azerbaijani character with its English equivalent
    Object.entries(turkishToEnglish).forEach(([turkish, english]) => {
      slugText = slugText.replace(new RegExp(turkish, 'g'), english);
    });
    
    // Then generate slug as before
    slugText = slugText
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();
    
    setSlug(slugText);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setErrors({ ...errors, title: '' });
    
    // Auto-generate slug if it's empty or matches the previous pattern
    if (!slug) {
      generateSlug();
    }
  };

  const handleTagAdd = () => {
    if (!tagInput.trim()) return;
    
    // Find if tag already exists
    const existingTag = availableTags.find(tag => 
      tag.name.toLowerCase() === tagInput.trim().toLowerCase()
    );
    
    if (existingTag) {
      // Add existing tag if not already selected
      if (!selectedTags.includes(existingTag.id)) {
        setSelectedTags([...selectedTags, existingTag.id]);
      }
    } else {
      // Would create a new tag in a real implementation
      console.log('Create new tag:', tagInput);
      // For now, we'll just simulate adding the tag (in production, this would create the tag via API)
      const newTagId = Math.floor(Math.random() * -1000); // Temporary negative ID
      const newTag = { id: newTagId, name: tagInput.trim(), slug: tagInput.trim().toLowerCase().replace(/\s+/g, '-') };
      setAvailableTags([...availableTags, newTag]);
      setSelectedTags([...selectedTags, newTagId]);
    }
    
    setTagInput('');
  };

  const handleTagRemove = (tagId: number) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    try {
      setUploadingImage(true);
      const response = await uploadImage(file);
      
      // Get the image URL from the response
      console.log('Upload response:', response);
      console.log('Image URL:', response.data.original);
      
      // Construct a valid URL by ensuring it starts with http(s)://
      // This matches the React implementation
      const imageUrl = response.data.original.startsWith('http') 
        ? response.data.original 
        : `${window.location.protocol}//${window.location.host}${response.data.original}`;
      console.log('Full image URL:', imageUrl);
      setFeaturedImage(imageUrl);
      setErrors({ ...errors, featuredImage: '' });
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setErrors({
        ...errors,
        featuredImage: t('admin.posts.form.errors.imageUploadFailed')
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      summary: '',
      content: '',
      featuredImage: '',
    };
    
    let isValid = true;
    
    if (!title.trim()) {
      newErrors.title = t('admin.posts.form.errors.titleRequired');
      isValid = false;
    }
    
    if (!summary.trim()) {
      newErrors.summary = t('admin.posts.form.errors.summaryRequired');
      isValid = false;
    } else if (summary.length > 500) {
      newErrors.summary = t('admin.posts.form.errors.summaryTooLong');
      isValid = false;
    }
    
    if (!content.trim()) {
      newErrors.content = t('admin.posts.form.errors.contentRequired');
      isValid = false;
    }
    
    if (!featuredImage.trim()) {
      newErrors.featuredImage = t('admin.posts.form.errors.imageRequired');
      isValid = false;
    } else if (!/^https?:\/\//i.test(featuredImage)) {
      newErrors.featuredImage = t('admin.posts.form.errors.invalidUrl');
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const postData = {
        title,
        slug: slug || generateSlug(),
        summary,
        content,
        tags: selectedTags,
        published: !asDraft,
        featuredImage,
        language,
      };
      
      const response = await createPost(postData);
      
      // Reset form and mark as saved
      setUnsavedChanges(false);
      
      // Redirect to post list page
      router.push('/admin/posts');
      
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message || t('admin.posts.form.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    if (unsavedChanges) {
      if (confirm(t('admin.posts.form.unsavedChangesWarning'))) {
        router.push('/admin/posts');
      }
    } else {
      router.push('/admin/posts');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('admin.posts.form.createTitle')}
        </h1>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            type="button"
            onClick={handleCancelClick}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('admin.posts.form.cancel')}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
            {saving ? t('admin.posts.form.saving') : t('admin.posts.form.saveDraft')}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
            {saving ? t('admin.posts.form.saving') : t('admin.posts.form.publish')}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900 p-4 rounded-md text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6">
          <form className="space-y-6" onSubmit={(e) => handleSubmit(e, false)}>
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('admin.posts.form.title')}
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className={`mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white shadow-sm ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
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
                  onClick={generateSlug}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                >
                  {t('admin.posts.form.generateSlug')}
                </button>
              </div>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={t('admin.posts.form.slugPlaceholder')}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white shadow-sm"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {t('admin.posts.form.slugHelp')}
              </p>
            </div>
            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('admin.posts.form.summary')}
              </label>
              <div className="mt-1">
                <textarea
                  id="summary"
                  rows={3}
                  value={summary}
                  onChange={(e) => {
                    setSummary(e.target.value);
                    setErrors({ ...errors, summary: '' });
                  }}
                  className={`block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white shadow-sm ${errors.summary ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {t('admin.posts.form.summaryHelp')}
              </p>
              {errors.summary && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.summary}</p>
              )}
            </div>
            {/* Featured Image */}
            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('admin.posts.form.featuredImage')}
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="text"
                  id="featuredImage"
                  value={featuredImage}
                  onChange={(e) => {
                    setFeaturedImage(e.target.value);
                    setErrors({ ...errors, featuredImage: '' });
                  }}
                  className={`block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white shadow-sm ${errors.featuredImage ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {uploadingImage ? (
                    <div className="h-4 w-4 border-2 border-r-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <ImageIcon className="h-4 w-4 mr-2" />
                  )}
                  {t('admin.posts.form.upload')}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </div>
              {errors.featuredImage && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.featuredImage}</p>
              )}
              {featuredImage && (
                <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="h-40 w-full object-cover"
                    onError={() => setErrors({
                      ...errors,
                      featuredImage: t('admin.posts.form.errors.invalidUrl')
                    })}
                  />
                </div>
              )}
            </div>
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('admin.posts.form.tags')}
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTagAdd();
                    }
                  }}
                  className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white shadow-sm"
                  placeholder={t('admin.posts.form.addTag')}
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 sm:text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t('admin.posts.form.addTagButton')}
                </button>
              </div>
              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 mb-2">
                  {selectedTags.map(tagId => {
                    const tag = availableTags.find(t => t.id === tagId);
                    return tag ? (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                      >
                        {tag.name}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag.id)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 dark:text-indigo-300 hover:text-indigo-500 dark:hover:text-indigo-200 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              {/* Available Tags */}
              {availableTags.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('admin.posts.form.availableTags')}:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          if (!selectedTags.includes(tag.id)) {
                            setSelectedTags([...selectedTags, tag.id]);
                          }
                        }}
                        disabled={selectedTags.includes(tag.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedTags.includes(tag.id)
                            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {tag.name}
                        {selectedTags.includes(tag.id) && (
                          <Check className="ml-1 h-3 w-3" />
                        )}
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
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white shadow-sm"
              >
                <option value="en">{t('admin.posts.form.languageOptions.en')}</option>
                <option value="az">{t('admin.posts.form.languageOptions.az')}</option>
                <option value="tr">{t('admin.posts.form.languageOptions.tr')}</option>
              </select>
            </div>
            {/* Content / Rich Text Editor */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('admin.posts.form.content')}
              </label>
              <div className="mt-1">
                <RichTextEditor
                  value={content}
                  onChange={(newContent) => {
                    setContent(newContent);
                    setErrors({ ...errors, content: '' });
                  }}
                />
              </div>
              {errors.content && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
              )}
            </div>
            {/* Published checkbox */}
            <div className="flex items-center">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('admin.posts.form.published')}
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('admin.posts.form.publishedHelp')}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}