"use client";
import { shortDate } from "@/utils/dates";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BlogPostListItem } from "@/api/blog";
export default function BlogPostCard({
  post,
}: {
  post: Partial<BlogPostListItem>;
}) {
  const { t, i18n } = useTranslation();
  if (!post?.slug) return null;
  const date = post.publishedAt ? new Date(post.publishedAt) : null;
  const image =
    post.featuredImage && !post.featuredImage.includes("example.com")
      ? post.featuredImage
      : null;
  return (
    <article
      className={`public-article-card ${image ? "" : "public-article-text"}`}
    >
      {image && (
        <Link
          href={`/blog/${post.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="public-article-image"
        >
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 700px) 90vw, 40vw"
          />
        </Link>
      )}
      <div className="public-article-card-body">
        <div className="public-article-meta">
          {!image && <BookOpen size={18} />}
          {date && !Number.isNaN(date.getTime()) && (
            <time dateTime={date.toISOString()}>
              {shortDate(date, i18n.resolvedLanguage)}
            </time>
          )}
          {!!post.readingTimeMinutes && (
            <span>
              {t("blog.readingTime", { minutes: post.readingTimeMinutes })}
            </span>
          )}
        </div>
        <h2>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.summary}</p>
        <div className="public-article-bottom">
          <span>{post.author?.name}</span>
          <Link
            href={`/blog/${post.slug}`}
            aria-label={`${t("blog.readMore")}: ${post.title}`}
          >
            {t("blog.readMore")}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
