'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Chrome as Home, Car, Utensils, Zap, MapPin } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import ScoreBar from '@/components/ScoreBar';
import CityCard from '@/components/CityCard';
import { getCountryBySlug, getStateBySlug, getDistrictBySlug, getCityBySlug as getDbCityBySlug, getNearbyCities, type NearbyCity } from '@/lib/locations';
import { getCityBySlug } from '@/lib/cities';
import { isFeatureEnabled } from '@/lib/feature-flags';

export default function CityPage({
  params,
}: {
  params: { country: string; state: string; district: string; city: string };
}) {
  const searchParams = useSearchParams();
  const [city, setCity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countryName, setCountryName] = useState('');
  const [stateName, setStateName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [nearbyCities, setNearbyCities] = useState<NearbyCity[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  const radius = parseInt(searchParams.get('radius') || '25');
  const unit = (searchParams.get('unit') || 'miles') as 'miles' | 'kilometers';

  useEffect(() => {
    async function loadData() {
      const [country, state, district, cityDetails] = await Promise.all([
        getCountryBySlug(params.country),
        getStateBySlug(params.state),
        getDistrictBySlug(params.district),
        getCityBySlug(params.city),
      ]);

      if (country && state && district && cityDetails) {
        setCountryName(country.name);
        setStateName(state.name);
        setDistrictName(district.name);
        setCity(cityDetails);
      }
      setLoading(false);
    }
    loadData();
  }, [params.country, params.state, params.district, params.city]);

  useEffect(() => {
    async function loadNearbyCities() {
      if (!params.city || !isFeatureEnabled('proximity')) return;

      setLoadingNearby(true);
      try {
        const radiusInMiles = unit === 'kilometers' ? radius * 0.621371 : radius;
        const nearby = await getNearbyCities(params.city, radiusInMiles);
        setNearbyCities(nearby);
      } catch (error) {
        console.error('Error loading nearby cities:', error);
        setNearbyCities([]);
      } finally {
        setLoadingNearby(false);
      }
    }
    loadNearbyCities();
  }, [params.city, radius, unit]);

  const breadcrumbs = [
    {
      label: countryName,
      href: `/location/${params.country}`,
      slug: params.country,
    },
    {
      label: stateName,
      href: `/location/${params.country}/${params.state}`,
      slug: params.state,
    },
    {
      label: districtName,
      href: `/location/${params.country}/${params.state}/${params.district}`,
      slug: params.district,
    },
    {
      label: city?.name || '',
      href: `/location/${params.country}/${params.state}/${params.district}/${params.city}`,
      slug: params.city,
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
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

  const insights: Record<string, string> = {
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

  const insight = insights[city.slug] || 'A great city to live in.';

  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Breadcrumb items={breadcrumbs} />

      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{city.name}</h1>
              <p className="text-gray-600">
                {districtName}, {stateName}
              </p>
              <p className="text-sm text-gray-500 mt-1">Overall Livability Score</p>
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

        <div className="grid md:grid-cols-2 gap-8 mb-8">
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
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This City Works</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{insight}</p>
        </div>

        {isFeatureEnabled('proximity') && nearbyCities.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Nearby Cities ({nearbyCities.length})
              </h2>
            </div>
            {loadingNearby ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyCities.map((nearbyCity) => (
                  <div key={nearbyCity.id}>
                    <CityCard city={nearbyCity as any} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isFeatureEnabled('compare') && (
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
        )}
      </div>
    </div>
  );
}
