'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'p-4 min-h-[400px] focus:outline-none prose dark:prose-invert max-w-none',
        dir: 'ltr',
        style: 'direction: ltr; text-align: left;',
      },
    },
  });

  // Update editor content when value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Client-side only
  if (!isMounted) {
    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
        <div className="h-[400px] p-4 bg-gray-50 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }
  
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } rounded`}
          title={t('admin.editor.heading', 'Heading')}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } rounded`}
          title={t('admin.editor.subheading', 'Subheading')}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive('paragraph')
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } rounded`}
          title={t('admin.editor.paragraph', 'Paragraph')}
        >
          P
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive('bold')
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } rounded font-bold`}
          title={t('admin.editor.bold', 'Bold')}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive('italic')
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } rounded italic`}
          title={t('admin.editor.italic', 'Italic')}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive('underline')
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } rounded underline`}
          title={t('admin.editor.underline', 'Underline')}
        >
          U
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive('bulletList')
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } rounded`}
          title={t('admin.editor.bulletList', 'Bullet List')}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 text-sm ${
            editor.isActive('orderedList')
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } rounded`}
          title={t('admin.editor.numberedList', 'Numbered List')}
        >
          1. List
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6"></div>
        <button
          type="button"
          onClick={() => {
            const url = prompt(t('admin.editor.linkPrompt', 'Enter URL:'), 'https://');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`px-2 py-1 text-sm ${
            editor.isActive('link')
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } rounded`}
          title={t('admin.editor.link', 'Insert Link')}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={t('admin.editor.removeFormat', 'Clear Formatting')}
        >
          Clear
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}