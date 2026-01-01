import Link from 'next/link';
import { MapPin, DollarSign, Clock, Shield } from 'lucide-react';

interface City {
  name: string;
  state: string;
  slug: string;
  monthlyCost: number;
  avgRent: number;
  commuteTime: number;
  scores: {
    overall: number;
    affordability: number;
    safety: number;
  };
}

interface CityCardProps {
  city: City;
}

export default function CityCard({ city }: CityCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Link href={`/city/${city.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 h-full border border-gray-100 hover:border-blue-300 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {city.name}
            </h3>
            <p className="text-sm text-gray-600">{city.state}</p>
          </div>
          <div className={`px-3 py-1 rounded-full font-bold ${getScoreColor(city.scores.overall)}`}>
            {city.scores.overall}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">
              ${city.monthlyCost.toLocaleString()}/mo
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{city.commuteTime} min commute</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Safety: {city.scores.safety}/100</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-2">Affordability Score</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                city.scores.affordability >= 80
                  ? 'bg-green-500'
                  : city.scores.affordability >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${city.scores.affordability}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
