'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Home, DollarSign, Shield, GraduationCap, ExternalLink, Calendar } from 'lucide-react';

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'housing' | 'economy' | 'safety' | 'education';
  source: string;
  sourceUrl?: string;
  publishedAt: string;
}

const categoryConfig = {
  housing: {
    icon: Home,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Housing',
  },
  economy: {
    icon: DollarSign,
    color: 'bg-green-50 text-green-700 border-green-200',
    label: 'Economy',
  },
  safety: {
    icon: Shield,
    color: 'bg-red-50 text-red-700 border-red-200',
    label: 'Safety',
  },
  education: {
    icon: GraduationCap,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Education',
  },
};

export default function NewsCard({
  title,
  summary,
  content,
  category,
  source,
  sourceUrl,
  publishedAt,
}: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = categoryConfig[category];
  const Icon = config.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-2 rounded-lg border ${config.color} flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(publishedAt)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
              {title}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">{summary}</p>

          {isExpanded && (
            <div className="pt-3 border-t border-gray-100">
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                {content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{source}</span>
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View Source</span>
                </a>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <>
                  <span>Less</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>More</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
