'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const { t } = useTranslation();
  const editorRef = useRef<HTMLDivElement>(null);
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

  const executeCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const formatBlock = (block: string) => {
    executeCommand('formatBlock', block);
  };

  const insertLink = () => {
    const url = prompt(t('admin.editor.linkPrompt', 'Enter URL:'), 'https://');
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
          title={t('admin.editor.heading', 'Heading')}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => formatBlock('<h3>')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.subheading', 'Subheading')}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => formatBlock('<p>')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.paragraph', 'Paragraph')}
        >
          P
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6"></div>
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded font-bold"
          title={t('admin.editor.bold', 'Bold')}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded italic"
          title={t('admin.editor.italic', 'Italic')}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded underline"
          title={t('admin.editor.underline', 'Underline')}
        >
          U
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6"></div>
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.bulletList', 'Bullet List')}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.numberedList', 'Numbered List')}
        >
          1. List
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6"></div>
        <button
          type="button"
          onClick={insertLink}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.link', 'Insert Link')}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.removeFormat', 'Clear Formatting')}
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
}