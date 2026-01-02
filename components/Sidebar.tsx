'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Home, Map, GitCompare, BookOpen, ChevronRight } from 'lucide-react';

interface SidebarItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
}

const navigationItems: SidebarItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Map View',
    href: '/map',
    icon: <Map className="w-5 h-5" />,
  },
  {
    label: 'Tools',
    icon: <ChevronRight className="w-5 h-5" />,
    children: [
      {
        label: 'Compare Cities',
        href: '/compare',
        icon: <GitCompare className="w-4 h-4" />,
      },
      {
        label: 'Methodology',
        href: '/methodology',
        icon: <BookOpen className="w-4 h-4" />,
      },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Tools']);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const isExpanded = expandedSections.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleSection(item.label)}
            className="w-full px-4 py-3 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors rounded-lg group"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500 group-hover:text-blue-600 transition-colors">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isExpanded && item.children && (
            <div className="ml-2 border-l border-gray-200 mt-1 mb-1">
              {item.children.map((child) => renderItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href || '#'}
        onClick={onClose}
        className={`px-4 py-3 flex items-center gap-3 rounded-lg transition-all ${
          isActive(item.href)
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-50'
        } ${level > 0 ? 'text-sm' : ''}`}
      >
        <span
          className={`${
            isActive(item.href) ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          {item.icon}
        </span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto transition-transform md:relative md:top-0 md:h-screen md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-1">
          {navigationItems.map((item) => renderItem(item))}
        </div>
      </div>
    </>
  );
}
