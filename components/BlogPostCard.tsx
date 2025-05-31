import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { ROUTE_BLOG_POST_DETAIL_PREFIX, UserCircleIcon, CalendarIcon } from '../constants';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formattedDate = new Date(post.publicationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300">
      {post.imageUrl && (
        <Link to={`${ROUTE_BLOG_POST_DETAIL_PREFIX}${post.slug}`}>
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-48 object-cover" 
            loading="lazy"
          />
        </Link>
      )}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold text-primary-dark mb-2">
          <Link to={`${ROUTE_BLOG_POST_DETAIL_PREFIX}${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
        <div className="flex items-center text-xs text-neutral-DEFAULT mb-3 space-x-3">
          <div className="flex items-center">
            {post.authorImageUrl ? (
              <img src={post.authorImageUrl} alt={post.author} className="w-5 h-5 rounded-full mr-1.5 object-cover" />
            ) : (
              <UserCircleIcon className="w-5 h-5 mr-1.5 text-neutral-400" />
            )}
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1.5 text-neutral-400" />
            <time dateTime={post.publicationDate}>{formattedDate}</time>
          </div>
        </div>
        <p className="text-neutral-DEFAULT text-sm mb-4 flex-grow">{post.excerpt}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="inline-block bg-secondary-light text-secondary-dark text-xs font-semibold mr-2 mb-1 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto">
          <Link 
            to={`${ROUTE_BLOG_POST_DETAIL_PREFIX}${post.slug}`}
            className="inline-block text-accent hover:text-accent-dark font-semibold transition-colors"
            aria-label={`Read more about ${post.title}`}
          >
            Read More &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;