'use client';

import { Cloud, Droplets, Sun, Thermometer } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import { fahrenheitToCelsius, inchesToMm, type WeatherData } from '@/lib/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { t, unitSystem, setUnitSystem } = useI18n();

  const formatTemp = (tempF: number): string => {
    if (unitSystem === 'metric') {
      return `${fahrenheitToCelsius(tempF)}°C`;
    }
    return `${tempF}°F`;
  };

  const formatPrecipitation = (): string => {
    if (unitSystem === 'metric') {
      return `${inchesToMm(weather.annual_precipitation_inches)}mm`;
    }
    return `${weather.annual_precipitation_inches}"`;
  };

  const seasons = [
    {
      name: t('weather.spring'),
      high: weather.spring_avg_high_f,
      low: weather.spring_avg_low_f,
      color: 'bg-green-100 text-green-700',
    },
    {
      name: t('weather.summer'),
      high: weather.summer_avg_high_f,
      low: weather.summer_avg_low_f,
      color: 'bg-orange-100 text-orange-700',
    },
    {
      name: t('weather.fall'),
      high: weather.fall_avg_high_f,
      low: weather.fall_avg_low_f,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      name: t('weather.winter'),
      high: weather.winter_avg_high_f,
      low: weather.winter_avg_low_f,
      color: 'bg-blue-100 text-blue-700',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('weather.title')}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              unitSystem === 'imperial'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('common.imperial')}
          </button>
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              unitSystem === 'metric'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('common.metric')}
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {t('weather.currentConditions')}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg">
              <Cloud className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {formatTemp(weather.current_temp_f)}
              </p>
              <p className="text-sm text-gray-600">{weather.current_condition}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-700 mb-1">
              <Droplets className="w-4 h-4" />
              <span className="text-sm font-medium">{weather.humidity}%</span>
            </div>
            <p className="text-xs text-gray-500">{t('weather.humidity')}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {t('weather.seasonalAverages')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {seasons.map((season) => (
            <div key={season.name} className={`p-3 rounded-lg ${season.color}`}>
              <p className="text-xs font-semibold mb-2">{season.name}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600">{t('weather.high')}</p>
                  <p className="text-lg font-bold">{formatTemp(season.high)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">{t('weather.low')}</p>
                  <p className="text-lg font-bold">{formatTemp(season.low)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Droplets className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">{t('weather.precipitation')}</p>
            <p className="text-lg font-bold text-gray-900">{formatPrecipitation()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Sun className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-600">{t('weather.sunnyDays')}</p>
            <p className="text-lg font-bold text-gray-900">{weather.sunny_days}/yr</p>
          </div>
        </div>
      </div>
    </div>
  );
}
