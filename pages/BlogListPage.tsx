import React from 'react';
import { SAMPLE_BLOG_POSTS, NewspaperIcon } from '../constants';
import BlogPostCard from '../components/BlogPostCard';

const BlogListPage: React.FC = () => {
  const posts = SAMPLE_BLOG_POSTS; // In a real app, fetch from a service

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-center mb-10 text-center">
        <NewspaperIcon className="w-10 h-10 text-primary mr-3" />
        <h1 className="text-4xl font-bold text-primary-dark">Our Blog</h1>
      </div>
      <p className="text-lg text-neutral-DEFAULT mb-12 text-center max-w-2xl mx-auto">
        Stay updated with the latest news, tips, and insights from CaringHandsNKY. Explore articles on home care, wellness, and family support.
      </p>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <NewspaperIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-neutral-DEFAULT">No blog posts available at the moment.</p>
          <p className="text-neutral-DEFAULT mt-2">Please check back later for updates!</p>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;