'use client';

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && " / "}
          {item.to ? 
            <Link href={item.to} className="text-indigo-600 hover:underline dark:text-indigo-400">
              {item.label}
            </Link> 
            : item.label
          }
        </span>
      ))}
    </nav>
  );
}