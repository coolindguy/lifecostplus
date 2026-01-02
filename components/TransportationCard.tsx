'use client';

import {
  Car,
  Train,
  Bike,
  TrendingDown,
  TrendingUp,
  Info,
  Navigation,
  Clock,
  DollarSign,
  Activity,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import {
  type TransportationData,
  type TransportationTrend,
  getCommuteTimeRating,
  getCarDependencyRating,
  getTransitQualityRating,
  getTrafficCongestionRating,
  calculateYearOverYearCommuteChange,
} from '@/lib/transportation';

interface TransportationCardProps {
  transportationData: TransportationData;
  trends?: TransportationTrend[];
}

export default function TransportationCard({
  transportationData,
  trends = [],
}: TransportationCardProps) {
  const { t } = useI18n();

  const commuteRating = getCommuteTimeRating(transportationData.avgCommuteTimeMinutes);
  const carDependencyRating = getCarDependencyRating(transportationData.carDependencyScore);
  const transitQualityRating = getTransitQualityRating(transportationData.transitQualityScore);
  const congestionRating = getTrafficCongestionRating(transportationData.trafficCongestionIndex);
  const yearOverYearChange =
    trends.length >= 2 ? calculateYearOverYearCommuteChange(trends) : null;

  const formatValue = (value: number): string => {
    return value.toFixed(1);
  };

  const formatPercentChange = (change: number): string => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const transportModes = [
    {
      name: 'Public Transit',
      value: transportationData.publicTransitUsagePercent,
      icon: Train,
      color: 'bg-blue-500',
    },
    {
      name: 'Drive Alone',
      value: transportationData.carUsagePercent,
      icon: Car,
      color: 'bg-gray-500',
    },
    {
      name: 'Carpool',
      value: transportationData.carpoolUsagePercent,
      icon: Car,
      color: 'bg-green-500',
    },
    {
      name: 'Bike',
      value: transportationData.bikeUsagePercent,
      icon: Bike,
      color: 'bg-teal-500',
    },
    {
      name: 'Walk',
      value: transportationData.walkUsagePercent,
      icon: Navigation,
      color: 'bg-cyan-500',
    },
    {
      name: 'Work from Home',
      value: transportationData.workFromHomePercent,
      icon: Activity,
      color: 'bg-orange-500',
    },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Commute & Transportation</h2>
        <Car className="w-6 h-6 text-gray-400" />
      </div>

      <div className={`mb-6 p-4 rounded-xl border-2 ${commuteRating.color}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Average Commute Time</h3>
            <p className="text-3xl font-bold">{commuteRating.rating}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <p className="text-2xl font-bold">{Math.round(transportationData.avgCommuteTimeMinutes)}</p>
            </div>
            <p className="text-xs text-gray-500">minutes each way</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">{commuteRating.description}</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-600">Commute Time</p>
              <p
                className={`text-lg font-bold ${
                  yearOverYearChange.commuteChange < 0
                    ? 'text-green-700'
                    : yearOverYearChange.commuteChange > 0
                    ? 'text-red-700'
                    : 'text-gray-700'
                }`}
              >
                {formatPercentChange(yearOverYearChange.commuteChange)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Transit Usage</p>
              <p
                className={`text-lg font-bold ${
                  yearOverYearChange.transitUsageChange > 0
                    ? 'text-green-700'
                    : yearOverYearChange.transitUsageChange < 0
                    ? 'text-red-700'
                    : 'text-gray-700'
                }`}
              >
                {formatPercentChange(yearOverYearChange.transitUsageChange)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Transportation Mode Share</h3>
        <div className="space-y-2">
          {transportModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div key={mode.name} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${mode.color} bg-opacity-10`}>
                  <Icon className={`w-4 h-4 ${mode.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-700">{mode.name}</p>
                    <p className="text-sm font-bold text-gray-900">{formatValue(mode.value)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${mode.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${mode.value}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Car Dependency</h3>
            <p className="text-xs text-gray-600">{carDependencyRating.description}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${carDependencyRating.color}`}>
              {carDependencyRating.rating}
            </p>
            <p className="text-xs text-gray-600">
              Score: {Math.round(transportationData.carDependencyScore)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Transportation Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Train className="w-4 h-4 text-green-600" />
              <p className="text-xs font-semibold text-gray-700">Transit Quality</p>
            </div>
            <p className={`text-xl font-bold ${transitQualityRating.color}`}>
              {transitQualityRating.rating}
            </p>
            <p className="text-xs text-gray-600">
              Score: {Math.round(transportationData.transitQualityScore)}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-orange-600" />
              <p className="text-xs font-semibold text-gray-700">Traffic Congestion</p>
            </div>
            <p className={`text-xl font-bold ${congestionRating.color}`}>
              {congestionRating.rating}
            </p>
            <p className="text-xs text-gray-600">
              Index: {Math.round(transportationData.trafficCongestionIndex)}
            </p>
          </div>
        </div>
      </div>

      {transportationData.commuteComputeMonthlyUsd > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <DollarSign className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Average Commute Cost</h3>
                <p className="text-xs text-gray-600">Monthly estimate</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ${Math.round(transportationData.commuteComputeMonthlyUsd)}
              </p>
              <p className="text-xs text-gray-600">per month</p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Info className="w-4 h-4" />
          <p>
            Data from {transportationData.year}. Median commute:{' '}
            {Math.round(transportationData.medianCommuteTimeMinutes)} min.
          </p>
        </div>
      </div>
    </div>
  );
}
