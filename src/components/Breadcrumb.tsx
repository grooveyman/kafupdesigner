import React from "react";
import { useNavigate } from "react-router-dom";

export interface Crumb {
  label: string;
  href?: string; // last crumb may not have a link
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  const navigate = useNavigate();

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap text-sm text-gray-400">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={index} className="flex items-center">
              {!isLast && crumb.href ? (
                <button
                  type="button"
                  onClick={() => navigate(crumb.href!)}
                  className="font-medium hover:text-blue-600 focus:outline-none focus:underline"
                >
                  {crumb.label}
                </button>
              ) : (
                <span
                  aria-current="page"
                  className="font-medium text-white"
                >
                  {crumb.label}
                </span>
              )}

              {!isLast && (
                <svg
                  aria-hidden="true"
                  className="mx-2 h-4 w-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
