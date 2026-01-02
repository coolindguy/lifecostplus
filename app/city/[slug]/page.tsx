'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, DollarSign, Home, Car, Utensils, Zap } from 'lucide-react';
import ScoreBar from '@/components/ScoreBar';
import WeatherCard from '@/components/WeatherCard';
import { getCityBySlug } from '@/lib/cities';
import { getWeatherByCitySlug, type WeatherData } from '@/lib/weather';

export default function CityDetail({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      if (city) {
        const weatherData = await getWeatherByCitySlug(city.slug);
        setWeather(weatherData);
      }
    }
    fetchWeather();
  }, [city]);

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              LifeCost+
            </Link>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">City not found</h1>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const rentPercentage = (city.avgRent * 12) / city.medianIncome;
  const breakdown = {
    rent: city.avgRent,
    food: 400,
    transportation: 200,
    utilities: 150,
  };

  const insights = {
    'raleigh-nc': 'Tech hub with strong job market and reasonable cost of living',
    'austin-tx': 'Vibrant lifestyle and thriving tech scene justify moderate costs',
    'denver-co': 'Excellent outdoor lifestyle with growing job opportunities',
    'nashville-tn': 'Affordable with cultural appeal and growing economy',
    'boise-id': 'Low cost of living with quality outdoor recreation',
    'phoenix-az': 'Affordable housing with year-round sunshine',
    'portland-or': 'Great for lifestyle enthusiasts with good walkability',
    'charlotte-nc': 'Growing financial hub with balanced affordability',
    'columbus-oh': 'Excellent value with strong job market',
    'san-antonio-tx': 'Most affordable option with rich cultural heritage',
    'minneapolis-mn': 'Good jobs and culture with reasonable expenses',
    'tampa-fl': 'Affordable with coastal lifestyle and growing opportunities',
    'salt-lake-city-ut': 'Family-friendly with outdoor recreation and growth',
    'indianapolis-in': 'Best value proposition for cost-conscious movers',
    'kansas-city-mo': 'Underrated gem with low costs and strong job growth',
  };

  const insight = insights[city.slug as keyof typeof insights] || 'A great city to live in.';

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
              <Link href="/compare" className="text-gray-700 hover:text-blue-600 font-medium">
                Compare
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {city.name}, {city.state}
              </h1>
              <p className="text-gray-600">Overall Livability Score</p>
            </div>
            <div
              className={`text-5xl font-bold px-6 py-4 rounded-2xl ${
                city.scores.overall >= 80
                  ? 'bg-green-100 text-green-700'
                  : city.scores.overall >= 60
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {city.scores.overall}
            </div>
          </div>

          <div className="space-y-6">
            <ScoreBar label="Affordability" score={city.scores.affordability} />
            <ScoreBar label="Jobs & Opportunity" score={city.scores.jobs} />
            <ScoreBar label="Commute" score={city.scores.commute} />
            <ScoreBar label="Safety" score={city.scores.safety} />
            <ScoreBar label="Lifestyle & Culture" score={city.scores.lifestyle} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Monthly Cost Breakdown</h2>
            <div className="space-y-4">
              {[
                { label: 'Rent', amount: breakdown.rent, icon: Home },
                { label: 'Food', amount: breakdown.food, icon: Utensils },
                { label: 'Transportation', amount: breakdown.transportation, icon: Car },
                { label: 'Utilities', amount: breakdown.utilities, icon: Zap },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
              <div className="pt-4 border-t border-gray-200 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-blue-600">
                  ${city.monthlyCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Metrics</h2>
            <div className="space-y-4">
              <div>
                <span className="text-gray-600">Median Income</span>
                <p className="text-2xl font-bold text-gray-900">
                  ${city.medianIncome.toLocaleString()}/yr
                </p>
              </div>
              <div>
                <span className="text-gray-600">Average Rent</span>
                <p className="text-2xl font-bold text-gray-900">${city.avgRent.toLocaleString()}/mo</p>
              </div>
              <div>
                <span className="text-gray-600">Rent-to-Income Ratio</span>
                <p className="text-2xl font-bold text-gray-900">
                  {(rentPercentage * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {rentPercentage <= 0.3
                    ? 'Very Affordable'
                    : rentPercentage <= 0.35
                    ? 'Affordable'
                    : 'Tight Budget'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Average Commute</span>
                <p className="text-2xl font-bold text-gray-900">{city.commuteTime} minutes</p>
              </div>
            </div>
          </div>

          {weather && <WeatherCard weather={weather} />}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This City Works</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{insight}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in a Comparison?</h2>
          <p className="text-gray-600 mb-6">Compare this city with another to see detailed differences.</p>
          <Link
            href={`/compare?city1=${city.slug}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Compare With Another City
          </Link>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 LifeCost+. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
