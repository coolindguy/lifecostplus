'use client';

import { memo } from 'react';
import { MessageSquare, Eye, User, Clock, Pin } from 'lucide-react';
import { ForumThread } from '@/lib/forums';
import { formatDistanceToNow } from 'date-fns';

interface ForumThreadCardProps {
  thread: ForumThread;
  onClick: () => void;
}

function ForumThreadCard({ thread, onClick }: ForumThreadCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'housing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'jobs':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'schools':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'lifestyle':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const timeAgo = formatDistanceToNow(new Date(thread.last_activity), { addSuffix: true });

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {thread.is_pinned && (
              <Pin className="w-4 h-4 text-blue-600 flex-shrink-0" />
            )}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                thread.category
              )}`}
            >
              {thread.category.charAt(0).toUpperCase() + thread.category.slice(1)}
            </span>
            {thread.is_locked && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                Locked
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {thread.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {thread.content}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{thread.author_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MessageSquare className="w-4 h-4" />
            <span className="font-semibold">{thread.reply_count}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="w-3.5 h-3.5" />
            <span>{thread.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ForumThreadCard);
