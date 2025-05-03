import { Metadata } from 'next';
import { headers } from 'next/headers';
import BlogClient from './client';
import { getBlogPosts, getTopTags } from '@/api/serverFetch';
import { siteConfig } from '@/context/siteConfig';

// Generate SEO metadata
export async function generateMetadata({ searchParams }: { searchParams: { page?: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const currentPage = searchParams?.page ? parseInt(searchParams.page) - 1 : 0;
  
  // Get site info for proper branding using the server-safe function
  const siteInfo = siteConfig.getSiteInfoByHostname('localhost');
  const AGENT_NAME = siteInfo.AGENT_NAME;
  
  // Define supported languages based on available translations
  const supportedLanguages = ['en', 'az', 'tr', 'ru', 'es', 'ar', 'zh', 'hi', 'pt'];
  
  // Create alternates/hreflang entries for all supported languages
  const languageAlternates: Record<string, string> = {};
  supportedLanguages.forEach(lang => {
    languageAlternates[lang] = `${baseUrl}/${lang}/blog`;
  });
  
  // Get basic pagination data to add prev/next links
  const blogUrl = `${baseUrl}/blog`;
  const canonical = currentPage > 0 ? `${blogUrl}?page=${currentPage + 1}` : blogUrl;
  
  // Fetch a small number of posts to determine if there are more pages
  // This is just to get pagination info for metadata
  const { pagination } = await getBlogPosts(currentPage, 9);
  
  // Add prev/next links for pagination SEO
  const prevPageUrl = currentPage > 0 ? `${blogUrl}?page=${currentPage}` : null;
  const nextPageUrl = pagination?.hasNext ? `${blogUrl}?page=${currentPage + 2}` : null;
  
  // Define other metadata properties for pagination
  const otherMetadata: Record<string, string> = {};
  if (prevPageUrl) otherMetadata['prev'] = prevPageUrl;
  if (nextPageUrl) otherMetadata['next'] = nextPageUrl;
  
  const metadata: Metadata = {
    title: `${AGENT_NAME} Blog - Healthcare Articles & Information`,
    description: 'Read articles on healthcare topics, medical advancements, and expert advice from medical professionals.',
    openGraph: {
      title: `${AGENT_NAME} Blog - Healthcare Articles & Information`,
      description: 'Read articles on healthcare topics, medical advancements, and expert advice from medical professionals.',
      url: canonical,
      siteName: AGENT_NAME,
      images: [
        {
          url: `${baseUrl}/images/blog-banner.jpg`,
          width: 1200,
          height: 630,
          alt: 'Dr. CoPad Blog'
        }
      ],
      locale: 'en',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Dr. CoPad Blog - Healthcare Articles & Information',
      description: 'Read articles on healthcare topics, medical advancements, and expert advice from medical professionals.',
      images: [`${baseUrl}/images/blog-banner.jpg`],
    },
    alternates: {
      canonical: canonical,
      languages: languageAlternates,
    },
    ...(Object.keys(otherMetadata).length > 0 && { other: otherMetadata })
  };
  
  return metadata;
}

// Generate JSON-LD structured data for the blog listing
function generateJsonLd(posts: any[]) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  
  // Get site info for proper branding using the server-safe function
  const siteInfo = siteConfig.getSiteInfoByHostname('localhost');
  const AGENT_NAME = siteInfo.AGENT_NAME;
  
  // Blog schema
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${AGENT_NAME} Blog`,
    description: 'Healthcare articles and information from medical professionals',
    url: `${baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: AGENT_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    }
  };
  
  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`
      }
    ]
  };
  
  // ItemList schema for blog posts
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.title
    }))
  };
  
  return [blogSchema, breadcrumbSchema, itemListSchema];
}

// The main page component
export default async function BlogPage({ searchParams }: { searchParams: { page?: string, lang?: string } }) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  
  // Get language from query param first, then from accept-language header, default to 'en'
  // Query param allows for explicit language override
  const langFromHeader = headersList.get('accept-language')?.split(',')[0]?.split('-')[0];
  const cookieHeader = headersList.get('cookie') || '';
  const i18nextLngMatch = cookieHeader.match(/i18nextLng=([^;]+)/);
  const langFromCookie = i18nextLngMatch ? i18nextLngMatch[1] : null;
  
  // Priority: 1. URL param, 2. Cookie, 3. Browser header, 4. Default
  const lang = searchParams?.lang || langFromCookie || langFromHeader || 'en';
  
  // Get the current page from query params, default to 0
  const currentPage = searchParams?.page ? parseInt(searchParams.page) - 1 : 0;
  const pageSize = 9;
  
  // Fetch initial data server-side with explicit language parameter
  const { posts, pagination } = await getBlogPosts(currentPage, pageSize, 'publishedAt', 'desc', lang);
  const tags = await getTopTags(10);
  
  // Generate structured data - Handle different response formats from API
  let postsList = [];
  if (Array.isArray(posts)) {
    postsList = posts;
  } else if (posts && Array.isArray(posts.content)) {
    postsList = posts.content;
  } else if (posts && Array.isArray(posts.posts)) {
    postsList = posts.posts;
  }
  
  const jsonLdSchemas = generateJsonLd(postsList);
  
  // We've moved the pagination metadata to the generateMetadata function
  
  return (
    <>
      {/* Add JSON-LD structured data */}
      {jsonLdSchemas && Array.isArray(jsonLdSchemas) && jsonLdSchemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      
      {/* Render the client component with prefetched data */}
      <BlogClient 
        initialPosts={postsList} 
        initialTags={tags}
        pagination={pagination}
        lang={lang}
      />
    </>
  );
}