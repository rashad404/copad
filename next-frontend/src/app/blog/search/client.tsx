"use client";

import React, { useState, useEffect } from "react";
import { getErrorMessage } from "@/utils/errors";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { searchBlogPosts } from "@/api";
import BlogPostCard from "@/components/public/BlogPostCard";
import BlogSearch from "@/components/public/BlogSearch";
import Breadcrumb from "@/components/Breadcrumb";
import MainLayout from "@/components/public/ProductLayout";
import type { BlogPostListItem } from "@/api/blog";
import { normalizePostPage } from "@/api/blog";

interface BlogSearchClientProps {
  initialPosts: BlogPostListItem[];
  initialQuery: string;
  lang: string;
}

const BlogSearchClient = ({
  initialPosts,
  initialQuery,
  lang,
}: BlogSearchClientProps) => {
  const query = initialQuery;
  const [posts, setPosts] = useState<BlogPostListItem[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 9); // Assume we can load more if we got the max items
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
    if (!hasMore || !query.trim() || loading) return;

    try {
      setError(null);
      setLoading(true);
      const nextPage = page + 1;
      const response = await searchBlogPosts(query, nextPage, 9);

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
      console.error("Error loading more search results:", err);
      setError(getErrorMessage(err) || t("common.errors.generic"));
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
          <Link
            href="/blog"
            className="mt-4 inline-flex items-center px-4 py-2 bg-[#214be2] text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t("blog.backToList")}
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
            { label: t("blog.search.results") },
          ]}
        />

        <div className="mb-8 mt-6">
          <h1 className="public-journal-title text-3xl font-bold text-[#172a35]  mb-4">
            {t("blog.search.resultsFor")} &ldquo;{query}&rdquo;
          </h1>

          <div className="w-full max-w-2xl">
            <BlogSearch initialQuery={query} className="mb-6" />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg text-[#5d6b70] ">
              {loading
                ? t("blog.search.searching")
                : posts.length > 0
                  ? t("blog.search.foundResults", { count: posts.length })
                  : t("blog.search.noResults")}
            </p>

            <Link
              href="/blog"
              className="hidden md:flex items-center px-4 py-2 bg-gray-100  text-gray-800  font-medium rounded-lg hover:bg-gray-200  transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {t("blog.backToList")}
            </Link>
          </div>
        </div>

        {loading && posts.length === 0 ? (
          <div className="public-journal-grid public-journal-three animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-200  h-80"></div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="public-journal-grid public-journal-three">
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
        ) : query ? (
          <div className="text-center py-16 bg-gray-50  rounded-xl">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400  mb-4" />
            <h3 className="text-xl font-medium text-[#172a35]  mb-2">
              {t("blog.search.noResultsFor", { query })}
            </h3>
            <p className="text-[#5d6b70]  max-w-lg mx-auto">
              {t("blog.search.tryAgain")}
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-flex items-center px-4 py-2 bg-[#214be2] hover:bg-indigo-700 text-white rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {t("blog.backToList")}
            </Link>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50  rounded-xl">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-400  mb-4" />
            <h3 className="text-xl font-medium text-[#172a35]  mb-2">
              {t("blog.search.enterQuery")}
            </h3>
            <p className="text-[#5d6b70]  max-w-lg mx-auto">
              {t("blog.search.enterQueryDescription")}
            </p>
          </div>
        )}

        <div className="md:hidden mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-gray-100  text-gray-800  font-medium rounded-lg hover:bg-gray-200  transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t("blog.backToList")}
          </Link>
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

export default BlogSearchClient;
