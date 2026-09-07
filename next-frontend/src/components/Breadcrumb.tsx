'use client';

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  /**
   * Target for this crumb. Omit on the final crumb, which represents the
   * current page and is rendered as plain text.
   */
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-x-2">
              {i > 0 && (
                <span aria-hidden="true" className="text-gray-400 dark:text-gray-600">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded text-indigo-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-gray-700 dark:text-gray-300" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
