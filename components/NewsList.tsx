'use client';

import { useEffect, useState } from 'react';
import NewsCard from './NewsCard';
import { NewsItem } from '@/lib/news';

interface NewsListProps {
  locationType: 'city' | 'state';
  locationId: string;
  categories?: Array<'housing' | 'economy' | 'safety' | 'education'>;
}

export default function NewsList({ locationType, locationId, categories = ['housing', 'economy', 'safety', 'education'] }: NewsListProps) {
  const [newsByCategory, setNewsByCategory] = useState<Record<string, NewsItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);

        const newsData: Record<string, NewsItem[]> = {};

        for (const category of categories) {
          const response = await fetch(
            `/api/news?location_type=${locationType}&location_id=${locationId}&category=${category}&limit=5`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch news');
          }

          const data = await response.json();
          newsData[category] = data;
        }

        setNewsByCategory(newsData);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    }

    if (locationId) {
      fetchNews();
    }
  }, [locationType, locationId, categories]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="bg-gray-100 rounded-lg h-40 animate-pulse" />
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

  const allNews = Object.entries(newsByCategory).flatMap(([_, news]) => news);

  if (allNews.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-600">
        <p>No news articles available for this location yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryNews = newsByCategory[category] || [];
        if (categoryNews.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
              {category} News
            </h3>
            <div className="space-y-4">
              {categoryNews.map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  id={newsItem.id}
                  title={newsItem.title}
                  summary={newsItem.summary}
                  content={newsItem.content}
                  category={newsItem.category}
                  source={newsItem.source}
                  sourceUrl={newsItem.source_url}
                  publishedAt={newsItem.published_at}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
