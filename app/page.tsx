'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, DollarSign, TrendingUp, Shield } from 'lucide-react';
import CityCard from '@/components/CityCard';
import { getCities, filterCities, sortCitiesByPriority } from '@/lib/cities';

export default function Home() {
  const router = useRouter();
  const [income, setIncome] = useState(60000);
  const [maxRent, setMaxRent] = useState(1500);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorities, setPriorities] = useState<string[]>(['affordability']);

  const togglePriority = (priority: string) => {
    setPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const handleFindCities = () => {
    const params = new URLSearchParams({
      income: income.toString(),
      maxRent: maxRent.toString(),
      priorities: priorities.join(','),
    });
    router.push(`/map?${params.toString()}`);
  };

  const filteredCities = filterCities(income, maxRent);
  const sortedCities = sortCitiesByPriority(filteredCities, priorities);
  const displayCities = sortedCities.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
              <Link href="/compare" className="text-gray-700 hover:text-blue-600 font-medium">
                Compare
              </Link>
              <Link href="/methodology" className="text-gray-700 hover:text-blue-600 font-medium">
                Methodology
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Where can you live well for what you earn?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compare U.S. cities based on affordability, quality of life, and what matters most to you.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Search for a city
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter city name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Annual Income: ${income.toLocaleString()}
              </label>
              <input
                type="range"
                min="30000"
                max="200000"
                step="5000"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$30k</span>
                <span>$200k</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Max Rent: ${maxRent.toLocaleString()}/mo
              </label>
              <input
                type="range"
                min="800"
                max="3500"
                step="50"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$800</span>
                <span>$3,500</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Priority Factors
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'affordability', label: 'Affordability', icon: DollarSign },
                { id: 'commute', label: 'Commute', icon: MapPin },
                { id: 'safety', label: 'Safety', icon: Shield },
                { id: 'lifestyle', label: 'Lifestyle', icon: TrendingUp },
              ].map((priority) => {
                const Icon = priority.icon;
                return (
                  <button
                    key={priority.id}
                    onClick={() => togglePriority(priority.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      priorities.includes(priority.id)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{priority.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleFindCities}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors text-lg shadow-lg hover:shadow-xl"
          >
            Find Best Cities
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Top Matches Based on Your Criteria
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/map"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            View All Cities on Map
          </Link>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            Data is aggregated and indicative only. See our{' '}
            <Link href="/methodology" className="text-blue-400 hover:text-blue-300">
              methodology
            </Link>{' '}
            for details.
          </p>
          <p className="text-gray-500 mt-2">© 2024 LifeCost+. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
