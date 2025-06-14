'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '@/components/layouts/MainLayout';

const BlogDebugPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Make a direct fetch call to bypass any axios configuration issues
        const response = await fetch('http://localhost:8080/api/blog?page=0&size=9&sortBy=publishedAt&direction=desc');
        
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Direct fetch response:', data);
        
        if (data && data.content) {
          setPosts(data.content);
        } else if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err.message || 'Failed to fetch blog posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Blog Debug Page</h1>
        
        {loading ? (
          <p>Loading posts...</p>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <div>
            <p className="mb-4">Found {posts.length} posts:</p>
            <ul className="space-y-4">
              {posts.map(post => (
                <li key={post.id} className="border p-4 rounded-lg">
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="text-gray-600">{post.summary}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    Posted {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No posts found.</p>
        )}
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Raw API Request</h2>
          <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-40">
            <pre>GET http://localhost:8080/api/blog?page=0&size=9&sortBy=publishedAt&direction=desc</pre>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogDebugPage;