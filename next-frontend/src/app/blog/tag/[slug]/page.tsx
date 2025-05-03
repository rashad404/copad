import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import TagPageClient from './client';
import { getPostsByTag, getTagBySlug, getTopTags } from '@/api/serverFetch';
import { Tag } from '@/api/blog';

// Types for generateMetadata props
type Props = {
  params: { slug: string };
};

// Fetch the tag and its posts
async function fetchTagData(slug: string) {
  try {
    // Get the tag first
    const tag = await getTagBySlug(slug);
    
    if (!tag) {
      return { tag: null, posts: [], relatedTags: [] };
    }
    
    // Fetch posts for this tag
    const posts = await getPostsByTag(slug, 0, 9);
    
    // Fetch other popular tags (excluding the current one)
    const allTags = await getTopTags(10);
    const relatedTags = allTags.filter(t => t.id !== tag.id);
    
    return { tag, posts, relatedTags };
  } catch (error) {
    console.error(`Error fetching tag data for ${slug}:`, error);
    return { tag: null, posts: [], relatedTags: [], error: 'Failed to load tag data' };
  }
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  
  // Fetch tag data for metadata
  const { tag } = await fetchTagData(slug);
  
  // Get parent metadata
  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];
  
  // If tag doesn't exist, return metadata for 404
  if (!tag) {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.'
    };
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  
  // Define supported languages based on available translations
  const supportedLanguages = ['en', 'az', 'tr', 'ru', 'es', 'ar', 'zh', 'hi', 'pt'];
  
  // Create alternates/hreflang entries for all supported languages
  const languageAlternates: Record<string, string> = {};
  supportedLanguages.forEach(lang => {
    languageAlternates[lang] = `${baseUrl}/${lang}/blog/tag/${slug}`;
  });
  
  return {
    title: `${tag.name} - Blog Posts | Dr. CoPad`,
    description: `Read articles about ${tag.name} - Healthcare information, articles, and expert advice from medical professionals.`,
    keywords: [tag.name, 'healthcare', 'medical articles', 'health information'],
    openGraph: {
      title: `${tag.name} - Blog Posts | Dr. CoPad`,
      description: `Read articles about ${tag.name} - Healthcare information, articles, and expert advice from medical professionals.`,
      url: `${baseUrl}/blog/tag/${slug}`,
      siteName: parentMetadata.openGraph?.siteName || 'Dr. CoPad',
      images: previousImages,
      locale: 'en',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tag.name} - Blog Posts | Dr. CoPad`,
      description: `Read articles about ${tag.name} - Healthcare information, articles, and expert advice from medical professionals.`,
    },
    alternates: {
      canonical: `${baseUrl}/blog/tag/${slug}`,
      languages: languageAlternates,
    }
  };
}

// Generate structured data
function generateJsonLd(tag: Tag, posts: any[]) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  
  // CollectionPage schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tag.name} - Blog Posts`,
    description: `Articles tagged with ${tag.name}`,
    url: `${baseUrl}/blog/tag/${tag.slug}`,
    isPartOf: {
      '@type': 'Blog',
      name: 'Dr. CoPad Blog',
      url: `${baseUrl}/blog`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dr. CoPad',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    keywords: tag.name,
    // Add the number of items in the collection
    numberOfItems: posts.length
  };
  
  // BreadcrumbList schema
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
        name: `${tag.name}`,
        item: `${baseUrl}/blog/tag/${tag.slug}`
      }
    ]
  };
  
  // ItemList schema for the posts in this tag
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
  
  return [collectionPageSchema, breadcrumbSchema, itemListSchema];
}

// The main page component
export default async function TagPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const headersList = headers();
  const lang = headersList.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en';
  
  // Fetch tag data
  const { tag, posts, relatedTags, error } = await fetchTagData(slug);
  
  // If tag doesn't exist, return 404
  if (!tag && !error) {
    notFound();
  }
  
  // Generate structured data if we have a tag
  const jsonLdSchemas = tag ? generateJsonLd(tag, posts) : null;
  
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
      
      {/* Render the client component with server-fetched data */}
      <TagPageClient 
        initialPosts={posts}
        tag={tag}
        relatedTags={relatedTags}
        slug={slug}
        lang={lang}
        initialError={error}
      />
    </>
  );
}