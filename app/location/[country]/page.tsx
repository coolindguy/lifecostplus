'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import { getCountryBySlug, getStatesByCountry, buildBreadcrumbs, type State } from '@/lib/locations';

export default function CountryPage({ params }: { params: { country: string } }) {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryName, setCountryName] = useState('');

  useEffect(() => {
    async function loadData() {
      const country = await getCountryBySlug(params.country);
      if (country) {
        setCountryName(country.name);
        const statesData = await getStatesByCountry(params.country);
        setStates(statesData);
      }
      setLoading(false);
    }
    loadData();
  }, [params.country]);

  const breadcrumbs = [
    {
      label: countryName,
      href: `/location/${params.country}`,
      slug: params.country,
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{countryName}</h1>
        <p className="text-gray-600">Explore states and territories</p>
      </div>

      {states.length === 0 ? (
        <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No states found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {states.map((state) => (
            <Link
              key={state.id}
              href={`/location/${params.country}/${state.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{state.name}</h3>
                  <p className="text-sm text-gray-500">View cities and districts</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
