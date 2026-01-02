'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Building2 } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import CityCard from '@/components/CityCard';
import { getCountryBySlug, getStateBySlug, getDistrictsByState, getCitiesByState, buildBreadcrumbs, type District, type City } from '@/lib/locations';
import { getCityBySlug } from '@/lib/cities';

export default function StatePage({ params }: { params: { country: string; state: string } }) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryName, setCountryName] = useState('');
  const [stateName, setStateName] = useState('');

  useEffect(() => {
    async function loadData() {
      const [country, state] = await Promise.all([
        getCountryBySlug(params.country),
        getStateBySlug(params.state),
      ]);

      if (country && state) {
        setCountryName(country.name);
        setStateName(state.name);

        const [districtsData, citiesData] = await Promise.all([
          getDistrictsByState(params.state),
          getCitiesByState(params.state),
        ]);

        setDistricts(districtsData);

        const citiesWithDetails = await Promise.all(
          citiesData.map(async (city) => {
            const details = await getCityBySlug(city.slug);
            return details;
          })
        );
        setCities(citiesWithDetails.filter(Boolean));
      }
      setLoading(false);
    }
    loadData();
  }, [params.country, params.state]);

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
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Breadcrumb items={breadcrumbs} />

      <div className="mt-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{stateName}</h1>
        <p className="text-gray-600">{countryName}</p>
      </div>

      {districts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Districts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districts.map((district) => (
              <Link
                key={district.id}
                href={`/location/${params.country}/${params.state}/${district.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{district.name}</h3>
                    <p className="text-sm text-gray-500">View cities</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {cities.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>
      )}

      {districts.length === 0 && cities.length === 0 && (
        <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No locations found</p>
        </div>
      )}
    </div>
  );
}
