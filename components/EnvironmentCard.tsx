'use client';

import { Wind, Leaf, TrendingDown, TrendingUp, Info, AlertCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import {
  type AirQualityData,
  type AirQualityTrend,
  getAirQualityRating,
  getPollutantLevel,
  calculateYearOverYearAirQualityChange,
} from '@/lib/environment';

interface EnvironmentCardProps {
  airQualityData: AirQualityData;
  trends?: AirQualityTrend[];
}

export default function EnvironmentCard({ airQualityData, trends = [] }: EnvironmentCardProps) {
  const { t } = useI18n();

  const aqiRating = getAirQualityRating(airQualityData.currentAqi);
  const pm25Level = getPollutantLevel(airQualityData.currentPm25, 'pm25');
  const pm10Level = getPollutantLevel(airQualityData.currentPm10, 'pm10');
  const yearOverYearChange =
    trends.length >= 2 ? calculateYearOverYearAirQualityChange(trends) : null;

  const formatValue = (value: number): string => {
    return value.toFixed(1);
  };

  const formatPercentChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const totalDays = 365;
  const goodAirPercentage = (airQualityData.goodAirDays / totalDays) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Air Quality</h2>
        <Wind className="w-6 h-6 text-gray-400" />
      </div>

      <div className={`mb-6 p-4 rounded-xl border-2 ${aqiRating.color}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Current Air Quality</h3>
            <p className="text-3xl font-bold">{aqiRating.rating}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">AQI</p>
            <p className="text-2xl font-bold">{airQualityData.currentAqi}</p>
            <p className="text-xs text-gray-500">out of 500</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">{aqiRating.description}</p>
      </div>

      {yearOverYearChange && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            {yearOverYearChange.direction === 'improving' ? (
              <TrendingDown className="w-5 h-5 text-green-600" />
            ) : yearOverYearChange.direction === 'worsening' ? (
              <TrendingUp className="w-5 h-5 text-red-600" />
            ) : (
              <Info className="w-5 h-5 text-gray-600" />
            )}
            <h3 className="text-sm font-semibold text-gray-700">Year-over-Year Trend</h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {yearOverYearChange.direction === 'improving' && 'Air quality is improving'}
              {yearOverYearChange.direction === 'worsening' && 'Air quality is declining'}
              {yearOverYearChange.direction === 'stable' && 'Air quality is stable'}
            </p>
            <p
              className={`text-lg font-bold ${
                yearOverYearChange.direction === 'improving'
                  ? 'text-green-700'
                  : yearOverYearChange.direction === 'worsening'
                  ? 'text-red-700'
                  : 'text-gray-700'
              }`}
            >
              {formatPercentChange(yearOverYearChange.aqiChange)}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Pollutant Levels</h3>
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold text-gray-700">PM2.5</p>
              </div>
              <span className={`text-xs font-medium ${pm25Level.color}`}>{pm25Level.level}</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(airQualityData.currentPm25)}
                </p>
                <p className="text-xs text-gray-600">µg/m³</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Annual Avg</p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatValue(airQualityData.avgAnnualPm25)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-teal-600" />
                <p className="text-sm font-semibold text-gray-700">PM10</p>
              </div>
              <span className={`text-xs font-medium ${pm10Level.color}`}>{pm10Level.level}</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(airQualityData.currentPm10)}
                </p>
                <p className="text-xs text-gray-600">µg/m³</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Annual Avg</p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatValue(airQualityData.avgAnnualPm10)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wind className="w-4 h-4 text-cyan-600" />
                  <p className="text-xs font-semibold text-gray-700">Ozone (O₃)</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatValue(airQualityData.ozoneLevel)}
                </p>
                <p className="text-xs text-gray-600">ppb</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wind className="w-4 h-4 text-cyan-600" />
                  <p className="text-xs font-semibold text-gray-700">NO₂</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatValue(airQualityData.no2Level)}
                </p>
                <p className="text-xs text-gray-600">ppb</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white rounded-lg">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-700">Good Air Quality Days</h3>
            <p className="text-xs text-gray-600">Annual average</p>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">{airQualityData.goodAirDays}</p>
            <p className="text-xs text-gray-600">days per year</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-700">{goodAirPercentage.toFixed(0)}%</p>
            <p className="text-xs text-gray-600">of the year</p>
          </div>
        </div>
        {airQualityData.unhealthyAirDays > 0 && (
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-xs text-gray-600">
              Unhealthy days: <span className="font-semibold">{airQualityData.unhealthyAirDays}</span> per year
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Info className="w-4 h-4" />
          <p>
            Data from {airQualityData.year}. AQI scale: 0-50 Good, 51-100 Moderate, 101-150
            Unhealthy (Sensitive), 151+ Unhealthy.
          </p>
        </div>
      </div>
    </div>
  );
}
