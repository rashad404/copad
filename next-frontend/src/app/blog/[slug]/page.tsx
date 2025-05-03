import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import BlogPostClient from './client';
import { getBlogPostBySlug, getBlogPosts } from '@/api/serverFetch'; 
import { BlogPost, BlogPostListItem } from '@/api/blog';
import { siteConfig } from '@/context/siteConfig';

// Types for generateMetadata props
type Props = {
  params: { slug: string };
};

// Server-side data fetching
async function fetchBlogPost(slug: string): Promise<{
  post: BlogPost | null;
  relatedPosts: BlogPostListItem[];
  error?: string;
}> {
  try {
    // Get the blog post with the given slug
    const post = await getBlogPostBySlug(slug);
    
    // Fetch related posts if we have tags
    let relatedPosts: BlogPostListItem[] = [];
    if (post && post.tags && post.tags.length > 0) {
      const tagIds = post.tags.map(tag => tag.id);
      
      // Get a few recent posts
      const { posts } = await getBlogPosts(0, 6);
      
      // Extract posts array depending on API response format
      let postsArray: BlogPostListItem[] = [];
      if (Array.isArray(posts)) {
        postsArray = posts;
      } else if (posts && Array.isArray(posts.content)) {
        postsArray = posts.content;
      }
      
      // Filter and limit the related posts
      relatedPosts = postsArray
        .filter(p => 
          p.id !== post.id && 
          p.tags && 
          p.tags.some(t => tagIds.includes(t.id))
        )
        .slice(0, 3);
    }
    
    return { post, relatedPosts };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { 
      post: null, 
      relatedPosts: [],
      error: 'Failed to load blog post'
    };
  }
}

// Generate metadata for the page (SEO)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  
  // Fetch the blog post data
  const { post } = await fetchBlogPost(slug);
  
  // Get the parent metadata (defaults)
  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];
  
  // If post couldn't be fetched, return default metadata
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  
  // Create sanitized summary without HTML tags for metadata
  // We can't use DOMPurify on the server side in Next.js
  const cleanSummary = post.summary ? post.summary.replace(/<\/?[^>]+(>|$)/g, '') : '';
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const postLanguage = post.language || 'en';
  
  // Get site info for proper branding using the server-safe function
  const siteInfo = siteConfig.getSiteInfoByHostname('localhost');
  const AGENT_NAME = siteInfo.AGENT_NAME;
  
  // Define supported languages based on available translations
  const supportedLanguages = ['en', 'az', 'tr', 'ru', 'es', 'ar', 'zh', 'hi', 'pt'];
  
  // Create alternates/hreflang entries for all supported languages
  // Assume posts may be available in multiple languages with the same slug
  const languageAlternates: Record<string, string> = {};
  supportedLanguages.forEach(lang => {
    languageAlternates[lang] = `${baseUrl}/${lang}/blog/${post.slug}`;
  });
  
  // Prepare metadata
  return {
    title: post.title,
    description: cleanSummary || `Read ${post.title} on our blog.`,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    keywords: post.tags?.map(tag => tag.name),
    openGraph: {
      title: post.title,
      description: cleanSummary || `Read ${post.title} on our blog.`,
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: parentMetadata.openGraph?.siteName || AGENT_NAME,
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title
        },
        ...previousImages
      ] : previousImages,
      locale: postLanguage,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.name] : undefined,
      tags: post.tags?.map(tag => tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: cleanSummary || `Read ${post.title} on our blog.`,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
      languages: languageAlternates,
    }
  };
}

// Generate JSON-LD structured data
function generateJsonLd(post: BlogPost) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  
  // Get site info for proper branding using the server-safe function
  const siteInfo = siteConfig.getSiteInfoByHostname('localhost');
  const AGENT_NAME = siteInfo.AGENT_NAME;
  
  const authorSchema = post.author ? {
    '@type': 'Person',
    name: post.author.name,
    url: `${baseUrl}/author/${post.author.id}`
  } : undefined;

  // Create BlogPosting schema
  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.featuredImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: authorSchema,
    publisher: {
      '@type': 'Organization',
      name: AGENT_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`
    },
    keywords: post.tags?.map(tag => tag.name).join(', '),
  };

  // Create BreadcrumbList schema
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
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${post.slug}`
      }
    ]
  };

  // Return an array of schema objects
  return [blogPostSchema, breadcrumbSchema];
}

// The main page component
export default async function BlogPostPage({ params, searchParams }: { params: { slug: string }, searchParams: { lang?: string } }) {
  const { slug } = params;
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
  
  // Fetch data on the server
  const { post, relatedPosts, error } = await fetchBlogPost(slug);
  
  // If we have a post, generate the structured data
  const jsonLdSchemas = post ? generateJsonLd(post) : null;
  
  // Return the client component with all data pre-fetched
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
      <BlogPostClient 
        initialPost={post}
        initialRelatedPosts={relatedPosts}
        initialError={error}
        slug={slug}
        lang={lang}
      />
    </>
  );
}