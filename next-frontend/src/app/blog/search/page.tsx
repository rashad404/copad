import { Metadata } from 'next';
import { headers } from 'next/headers';
import { searchBlogPosts } from '@/api/serverFetch';
import BlogSearchClient from './client';
import { siteConfig } from '@/context/siteConfig';

// Add metadata generation for SEO
export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const query = searchParams.q || '';
  
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
    noindex: true, // Don't index search result pages
  };
}

// Server component to fetch initial search results
export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  const headersList = headers();
  const lang = headersList.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en';
  
  // Fetch initial search results if we have a query
  let posts = [];
  if (query) {
    try {
      posts = await searchBlogPosts(query, 0, 9);
    } catch (error) {
      console.error('Error searching blog posts:', error);
    }
  }
  
  // Render the client component with pre-fetched data
  return <BlogSearchClient initialPosts={posts} initialQuery={query} lang={lang} />;
}