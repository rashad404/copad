import { Metadata } from "next";
import { headers } from "next/headers";
import { BlogPostListItem } from "@/api/blog";
import { resolveBlogLanguage } from "@/utils/blogLanguage";
import { searchBlogPosts } from "@/api/serverFetch";
import BlogSearchClient from "./client";
import { siteConfig } from "@/context/siteConfig";

// Add metadata generation for SEO
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || "";

  // Get site info for proper branding
  const siteInfo = siteConfig.getDefaultSiteInfo();
  const AGENT_NAME = siteInfo.AGENT_NAME;

  return {
    title: query
      ? `Search results for "${query}" | ${AGENT_NAME} Blog`
      : `Search Blog | ${AGENT_NAME}`,
    description: query
      ? `Search results for "${query}" in ${AGENT_NAME}'s healthcare and medical blog.`
      : `Search healthcare and medical articles in the ${AGENT_NAME} blog.`,
    // Search result pages must stay out of the index.
    robots: { index: false, follow: true },
  };
}

// Server component to fetch initial search results
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lang?: string }>;
}) {
  const { q, lang: langParam } = await searchParams;
  const query = q || "";
  const headersList = await headers();
  const lang = resolveBlogLanguage(langParam, headersList.get("cookie") || "");

  // Fetch initial search results if we have a query
  let posts: BlogPostListItem[] = [];
  if (query) {
    try {
      posts = await searchBlogPosts(query, 0, 9);
    } catch (error) {
      console.error("Error searching blog posts:", error);
    }
  }

  // Render the client component with pre-fetched data
  return (
    <BlogSearchClient
      key={`${lang}:${query}`}
      initialPosts={posts}
      initialQuery={query}
      lang={lang}
    />
  );
}
