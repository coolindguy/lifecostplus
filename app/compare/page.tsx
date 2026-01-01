'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getCities } from '@/lib/cities';

function CompareContent() {
  const searchParams = useSearchParams();
  const [city1Slug, setCity1Slug] = useState(searchParams.get('city1') || '');
  const [city2Slug, setCity2Slug] = useState(searchParams.get('city2') || '');

  const cities = getCities();
  const city1 = cities.find((c) => c.slug === city1Slug);
  const city2 = cities.find((c) => c.slug === city2Slug);

  const getValueColor = (value1: number, value2: number, higherIsBetter = true) => {
    if (higherIsBetter) {
      if (value1 > value2) return { class1: 'text-green-600 font-bold', class2: '' };
      if (value2 > value1) return { class1: '', class2: 'text-green-600 font-bold' };
    } else {
      if (value1 < value2) return { class1: 'text-green-600 font-bold', class2: '' };
      if (value2 < value1) return { class1: '', class2: 'text-green-600 font-bold' };
    }
    return { class1: '', class2: '' };
  };

  const metrics = [
    { label: 'Overall Score', key: 'overall', higherIsBetter: true, isScore: true },
    { label: 'Monthly Cost', key: 'monthlyCost', higherIsBetter: false, currency: true },
    { label: 'Median Income', key: 'medianIncome', higherIsBetter: true, currency: true },
    { label: 'Average Rent', key: 'avgRent', higherIsBetter: false, currency: true },
    {
      label: 'Rent-to-Income %',
      key: 'rentRatio',
      higherIsBetter: false,
      custom: true,
    },
    { label: 'Commute Time', key: 'commuteTime', higherIsBetter: false, suffix: ' min' },
    { label: 'Affordability Score', key: 'affordability', higherIsBetter: true, isScore: true },
    { label: 'Jobs Score', key: 'jobs', higherIsBetter: true, isScore: true },
    { label: 'Commute Score', key: 'commute', higherIsBetter: true, isScore: true },
    { label: 'Safety Score', key: 'safety', higherIsBetter: true, isScore: true },
    { label: 'Lifestyle Score', key: 'lifestyle', higherIsBetter: true, isScore: true },
  ];

  const getValue = (city: any, key: string) => {
    if (key === 'overall') return city.scores.overall;
    if (key === 'affordability') return city.scores.affordability;
    if (key === 'jobs') return city.scores.jobs;
    if (key === 'commute') return city.scores.commute;
    if (key === 'safety') return city.scores.safety;
    if (key === 'lifestyle') return city.scores.lifestyle;
    if (key === 'rentRatio') return ((city.avgRent * 12) / city.medianIncome) * 100;
    return city[key];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              LifeCost+
            </Link>
            <div className="flex gap-6">
              <Link href="/map" className="text-gray-700 hover:text-blue-600 font-medium">
                Map View
              </Link>
              <Link href="/compare" className="text-blue-600 hover:text-blue-700 font-medium">
                Compare
              </Link>
              <Link href="/methodology" className="text-gray-700 hover:text-blue-600 font-medium">
                Methodology
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Compare Cities</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First City</label>
            <select
              value={city1Slug}
              onChange={(e) => setCity1Slug(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Second City</label>
            <select
              value={city2Slug}
              onChange={(e) => setCity2Slug(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {city1 && city2 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
              <div className="p-6 border-r border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Metric</h2>
              </div>
              <div className="p-6 border-r border-gray-200">
                <Link
                  href={`/city/${city1.slug}`}
                  className="text-lg font-bold text-blue-600 hover:underline"
                >
                  {city1.name}, {city1.state}
                </Link>
              </div>
              <div className="p-6">
                <Link
                  href={`/city/${city2.slug}`}
                  className="text-lg font-bold text-blue-600 hover:underline"
                >
                  {city2.name}, {city2.state}
                </Link>
              </div>
            </div>

            {metrics.map((metric) => {
              const val1 = getValue(city1, metric.key);
              const val2 = getValue(city2, metric.key);
              const colors = getValueColor(val1, val2, metric.higherIsBetter);

              const formatValue = (value: number) => {
                if (metric.currency) return `$${value.toLocaleString()}`;
                if (metric.suffix) return `${value}${metric.suffix}`;
                if (metric.custom && metric.key === 'rentRatio')
                  return `${value.toFixed(1)}%`;
                return value;
              };

              return (
                <div key={metric.key} className="grid grid-cols-3 border-b border-gray-200">
                  <div className="p-6 border-r border-gray-200 bg-gray-50 font-medium text-gray-900">
                    {metric.label}
                  </div>
                  <div className={`p-6 border-r border-gray-200 text-lg font-semibold ${colors.class1}`}>
                    {formatValue(val1)}
                  </div>
                  <div className={`p-6 text-lg font-semibold ${colors.class2}`}>
                    {formatValue(val2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(!city1 || !city2) && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-gray-600">Select two cities to compare their metrics</p>
          </div>
        )}
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 LifeCost+. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}
