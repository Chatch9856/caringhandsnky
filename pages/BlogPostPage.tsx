import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SAMPLE_BLOG_POSTS, ROUTE_BLOG, ROUTE_HOME, UserCircleIcon, CalendarIcon } from '../constants';
import NotFoundPage from './NotFoundPage';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = SAMPLE_BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return <NotFoundPage />;
  }

  const formattedDate = new Date(post.publicationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <article className="bg-white shadow-xl rounded-lg overflow-hidden">
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-64 md:h-80 object-cover"
          />
        )}
        <div className="p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center text-sm text-neutral-DEFAULT mb-6 space-x-4">
            <div className="flex items-center mb-2 sm:mb-0">
              {post.authorImageUrl ? (
                <img src={post.authorImageUrl} alt={post.author} className="w-8 h-8 rounded-full mr-2 object-cover" />
              ) : (
                <UserCircleIcon className="w-8 h-8 mr-2 text-neutral-400" />
              )}
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center mb-2 sm:mb-0">
              <CalendarIcon className="w-5 h-5 mr-2 text-neutral-400" />
              <time dateTime={post.publicationDate}>Published on {formattedDate}</time>
            </div>
          </div>

          {/* 
            WARNING: Using dangerouslySetInnerHTML can be risky if the HTML content isn't trusted.
            For this application, SAMPLE_BLOG_POSTS.content is developer-defined and assumed safe.
            In a real application with user-generated content or CMS-driven content,
            use a sanitization library (like DOMPurify) or a dedicated Markdown-to-HTML renderer component.
          */}
          <div 
            className="prose prose-lg max-w-none text-neutral-dark"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h4 className="text-md font-semibold text-neutral-dark mb-2">Tags:</h4>
              {post.tags.map(tag => (
                <span key={tag} className="inline-block bg-primary-light text-primary-dark text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-slate-200 text-center">
            <Link 
              to={ROUTE_BLOG}
              className="text-accent hover:text-accent-dark font-semibold transition-colors text-lg"
            >
              &larr; Back to Blog
            </Link>
          </div>
        </div>
      </article>
       <style>
        {`
          .prose h2 {
            font-size: 1.5em;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            color: #0891b2; /* primary-DEFAULT */
          }
          .prose h3 {
            font-size: 1.25em;
            margin-top: 1.2em;
            margin-bottom: 0.4em;
            color: #0d9488; /* secondary-DEFAULT */
          }
          .prose p {
            line-height: 1.75;
            margin-bottom: 1em;
          }
          .prose ul, .prose ol {
            margin-left: 1.5em;
            margin-bottom: 1em;
          }
          .prose li {
            margin-bottom: 0.5em;
          }
          .prose a {
            color: #f59e0b; /* accent-DEFAULT */
            text-decoration: underline;
          }
          .prose a:hover {
            color: #b45309; /* accent-dark */
          }
          .prose strong {
            font-weight: 600;
          }
        `}
      </style>
    </div>
  );
};

export default BlogPostPage;