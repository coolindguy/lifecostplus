'use client';

import { Shield, TrendingDown, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import {
  type CrimeData,
  type CrimeTrend,
  getSafetyRating,
  calculateYearOverYearChange,
} from '@/lib/safety';

interface SafetyCardProps {
  crimeData: CrimeData;
  trends?: CrimeTrend[];
}

export default function SafetyCard({ crimeData, trends = [] }: SafetyCardProps) {
  const { t } = useI18n();

  const safetyRating = getSafetyRating(crimeData.overallCrimeIndex);
  const yearOverYearChange = trends.length >= 2 ? calculateYearOverYearChange(trends) : null;

  const formatRate = (rate: number): string => {
    return rate.toFixed(1);
  };

  const formatPercentChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getComparisonText = (rate: number, nationalAverage: number): string => {
    const diff = ((rate - nationalAverage) / nationalAverage) * 100;
    if (Math.abs(diff) < 5) {
      return 'Near national average';
    } else if (diff < 0) {
      return `${Math.abs(diff).toFixed(0)}% below average`;
    } else {
      return `${diff.toFixed(0)}% above average`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Safety & Crime</h2>
        <Shield className="w-6 h-6 text-gray-400" />
      </div>

      <div className={`mb-6 p-4 rounded-xl border-2 ${safetyRating.color}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Overall Safety Rating</h3>
            <p className="text-3xl font-bold">{safetyRating.rating}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Crime Index</p>
            <p className="text-2xl font-bold">{crimeData.overallCrimeIndex.toFixed(0)}</p>
            <p className="text-xs text-gray-500">out of 100</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">{safetyRating.description}</p>
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
              {yearOverYearChange.direction === 'improving' && 'Crime rates are decreasing'}
              {yearOverYearChange.direction === 'worsening' && 'Crime rates are increasing'}
              {yearOverYearChange.direction === 'stable' && 'Crime rates are stable'}
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
              {formatPercentChange(yearOverYearChange.overallChange)}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Crime Statistics</h3>
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm font-semibold text-gray-700">Violent Crime</p>
              </div>
              {yearOverYearChange && (
                <span
                  className={`text-xs font-medium ${
                    yearOverYearChange.violentChange < 0 ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {formatPercentChange(yearOverYearChange.violentChange)}
                </span>
              )}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRate(crimeData.violentCrimeRate)}
                </p>
                <p className="text-xs text-gray-600">per 100k residents</p>
              </div>
              <p className="text-xs text-gray-600">
                {getComparisonText(
                  crimeData.violentCrimeRate,
                  crimeData.nationalAverageViolent
                )}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600" />
                <p className="text-sm font-semibold text-gray-700">Property Crime</p>
              </div>
              {yearOverYearChange && (
                <span
                  className={`text-xs font-medium ${
                    yearOverYearChange.propertyChange < 0 ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {formatPercentChange(yearOverYearChange.propertyChange)}
                </span>
              )}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRate(crimeData.propertyCrimeRate)}
                </p>
                <p className="text-xs text-gray-600">per 100k residents</p>
              </div>
              <p className="text-xs text-gray-600">
                {getComparisonText(
                  crimeData.propertyCrimeRate,
                  crimeData.nationalAverageProperty
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Info className="w-4 h-4" />
          <p>
            Data from {crimeData.year}. Lower crime index indicates safer area. Rates normalized
            per 100,000 residents for comparison.
          </p>
        </div>
      </div>
    </div>
  );
}
