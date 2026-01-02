'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '@/lib/locations';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  includeHome?: boolean;
}

export default function Breadcrumb({ items, includeHome = true }: BreadcrumbProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 overflow-x-auto">
      {includeHome && (
        <>
          <Link
            href="/"
            className="flex items-center hover:text-blue-600 transition-colors flex-shrink-0"
          >
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.slug} className="flex items-center space-x-2">
            {isLast ? (
              <span className="text-gray-900 font-medium flex-shrink-0">{item.label}</span>
            ) : (
              <>
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition-colors flex-shrink-0"
                >
                  {item.label}
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
