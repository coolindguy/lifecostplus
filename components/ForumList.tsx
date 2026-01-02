'use client';

import { useState, useEffect } from 'react';
import { Plus, Home, Briefcase, GraduationCap, Coffee } from 'lucide-react';
import ForumThreadCard from './ForumThreadCard';
import ThreadView from './ThreadView';
import NewThreadDialog from './NewThreadDialog';
import { ForumThread, ForumCategory, LocationType } from '@/lib/forums';

interface ForumListProps {
  locationId: string;
  locationType: LocationType;
  locationName: string;
}

export default function ForumList({ locationId, locationType, locationName }: ForumListProps) {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | 'all'>('all');
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [showNewThread, setShowNewThread] = useState(false);

  const categories = [
    { id: 'all' as const, label: 'All Topics', icon: Coffee },
    { id: 'housing' as const, label: 'Housing', icon: Home },
    { id: 'jobs' as const, label: 'Jobs', icon: Briefcase },
    { id: 'schools' as const, label: 'Schools', icon: GraduationCap },
    { id: 'lifestyle' as const, label: 'Lifestyle', icon: Coffee },
  ];

  useEffect(() => {
    fetchThreads();
  }, [locationId, locationType]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredThreads(threads);
    } else {
      setFilteredThreads(threads.filter((t) => t.category === selectedCategory));
    }
  }, [selectedCategory, threads]);

  async function fetchThreads() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/forums?location_id=${locationId}&location_type=${locationType}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch forum threads');
      }

      const data = await response.json();
      setThreads(data);
      setFilteredThreads(data);
    } catch (err) {
      console.error('Error fetching forum threads:', err);
      setError('Failed to load forum threads');
    } finally {
      setLoading(false);
    }
  }

  function handleThreadClick(thread: ForumThread) {
    setSelectedThread(thread);
  }

  function handleThreadClose() {
    setSelectedThread(null);
    fetchThreads();
  }

  function handleNewThreadSuccess() {
    setShowNewThread(false);
    fetchThreads();
  }

  if (selectedThread) {
    return (
      <ThreadView
        thread={selectedThread}
        onClose={handleThreadClose}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const count =
              category.id === 'all'
                ? threads.length
                : threads.filter((t) => t.category === category.id).length;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowNewThread(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Thread
        </button>
      </div>

      {filteredThreads.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">
            No threads yet in this category. Be the first to start a discussion!
          </p>
          <button
            onClick={() => setShowNewThread(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Start a Discussion
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredThreads.map((thread) => (
            <ForumThreadCard
              key={thread.id}
              thread={thread}
              onClick={() => handleThreadClick(thread)}
            />
          ))}
        </div>
      )}

      {showNewThread && (
        <NewThreadDialog
          locationId={locationId}
          locationType={locationType}
          locationName={locationName}
          onClose={() => setShowNewThread(false)}
          onSuccess={handleNewThreadSuccess}
        />
      )}
    </div>
  );
}
