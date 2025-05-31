
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbPath {
  name: string;
  href: string;
  current: boolean;
}

interface BreadcrumbProps {
  paths: BreadcrumbPath[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-1">
        {paths.map((path, index) => (
          <li key={path.name}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRight className="flex-shrink-0 h-4 w-4 text-slate-400 mx-1" aria-hidden="true" />
              )}
              <a
                href={path.href} // In a real SPA, use Link from react-router-dom
                className={`text-sm font-medium ${
                  path.current ? 'text-primary' : 'text-neutral-500 hover:text-neutral-700'
                }`}
                aria-current={path.current ? 'page' : undefined}
              >
                {path.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
