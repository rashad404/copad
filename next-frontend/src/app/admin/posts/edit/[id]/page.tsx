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
  Eye,
  Trash2
} from 'lucide-react';
import { getPostById, updatePost, uploadImage, deletePost } from '@/api/admin';
import { getAllTags } from '@/api';
import { Tag, BlogPost } from '@/api/blog';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const postId = parseInt(params.id, 10);
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({
    title: '',
    summary: '',
    content: '',
    featuredImage: '',
  });

  // Load post data and available tags
  useEffect(() => {
    const loadPostAndTags = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch post and tags in parallel
        const [postResponse, tagsResponse] = await Promise.all([
          getPostById(postId),
          getAllTags()
        ]);
        
        const post = postResponse.data;
        
        // Set form data from post
        setTitle(post.title || '');
        setSlug(post.slug || '');
        setSummary(post.summary || '');
        setContent(post.content || '');
        setFeaturedImage(post.featuredImage || '');
        setPublished(post.published || false);
        setLanguage(post.language || i18n.language);
        
        // Set selected tags
        if (post.tags && Array.isArray(post.tags)) {
          setSelectedTags(post.tags.map(tag => tag.id));
        }
        
        // Set available tags
        if (tagsResponse.data && Array.isArray(tagsResponse.data)) {
          setAvailableTags(tagsResponse.data);
        }
        
        // Reset unsaved changes flag since we just loaded the data
        setUnsavedChanges(false);
      } catch (err: any) {
        console.error('Error loading post data:', err);
        setError(err.message || t('common.errors.generic'));
      } finally {
        setLoading(false);
      }
    };
    
    if (postId) {
      loadPostAndTags();
    }
  }, [postId, i18n.language, t]);

  // Mark form as having unsaved changes when any field changes
  useEffect(() => {
    if (!loading) {
      setUnsavedChanges(true);
    }
  }, [title, slug, summary, content, featuredImage, selectedTags, published, language, loading]);

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
    const slugText = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
    
    setSlug(slugText);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setErrors({ ...errors, title: '' });
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
      setFeaturedImage(response.data.url);
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
      
      await updatePost(postId, postData);
      
      // Reset unsaved changes flag
      setUnsavedChanges(false);
      
      // Show success message or redirect
      router.push('/admin/posts');
      
    } catch (err: any) {
      console.error('Error updating post:', err);
      setError(err.message || t('admin.posts.form.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setSaving(true);
      
      await deletePost(postId);
      
      // Redirect after successful deletion
      router.push('/admin/posts');
      
    } catch (err: any) {
      console.error('Error deleting post:', err);
      setError(err.message || t('common.errors.generic'));
    } finally {
      setSaving(false);
      setShowDeleteModal(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('admin.posts.form.editTitle')}
        </h1>
        <div className="flex space-x-2">
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
            onClick={handleDeleteClick}
            className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900"
          >
            <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
            {t('admin.posts.delete')}
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
        <div className="mb-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={(e) => handleSubmit(e, false)}>
            <div className="space-y-6">
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
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                  } dark:bg-gray-700 dark:text-white`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('admin.posts.form.slug')}
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="block w-full rounded-l-md border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    placeholder={t('admin.posts.form.slugPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 sm:text-sm"
                  >
                    {t('admin.posts.form.generateSlug')}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
                    className={`block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.summary ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                    } dark:bg-gray-700 dark:text-white`}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('admin.posts.form.summaryHelp')}
                </p>
                {errors.summary && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.summary}</p>
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
                    className={`block w-full rounded-l-md shadow-sm sm:text-sm ${
                      errors.featuredImage ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                    } dark:bg-gray-700 dark:text-white`}
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.featuredImage}</p>
                )}
                {featuredImage && (
                  <div className="mt-2">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="h-40 object-cover rounded-md"
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
                    className="block w-full rounded-l-md border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTags.map(tagId => {
                      const tag = availableTags.find(t => t.id === tagId);
                      return tag ? (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
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
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('admin.posts.form.availableTags')}
                    </p>
                    <div className="flex flex-wrap gap-2">
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
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
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
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
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
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-300" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {t('admin.posts.confirmDelete')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('admin.posts.deleteWarning')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  {t('admin.posts.delete')}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  {t('admin.posts.form.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}