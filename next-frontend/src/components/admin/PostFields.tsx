"use client";

import { useState } from "react";
import DOMPurify from "dompurify";
import { createTag, uploadImage } from "@/api/admin";
import type { Tag } from "@/api/blog";
import RichTextEditor from "./RichTextEditor";
import { getErrorMessage } from "@/utils/errors";

export const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export function PostContent({
  id,
  value,
  onChange,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const [preview, setPreview] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="mb-3 text-sm text-indigo-600 dark:text-indigo-400"
        onClick={() => setPreview(!preview)}
      >
        {preview ? "Edit content" : "Preview content"}
      </button>
      {preview ? (
        <article
          aria-label="Content preview"
          className="prose min-h-40 max-w-none rounded-lg border p-4 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
        />
      ) : (
        <RichTextEditor
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )}
    </div>
  );
}

export function PostImage({
  id,
  value,
  onChange,
  disabled,
  onBusy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  onBusy: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <input
        id={id}
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || busy}
        className={fieldClass}
        placeholder="https://..."
      />
      <label className="block text-sm text-gray-600 dark:text-gray-300">
        Or upload an image
        <input
          className="mt-2 block max-w-full text-sm"
          type="file"
          accept="image/*"
          disabled={disabled || busy}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            event.target.value = "";
            setBusy(true);
            onBusy(true);
            setError(null);
            try {
              const { data } = await uploadImage(file);
              onChange(new URL(data.original, window.location.origin).href);
            } catch (err) {
              setError(getErrorMessage(err, "Could not upload the image."));
            } finally {
              setBusy(false);
              onBusy(false);
            }
          }}
        />
      </label>
      {busy && (
        <p role="status" className="text-sm">
          Uploading image. Wait before saving the post.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function PostTags({
  id,
  tags,
  selected,
  onChange,
  onCreated,
  disabled,
  onBusy,
}: {
  id: string;
  tags: Tag[];
  selected: string[];
  onChange: (names: string[]) => void;
  onCreated: (tag: Tag) => void;
  disabled: boolean;
  onBusy: (busy: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <div id={id} className="space-y-3">
      <fieldset
        disabled={disabled || busy}
        className="flex max-h-56 flex-wrap gap-3 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-600"
      >
        <legend className="sr-only">Tags</legend>
        {tags.length ? (
          tags.map((tag) => (
            <label
              key={tag.id}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200"
            >
              <input
                type="checkbox"
                checked={selected.includes(tag.name)}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...selected, tag.name]
                      : selected.filter((name) => name !== tag.name),
                  )
                }
              />
              {tag.name}
            </label>
          ))
        ) : (
          <p className="text-sm text-gray-500">No tags yet.</p>
        )}
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <input
          aria-label="New tag name"
          className={`${fieldClass} sm:max-w-xs`}
          value={name}
          disabled={disabled || busy}
          onChange={(event) => setName(event.target.value)}
          placeholder="New tag name"
        />
        <button
          type="button"
          disabled={disabled || busy || !name.trim()}
          className="rounded-lg border px-3 py-2 text-sm text-gray-700 disabled:opacity-50 dark:text-gray-200"
          onClick={async () => {
            setBusy(true);
            onBusy(true);
            setError(null);
            try {
              const { data } = await createTag(name.trim());
              onCreated(data);
              onChange([...new Set([...selected, data.name])]);
              setName("");
            } catch (err) {
              setError(getErrorMessage(err, "Could not create the tag."));
            } finally {
              setBusy(false);
              onBusy(false);
            }
          }}
        >
          {busy ? "Creating..." : "Create tag"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
