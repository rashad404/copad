import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RichTextEditor = ({ value, onChange }) => {
  const { t } = useTranslation();
  const editorRef = useRef(null);
  const [html, setHtml] = useState(value || '');
  
  // Sync with external value prop
  useEffect(() => {
    if (value !== html) {
      setHtml(value || '');
      if (editorRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, html]);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setHtml(newContent);
      onChange(newContent);
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current.focus();
  };

  const formatBlock = (block) => {
    executeCommand('formatBlock', block);
  };

  const insertLink = () => {
    const url = prompt(t('admin.editor.linkPrompt'), 'https://');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
        <button
          type="button"
          onClick={() => formatBlock('<h2>')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.heading')}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => formatBlock('<h3>')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.subheading')}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => formatBlock('<p>')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.paragraph')}
        >
          P
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6"></div>
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded font-bold"
          title={t('admin.editor.bold')}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded italic"
          title={t('admin.editor.italic')}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded underline"
          title={t('admin.editor.underline')}
        >
          U
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6"></div>
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.bulletList')}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.numberedList')}
        >
          1. List
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6"></div>
        <button
          type="button"
          onClick={insertLink}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.link')}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.removeFormat')}
        >
          Clear
        </button>
      </div>

      {/* Editor Area */}
      <div 
        ref={editorRef}
        contentEditable={true}
        className="p-4 min-h-[400px] focus:outline-none dark:bg-gray-800 dark:text-white prose dark:prose-invert max-w-none"
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default RichTextEditor;