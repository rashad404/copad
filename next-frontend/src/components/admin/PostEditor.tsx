"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createPost,
  getAllTags,
  getPostById,
  updatePost,
  type AdminPostInput,
} from "@/api/admin";
import type { Tag } from "@/api/blog";
import ResourceForm from "./ResourceForm";
import ResourceTable from "./ResourceTable";
import type { ResourceConfig } from "./types";
import { useResource } from "./useResource";
import { PostContent, PostImage, PostTags } from "./PostFields";

type PostRecord = AdminPostInput & { id?: number; slug?: string };
const length =
  (label: string, min: number, max: number) => (value: unknown) => {
    const size = String(value ?? "").trim().length;
    return size < min || size > max
      ? `${label} must be between ${min} and ${max} characters.`
      : null;
  };
const emptyConfig: ResourceConfig<PostRecord> = {
  title: "Posts",
  singular: "post",
  idKey: "id",
  fields: [],
};

export default function PostEditor({ id }: { id?: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const fetchPost = useCallback(async () => {
    if (id !== undefined && (!Number.isSafeInteger(id) || id < 1))
      throw new Error("Invalid post ID.");
    const [tagResponse, postResponse] = await Promise.all([
      getAllTags(),
      id ? getPostById(id) : Promise.resolve(null),
    ]);
    const post = postResponse?.data;
    return {
      tags: tagResponse.data,
      initial: post
        ? {
            id: post.id,
            slug: post.slug,
            title: post.title,
            summary: post.summary,
            content: post.content,
            tagNames: post.tags.map((tag) => tag.name),
            published: post.published,
            featuredImage: post.featuredImage ?? "",
            language: post.language,
          }
        : ({
            title: "",
            summary: "",
            content: "",
            tagNames: [],
            published: false,
            featuredImage: "",
            language: "az",
          } as PostRecord),
    };
  }, [id]);
  const resource = useResource(fetchPost);
  useEffect(() => {
    if (resource.data) setTags(resource.data.tags);
  }, [resource.data]);
  const config: ResourceConfig<PostRecord> = {
    ...emptyConfig,
    fields: [
      {
        key: "title",
        label: "Title",
        type: "text",
        required: true,
        validate: length("Title", 5, 200),
        helpText:
          "The URL slug is generated from the title by the server. Changing a title also changes its URL.",
      },
      {
        key: "summary",
        label: "Summary",
        type: "textarea",
        required: true,
        validate: length("Summary", 10, 500),
      },
      {
        key: "content",
        label: "Content",
        type: "textarea",
        required: true,
        validate: (value) =>
          String(value ?? "")
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;|&#160;/g, " ")
            .trim()
            ? null
            : "Write the post content.",
        renderInput: (props) => (
          <PostContent
            id={props.id}
            value={String(props.value ?? "")}
            onChange={props.onChange}
            disabled={props.disabled}
          />
        ),
      },
      {
        key: "featuredImage",
        label: "Featured image URL",
        type: "text",
        required: true,
        validate: (value) => {
          try {
            const url = new URL(String(value));
            return ["http:", "https:"].includes(url.protocol)
              ? null
              : "Use an HTTP or HTTPS image URL.";
          } catch {
            return "Use a complete image URL.";
          }
        },
        renderInput: (props) => (
          <PostImage
            onBusy={setPending}
            id={props.id}
            value={String(props.value ?? "")}
            onChange={props.onChange}
            disabled={props.disabled}
          />
        ),
      },
      {
        key: "tagNames",
        label: "Tags",
        type: "text",
        renderInput: (props) => (
          <PostTags
            onBusy={setPending}
            id={props.id}
            tags={tags}
            selected={(props.value ?? []) as string[]}
            onChange={props.onChange}
            disabled={props.disabled}
            onCreated={(tag) =>
              setTags((current) => [
                ...current.filter((item) => item.id !== tag.id),
                tag,
              ])
            }
          />
        ),
      },
      {
        key: "language",
        label: "Post language",
        type: "select",
        required: true,
        options: [
          { label: "Azerbaijani", value: "az" },
          { label: "English", value: "en" },
          { label: "Turkish", value: "tr" },
          ...(resource.data?.initial.language &&
          !["az", "en", "tr"].includes(resource.data.initial.language)
            ? [
                {
                  label: resource.data.initial.language,
                  value: resource.data.initial.language,
                },
              ]
            : []),
        ],
      },
      {
        key: "published",
        label: "Published (visible on the public blog)",
        type: "boolean",
        helpText: "Leave unchecked to save a draft.",
      },
    ],
  };
  if (!resource.data || resource.loading || resource.error)
    return (
      <ResourceTable
        config={emptyConfig}
        records={[]}
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.reload}
      />
    );
  return (
    <div className="max-w-4xl">
      {resource.data.initial.slug && (
        <p className="mb-4 break-all text-sm text-gray-500 dark:text-gray-400">
          Current URL: /blog/{resource.data.initial.slug}
        </p>
      )}
      <ResourceForm
        inline
        pending={pending}
        config={config}
        initial={resource.data.initial}
        onCancel={() => router.push("/admin/posts")}
        onSubmit={async (values) => {
          const payload: AdminPostInput = {
            title: values.title!.trim(),
            summary: values.summary!.trim(),
            content: values.content!,
            featuredImage: values.featuredImage!.trim(),
            tagNames: values.tagNames ?? [],
            published: Boolean(values.published),
            language: values.language!,
          };
          if (id) await updatePost(id, payload);
          else await createPost(payload);
          router.push("/admin/posts");
        }}
      />
    </div>
  );
}
