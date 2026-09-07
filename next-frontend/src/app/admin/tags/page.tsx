"use client";

import { useState } from "react";
import {
  createTag,
  deleteTag,
  getAllTags,
  getTagById,
  updateTag,
} from "@/api/admin";
import type { Tag } from "@/api/blog";
import ResourceTable from "@/components/admin/ResourceTable";
import ResourceForm from "@/components/admin/ResourceForm";
import type { ResourceConfig } from "@/components/admin/types";
import { useResource } from "@/components/admin/useResource";

const config: ResourceConfig<Tag> = {
  title: "Tags",
  singular: "tag",
  idKey: "id",
  searchKeys: ["name", "slug"],
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", inForm: false },
    { key: "postCount", label: "Posts", type: "number", inForm: false },
  ],
};
const fetchTags = async () => (await getAllTags()).data;

export default function TagsPage() {
  const resource = useResource(fetchTags);
  const [editing, setEditing] = useState<Partial<Tag> | null>(null);
  return (
    <>
      <ResourceTable
        config={config}
        records={resource.data ?? []}
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.reload}
        onCreate={() => setEditing({})}
        actions={[
          {
            label: "Rename",
            onClick: async (tag) => {
              setEditing((await getTagById(tag.id)).data);
            },
          },
          {
            label: "Delete",
            destructive: true,
            confirmation: (tag) =>
              `Delete "${tag.name}"? ${tag.postCount === undefined ? "The attached post count is unavailable." : `${tag.postCount} ${tag.postCount === 1 ? "post is" : "posts are"} attached.`} The tag will be removed from those posts. The posts will remain. This cannot be undone.`,
            onClick: async (tag) => {
              await deleteTag(tag.id);
              await resource.reload();
            },
          },
        ]}
      />
      {editing && (
        <ResourceForm
          config={config}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSubmit={async (values) => {
            const name = String(values.name).trim();
            if (editing.id) await updateTag(editing.id, name);
            else await createTag(name);
            setEditing(null);
            await resource.reload();
          }}
        />
      )}
    </>
  );
}
