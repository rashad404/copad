/**
 * Server-side API fetch utilities
 * These functions are designed to be used in Server Components
 * and during server-side rendering (SSR) in Next.js
 */

import { BlogPost, BlogPostListItem, Tag } from './blog';

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Basic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  try {
    // Log the request for debugging
    console.log(`Fetching from: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      next: {
        revalidate: 10, // Revalidate more frequently to reflect language changes
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Special handling for empty response
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}

/**
 * Get a blog post by its slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  try {
    // First try the direct blog endpoint
    return await fetchAPI<BlogPost>(`/blog/${slug}`);
  } catch (error) {
    console.log('Slug endpoint failed, trying to find post by slug in all posts');
    
    // Fallback: Get all posts and find the one with matching slug
    const { posts } = await getBlogPosts(0, 50);
    
    // Ensure we have an array of posts
    if (!Array.isArray(posts)) {
      throw new Error('Failed to retrieve posts list for fallback');
    }
    
    const post = posts.find(p => p.slug === slug);
    
    if (!post) {
      throw new Error(`Post with slug '${slug}' not found`);
    }
    
    // Get the full post by ID if available
    if (post.id) {
      try {
        return await getBlogPostById(post.id);
      } catch (idError) {
        console.log('Failed to get post by ID, using list item instead');
        // If getting by ID fails, fallback to using the list item
        return post as unknown as BlogPost;
      }
    }
    
    // If post has no ID, use the list item as is
    return post as unknown as BlogPost;
  }
}

/**
 * Get a blog post by its ID
 */
export async function getBlogPostById(id: number): Promise<BlogPost> {
  return fetchAPI<BlogPost>(`/blog/posts/${id}`);
}

/**
 * Interface for pagination metadata
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  size: number;
}

/**
 * Get blog posts with pagination
 */
export async function getBlogPosts(
  page = 0,
  size = 10,
  sortBy = 'publishedAt',
  direction = 'desc',
  language?: string
): Promise<{ posts: any; pagination: PaginationInfo }> {
  const langParam = language ? `&language=${language}` : '';
  
  try {
    const response = await fetchAPI<any>(
      `/blog?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}${langParam}`
    );

    // Default pagination info
    let paginationInfo: PaginationInfo = {
      currentPage: page,
      totalPages: 1,
      totalElements: 0,
      hasNext: false,
      hasPrevious: page > 0,
      size
    };

    // Handle different response formats
    if (response && response.content) {
      // Spring Data Page format
      paginationInfo = {
        currentPage: response.number || page,
        totalPages: response.totalPages || 1,
        totalElements: response.totalElements || response.content.length,
        hasNext: response.hasNext || false,
        hasPrevious: (response.number || page) > 0,
        size: response.size || size
      };
    } else if (Array.isArray(response)) {
      // Direct array format
      paginationInfo.totalElements = response.length;
      paginationInfo.hasNext = response.length >= size;
    }
    
    // Return the original response to let the component handle structure differences
    return { posts: response, pagination: paginationInfo };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { 
      posts: [], 
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalElements: 0,
        hasNext: false,
        hasPrevious: page > 0,
        size
      }
    };
  }
}

/**
 * Get top tags
 */
export async function getTopTags(limit = 10): Promise<Tag[]> {
  try {
    const tags = await fetchAPI<Tag[]>(`/tags/top?limit=${limit}`);
    return Array.isArray(tags) ? tags : [];
  } catch (error) {
    console.error('Error fetching top tags:', error);
    return [];
  }
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(
  tagSlug: string,
  page = 0,
  size = 10
): Promise<BlogPostListItem[]> {
  try {
    // First try the dedicated tag endpoint
    try {
      const response = await fetchAPI<any>(
        `/blog/tag/${tagSlug}?page=${page}&size=${size}`
      );

      // Handle different response formats
      if (response && response.content) {
        return response.content as BlogPostListItem[];
      } else if (Array.isArray(response)) {
        return response as BlogPostListItem[];
      }
    } catch (e) {
      console.log(`Tag posts endpoint failed for ${tagSlug}, using fallback method`);
    }
    
    // Fallback: Get all posts and filter by tag
    const { posts } = await getBlogPosts(0, 50);
    
    // Ensure we have an array of posts
    if (!Array.isArray(posts)) {
      return [];
    }
    
    const tag = await getTagBySlug(tagSlug);
    
    if (!tag) {
      return [];
    }
    
    // Filter posts that have this tag
    return posts.filter(post => {
      if (!post.tags || !Array.isArray(post.tags)) {
        return false;
      }
      return post.tags.some(t => t.id === tag.id || t.slug === tagSlug);
    });
    
  } catch (error) {
    console.error(`Error fetching posts for tag ${tagSlug}:`, error);
    return [];
  }
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    // Try direct slug endpoint
    return await fetchAPI<Tag>(`/tags/slug/${slug}`);
  } catch (error) {
    console.log(`Tag slug endpoint failed for ${slug}, trying to find tag in all tags`);
    
    // Fallback: Get all tags and find the matching one
    try {
      const allTags = await getTopTags(100);
      const tag = allTags.find(t => t.slug === slug);
      
      if (!tag) {
        console.error(`Tag with slug '${slug}' not found in any tags`);
        return null;
      }
      
      return tag;
    } catch (fallbackError) {
      console.error(`Error in tag fallback for ${slug}:`, fallbackError);
      return null;
    }
  }
}

/**
 * Search blog posts
 */
export async function searchBlogPosts(
  query: string,
  page = 0,
  size = 10
): Promise<BlogPostListItem[]> {
  try {
    const response = await fetchAPI<any>(
      `/blog/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`
    );

    // Handle different response formats
    if (response && response.content) {
      return response.content as BlogPostListItem[];
    } else if (Array.isArray(response)) {
      return response as BlogPostListItem[];
    }
    
    return [];
  } catch (error) {
    console.error(`Error searching for "${query}":`, error);
    return [];
  }
}