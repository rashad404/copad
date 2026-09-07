"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  bulkDeletePosts,
  deletePost,
  getAllPosts,
  publishPost,
  unpublishPost,
} from "@/api/admin";
import type { BlogPostListItem } from "@/api/blog";
import ResourceTable from "@/components/admin/ResourceTable";
import type { ResourceConfig } from "@/components/admin/types";
import { useResource } from "@/components/admin/useResource";
import { getErrorMessage } from "@/utils/errors";

const config: ResourceConfig<BlogPostListItem> = {
  title: "Posts",
  singular: "post",
  idKey: "id",
  searchKeys: ["title", "summary"],
  fields: [
    { key: "title", label: "Title", type: "text" },
    {
      key: "published",
      label: "Status",
      type: "badge",
      render: (_, post) => (post.published ? "Published" : "Draft"),
    },
    {
      key: "tags",
      label: "Tags",
      type: "text",
      render: (_, post) => post.tags.map((tag) => tag.name).join(", ") || "-",
    },
    { key: "language", label: "Language", type: "text" },
    { key: "createdAt", label: "Created", type: "date" },
  ],
};
export default function PostsPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("ALL");
  const [selected, setSelected] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchPosts = useCallback(
    async () => (await getAllPosts(page, 20)).data,
    [page],
  );
  const resource = useResource(fetchPosts);
  useEffect(() => {
    setSelected([]);
  }, [resource.data, page, status]);
  useEffect(() => {
    if (
      !resource.loading &&
      !resource.error &&
      resource.data &&
      page > 0 &&
      page >= resource.data.totalPages
    )
      setPage(Math.max(0, resource.data.totalPages - 1));
  }, [resource.data, resource.loading, resource.error, page]);
  const records = (resource.data?.content ?? []).filter(
    (post) => status === "ALL" || post.published === (status === "PUBLISHED"),
  );
  const tableConfig: ResourceConfig<BlogPostListItem> = {
    ...config,
    fields: [
      {
        key: "id",
        label: "Select",
        type: "number",
        render: (_, post) => (
          <input
            type="checkbox"
            aria-label={`Select ${post.title}`}
            disabled={busy}
            checked={selected.includes(post.id)}
            onChange={(event) =>
              setSelected((ids) =>
                event.target.checked
                  ? [...ids, post.id]
                  : ids.filter((id) => id !== post.id),
              )
            }
          />
        ),
      },
      ...config.fields,
    ],
  };
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
        <label>
          Status on this page{" "}
          <select
            className="ml-2 rounded-lg border bg-white p-2 dark:bg-gray-800"
            disabled={busy}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="ALL">All posts</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </label>
        <button
          type="button"
          className="rounded-lg border px-3 py-2 disabled:opacity-50"
          disabled={
            busy || resource.loading || !!resource.error || !records.length
          }
          onClick={() =>
            setSelected(
              selected.length === records.length
                ? []
                : records.map((post) => post.id),
            )
          }
        >
          {selected.length === records.length && records.length
            ? "Clear selection"
            : "Select this page"}
        </button>
        {selected.length > 0 && (
          <button
            type="button"
            className="rounded-lg border border-red-300 px-3 py-2 text-red-600 disabled:opacity-50 dark:text-red-400"
            disabled={busy || resource.loading}
            onClick={async () => {
              if (
                !window.confirm(
                  `Delete ${selected.length} selected posts? This cannot be undone.`,
                )
              )
                return;
              setBusy(true);
              setError(null);
              try {
                await bulkDeletePosts(selected);
              } catch (err) {
                setError(getErrorMessage(err, "Could not delete posts."));
              } finally {
                setSelected([]);
                await resource.reload();
                setBusy(false);
              }
            }}
          >
            {busy ? "Deleting..." : `Delete selected (${selected.length})`}
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <ResourceTable
        config={tableConfig}
        records={records}
        loading={resource.loading || busy}
        error={resource.error}
        onRetry={resource.reload}
        onCreate={() => router.push("/admin/posts/create")}
        pagination={{
          page,
          totalPages: resource.data?.totalPages ?? 0,
          totalElements: resource.data?.totalElements ?? 0,
          onChange: setPage,
        }}
        actions={[
          {
            label: "Edit",
            onClick: (post) => router.push(`/admin/posts/edit/${post.id}`),
          },
          {
            label: "View",
            isAvailable: (post) => post.published,
            onClick: (post) => {
              window.open(
                `/blog/${post.slug}`,
                "_blank",
                "noopener,noreferrer",
              );
            },
          },
          {
            label: "Publish",
            isAvailable: (post) => !post.published,
            onClick: async (post) => {
              await publishPost(post.id);
              await resource.reload();
            },
          },
          {
            label: "Unpublish",
            isAvailable: (post) => post.published,
            onClick: async (post) => {
              await unpublishPost(post.id);
              await resource.reload();
            },
          },
          {
            label: "Delete",
            destructive: true,
            confirmation: (post) =>
              `Delete "${post.title}"? This cannot be undone.`,
            onClick: async (post) => {
              await deletePost(post.id);
              await resource.reload();
            },
          },
        ]}
      />
    </>
  );
}
