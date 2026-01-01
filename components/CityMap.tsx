'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { City } from '@/lib/cities';

interface CityMapProps {
  cities: City[];
}

export default function CityMap({ cities }: CityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapBoxAccessToken = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

    mapContainer.current.innerHTML = `
      <svg viewBox="0 0 1000 600" style="width: 100%; height: 100%;">
        <rect width="1000" height="600" fill="#e0e7ff"/>
        <text x="500" y="300" text-anchor="middle" fill="#4b5563" font-size="18" font-weight="bold">
          Interactive Map
        </text>
        <text x="500" y="330" text-anchor="middle" fill="#6b7280" font-size="14">
          U.S. Cities by Overall Score
        </text>
      </svg>
    `;
  }, []);

  const getMarkerColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="w-full h-full bg-blue-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col">
      <div ref={mapContainer} style={{ flex: 1 }} className="bg-gradient-to-b from-blue-100 to-blue-50" />

      <div className="p-6 border-t border-gray-200 bg-white">
        <h3 className="font-bold text-gray-900 mb-4">Top Cities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cities.slice(0, 6).map((city) => (
            <Link
              key={city.slug}
              href={`/city/${city.slug}`}
              className="p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 text-sm">{city.name}</span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getMarkerColor(city.scores.overall) }}
                />
              </div>
              <div className="text-xs text-gray-600">
                Score: {city.scores.overall} | ${city.monthlyCost.toLocaleString()}/mo
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
