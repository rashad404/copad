import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import DOMPurify from 'isomorphic-dompurify';
import BlogPostClient from './client';
import { getBlogPostBySlug, getBlogPosts } from '@/api/serverFetch'; 
import { BlogPost, BlogPostListItem } from '@/api/blog';

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
      const allPosts = await getBlogPosts(0, 6);
      
      // Filter and limit the related posts
      relatedPosts = allPosts
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
  
  // Clean summary for description
  const cleanSummary = post.summary ? DOMPurify.sanitize(post.summary, { ALLOWED_TAGS: [] }) : '';
  
  // Prepare metadata
  return {
    title: post.title,
    description: cleanSummary || `Read ${post.title} on our blog.`,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    keywords: post.tags?.map(tag => tag.name),
    openGraph: {
      title: post.title,
      description: cleanSummary || `Read ${post.title} on our blog.`,
      url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/blog/${post.slug}`,
      siteName: parentMetadata.openGraph?.siteName || 'Dr. CoPad',
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title
        },
        ...previousImages
      ] : previousImages,
      locale: post.language || 'en',
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
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || ''}/blog/${post.slug}`,
    }
  };
}

// Generate JSON-LD structured data
function generateJsonLd(post: BlogPost) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const authorSchema = post.author ? {
    '@type': 'Person',
    name: post.author.name,
    url: `${baseUrl}/author/${post.author.id}`
  } : undefined;

  return {
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
      name: 'Dr. CoPad',
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
}

// The main page component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  const lang = headersList.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en';
  
  // Fetch data on the server
  const { post, relatedPosts, error } = await fetchBlogPost(slug);
  
  // If we have a post, generate the structured data
  const jsonLd = post ? generateJsonLd(post) : null;
  
  // Return the client component with all data pre-fetched
  return (
    <>
      {/* Add JSON-LD structured data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
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