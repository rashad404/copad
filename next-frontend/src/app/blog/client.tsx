"use client";

import React, { useState, useEffect } from "react";
import { getErrorMessage } from "@/utils/errors";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PencilIcon, PlusIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { getBlogPosts } from "@/api";
import BlogPostCard from "@/components/public/BlogPostCard";
import TagList from "@/components/public/TagList";
import BlogSearch from "@/components/public/BlogSearch";
import Breadcrumb from "@/components/Breadcrumb";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/public/ProductLayout";
import type { BlogPostListItem, Tag } from "@/api/blog";
import { normalizePostPage } from "@/api/blog";

interface BlogClientProps {
  initialPosts: BlogPostListItem[];
  initialTags: Tag[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
    size: number;
  };
  lang: string;
}

const BlogClient = ({
  initialPosts,
  initialTags,
  pagination,
  lang,
}: BlogClientProps) => {
  const [posts, setPosts] = useState<BlogPostListItem[]>(initialPosts);
  const [tags] = useState<Tag[]>(initialTags);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(pagination?.currentPage || 0);
  const [hasMore, setHasMore] = useState(
    pagination?.hasNext ?? initialPosts.length >= 9,
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const isAdmin =
    isAuthenticated &&
    (user?.role === "ADMIN" || (user?.roles && user?.roles.includes("ADMIN")));

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
    if (!hasMore || postsLoading) return;

    try {
      setError(null);
      setPostsLoading(true);
      const nextPage = page + 1;
      const response = await getBlogPosts(
        nextPage,
        9,
        "publishedAt",
        "desc",
        i18n.resolvedLanguage,
      );

      const { posts: newPosts, hasMore: more } = normalizePostPage(
        response.data,
        9,
      );

      if (newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage(nextPage);
      }
      setHasMore(newPosts.length > 0 && more);
    } catch (err) {
      console.error("Error loading more posts:", err);
      setError(getErrorMessage(err) || t("common.errors.generic"));
    } finally {
      setPostsLoading(false);
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
            { label: t("blog.title") },
          ]}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-6">
          <div>
            <h1 className="public-journal-title text-3xl font-bold text-[#172a35] ">
              {t("blog.title")}
            </h1>
            <p className="text-lg text-[#5d6b70]  mt-2">{t("blog.subtitle")}</p>
          </div>

          {isAdmin && (
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Link
                href="/admin/posts/create"
                className="flex items-center px-4 py-2 bg-[#214be2] hover:bg-indigo-700   text-white rounded-lg transition-colors "
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                {t("blog.admin.createPost")}
              </Link>
              <Link
                href="/admin/tags"
                className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300   text-gray-800  rounded-lg transition-colors "
              >
                <PencilIcon className="h-5 w-5 mr-1" />
                {t("blog.admin.manageTags")}
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            {postsLoading && posts.length === 0 ? (
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
                      disabled={postsLoading}
                      className="px-6 py-3 bg-white  hover:bg-gray-50  text-[#214be2]  font-medium rounded-full border border-gray-300   transition-colors duration-200 disabled:opacity-70"
                    >
                      {postsLoading
                        ? t("common.loading")
                        : t("common.loadMore")}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50  rounded-xl">
                <h3 className="text-xl font-medium text-[#172a35] ">
                  {t("blog.empty.title")}
                </h3>
                <p className="text-[#5d6b70]  mt-2">
                  {t("blog.empty.description")}
                </p>
                {isAdmin && (
                  <Link
                    href="/admin/posts/create"
                    className="mt-6 inline-flex items-center px-4 py-2 bg-[#214be2] hover:bg-indigo-700 text-white rounded-lg"
                  >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    {t("blog.admin.createPost")}
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/4 space-y-6">
            <div className="public-journal-sidebar">
              <h3 className="text-lg font-medium text-[#172a35]  mb-4">
                {t("blog.search.title")}
              </h3>
              <BlogSearch />
            </div>

            {tags.length > 0 && (
              <div className="public-journal-sidebar">
                <h3 className="text-lg font-medium text-[#172a35]  mb-4">
                  {t("blog.filter.byTag")}
                </h3>
                <TagList tags={tags} />
              </div>
            )}
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

export default BlogClient;
