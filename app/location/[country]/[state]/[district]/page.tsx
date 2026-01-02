'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CityCard from '@/components/CityCard';
import { getCountryBySlug, getStateBySlug, getDistrictBySlug, getCitiesByDistrict } from '@/lib/locations';
import { getCityBySlug } from '@/lib/cities';

export default function DistrictPage({
  params,
}: {
  params: { country: string; state: string; district: string };
}) {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryName, setCountryName] = useState('');
  const [stateName, setStateName] = useState('');
  const [districtName, setDistrictName] = useState('');

  useEffect(() => {
    async function loadData() {
      const [country, state, district] = await Promise.all([
        getCountryBySlug(params.country),
        getStateBySlug(params.state),
        getDistrictBySlug(params.district),
      ]);

      if (country && state && district) {
        setCountryName(country.name);
        setStateName(state.name);
        setDistrictName(district.name);

        const citiesData = await getCitiesByDistrict(params.district);
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
  }, [params.country, params.state, params.district]);

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
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{districtName}</h1>
        <p className="text-gray-600">
          {stateName}, {countryName}
        </p>
      </div>

      {cities.length === 0 ? (
        <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No cities found</p>
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
