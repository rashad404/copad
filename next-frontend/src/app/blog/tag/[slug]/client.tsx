"use client";

import React, { useState, useEffect } from "react";
import { getErrorMessage } from "@/utils/errors";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { getPostsByTag } from "@/api";
import { normalizePostPage } from "@/api/blog";
import BlogPostCard from "@/components/public/BlogPostCard";
import TagList from "@/components/public/TagList";
import Breadcrumb from "@/components/Breadcrumb";
import MainLayout from "@/components/public/ProductLayout";
import type { BlogPostListItem, Tag } from "@/api/blog";

interface TagPageClientProps {
  initialPosts: BlogPostListItem[];
  tag: Tag | null;
  relatedTags: Tag[];
  slug: string;
  lang: string;
  initialError?: string;
}

const TagPageClient = ({
  initialPosts,
  tag,
  relatedTags,
  slug,
  lang,
  initialError,
}: TagPageClientProps) => {
  const [posts, setPosts] = useState<BlogPostListItem[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 9); // Assume we loaded 9 items initially
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t, i18n } = useTranslation();

  // Set language based on server-side detected language
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    // Add scroll event listener for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadMorePosts = async () => {
    if (!hasMore || loading) return;

    try {
      setError(null);
      setLoading(true);
      const nextPage = page + 1;
      const response = await getPostsByTag(slug, nextPage, 9);

      const { posts: newPosts, hasMore: more } = normalizePostPage(
        response?.data,
        9,
      );

      if (newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage(nextPage);
      }
      setHasMore(newPosts.length > 0 && more);
    } catch (err) {
      console.error("Error loading more posts:", err);
      setError(
        getErrorMessage(err) ||
          t("common.errors.generic", { defaultValue: "An error occurred" }),
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error && posts.length === 0) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <div className="text-red-500 font-medium">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#214be2] text-white rounded-lg hover:bg-indigo-700"
          >
            {t("common.retry")}
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!tag) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-xl font-medium text-[#172a35]  mb-4">
            {t("blog.tag.empty.title", { defaultValue: "Tag Not Found" })}
          </div>
          <p className="text-[#5d6b70]  mb-6">
            {t("blog.tag.empty.description", {
              defaultValue:
                "The requested tag does not exist. Please check the URL or browse all articles.",
            })}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-[#214be2] text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t("blog.backToList", { defaultValue: "Back to Blog" })}
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="public-container public-journal">
        {error && (
          <div className="public-error" role="alert">
            {error}
          </div>
        )}
        <Breadcrumb
          items={[
            { label: t("navbar.home"), href: "/" },
            { label: t("blog.title"), href: "/blog" },
            { label: t("blog.tag.title", { tag: tag.name }) },
          ]}
        />

        <div className="mb-8 mt-6">
          <h1 className="public-journal-title text-3xl font-bold text-[#172a35] ">
            {t("blog.tag.title", { tag: tag.name })}
          </h1>
          <p className="text-lg text-[#5d6b70]  mt-2">
            {t("blog.tag.description", { tag: tag.name })}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            {loading && posts.length === 0 ? (
              <div className="public-journal-grid animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-gray-200  h-80"></div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="public-journal-grid">
                  {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={loadMorePosts}
                      disabled={loading}
                      className="px-6 py-3 bg-white  hover:bg-gray-50  text-[#214be2]  font-medium rounded-full border border-gray-300   transition-colors duration-200 disabled:opacity-70"
                    >
                      {loading ? t("common.loading") : t("common.loadMore")}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50  rounded-xl">
                <h3 className="text-xl font-medium text-[#172a35] ">
                  {t("blog.tag.empty.title", { tag: tag.name })}
                </h3>
                <p className="text-[#5d6b70]  mt-2">
                  {t("blog.tag.empty.description")}
                </p>
                <Link
                  href="/blog"
                  className="mt-6 inline-flex items-center px-4 py-2 bg-[#214be2] hover:bg-indigo-700 text-white rounded-lg"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  {t("blog.backToList")}
                </Link>
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/4 space-y-6">
            {/* Other Tags */}
            {relatedTags.length > 0 && (
              <div className="public-journal-sidebar">
                <h3 className="text-lg font-medium text-[#172a35]  mb-4">
                  {t("blog.tag.otherTags", { defaultValue: "Other Tags" })}
                </h3>
                <TagList tags={relatedTags} />
              </div>
            )}

            {/* Back to Blog Link */}
            <div className="public-journal-sidebar">
              <Link
                href="/blog"
                className="flex items-center text-gray-700  hover:text-[#214be2] "
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                {t("blog.backToList")}
              </Link>
            </div>
          </div>
        </div>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-[#214be2] text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            aria-label={t("common.scrollToTop")}
          >
            <ArrowUpIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </MainLayout>
  );
};

export default TagPageClient;
