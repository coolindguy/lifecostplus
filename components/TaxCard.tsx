'use client';

import {
  DollarSign,
  Home,
  ShoppingCart,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Info,
  Calculator,
  Percent,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';
import {
  type CityTaxData,
  type StateTaxData,
  getTaxBurdenRating,
  getSalesTaxRating,
  getPropertyTaxRating,
  getIncomeTaxRating,
  formatCurrency,
  formatTaxRate,
} from '@/lib/taxes';

interface TaxCardProps {
  cityTaxData?: CityTaxData;
  stateTaxData?: StateTaxData;
  showStateTaxes?: boolean;
}

export default function TaxCard({
  cityTaxData,
  stateTaxData,
  showStateTaxes = false,
}: TaxCardProps) {
  const { t } = useI18n();

  if (!cityTaxData && !stateTaxData) {
    return null;
  }

  const displayData = cityTaxData || stateTaxData;
  const taxBurdenPercent = cityTaxData
    ? cityTaxData.effectiveTotalTaxBurdenPercent
    : stateTaxData?.effectiveTaxBurdenPercent || 0;
  const taxBurdenRating = getTaxBurdenRating(taxBurdenPercent);

  const salesTaxPercent = cityTaxData
    ? cityTaxData.combinedSalesTaxPercent
    : stateTaxData?.avgCombinedSalesTaxPercent || 0;
  const salesTaxRating = getSalesTaxRating(salesTaxPercent);

  const propertyTaxPercent = cityTaxData
    ? cityTaxData.avgEffectivePropertyTaxPercent
    : stateTaxData?.propertyTaxEffectiveRatePercent || 0;
  const propertyTaxRating = getPropertyTaxRating(propertyTaxPercent);

  const incomeTaxPercent = cityTaxData
    ? cityTaxData.localIncomeTaxPercent
    : stateTaxData
    ? (stateTaxData.incomeTaxMinPercent + stateTaxData.incomeTaxMaxPercent) / 2
    : 0;
  const hasIncomeTax = cityTaxData
    ? cityTaxData.hasLocalIncomeTax
    : stateTaxData?.hasIncomeTax || false;
  const incomeTaxRating = getIncomeTaxRating(incomeTaxPercent, hasIncomeTax);

  const taxCategories = [
    {
      name: 'Sales Tax',
      value: salesTaxPercent,
      rating: salesTaxRating.rating,
      color: salesTaxRating.color,
      icon: ShoppingCart,
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Property Tax',
      value: propertyTaxPercent,
      rating: propertyTaxRating.rating,
      color: propertyTaxRating.color,
      icon: Home,
      bgColor: 'bg-green-50',
    },
    {
      name: hasIncomeTax ? 'Income Tax' : 'No Income Tax',
      value: incomeTaxPercent,
      rating: incomeTaxRating.rating,
      color: incomeTaxRating.color,
      icon: Briefcase,
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tax Information</h2>
        <DollarSign className="w-6 h-6 text-gray-400" />
      </div>

      <div className={`mb-6 p-4 rounded-xl border-2 ${taxBurdenRating.color}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Overall Tax Burden</h3>
            <p className="text-3xl font-bold">{taxBurdenRating.rating}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-gray-600" />
              <p className="text-2xl font-bold">{taxBurdenPercent.toFixed(1)}%</p>
            </div>
            <p className="text-xs text-gray-500">of income</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">{taxBurdenRating.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Tax Breakdown</h3>
        <div className="grid grid-cols-1 gap-3">
          {taxCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className={`p-4 rounded-xl border border-gray-200 ${category.bgColor}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">{category.name}</h4>
                      <p className={`text-xs font-medium ${category.color}`}>{category.rating}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatTaxRate(category.value)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {stateTaxData && showStateTaxes && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">State-Level Taxes</h3>
          <div className="space-y-3">
            {stateTaxData.hasIncomeTax && (
              <div className="p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">State Income Tax</p>
                  <p className="text-sm text-gray-600">{stateTaxData.incomeTaxBrackets} brackets</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">Tax range</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatTaxRate(stateTaxData.incomeTaxMinPercent)} -{' '}
                    {formatTaxRate(stateTaxData.incomeTaxMaxPercent)}
                  </p>
                </div>
              </div>
            )}

            {stateTaxData.gasTaxPerGallonUsd > 0 && (
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Gas Tax</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(stateTaxData.gasTaxPerGallonUsd)}/gal
                  </p>
                </div>
              </div>
            )}

            {stateTaxData.corporateTaxPercent > 0 && (
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Corporate Tax</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatTaxRate(stateTaxData.corporateTaxPercent)}
                  </p>
                </div>
              </div>
            )}

            {stateTaxData.hasEstateTax && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Estate Tax</p>
                    <p className="text-xs text-gray-600">Exemption threshold</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(stateTaxData.estateTaxExemptionUsd)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {cityTaxData && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Local Taxes</h3>
          <div className="grid grid-cols-2 gap-3">
            {cityTaxData.hotelTaxPercent > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Hotel Tax</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatTaxRate(cityTaxData.hotelTaxPercent)}
                </p>
              </div>
            )}

            {cityTaxData.restaurantTaxPercent > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Restaurant Tax</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatTaxRate(cityTaxData.restaurantTaxPercent)}
                </p>
              </div>
            )}

            {cityTaxData.utilityTaxPercent > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Utility Tax</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatTaxRate(cityTaxData.utilityTaxPercent)}
                </p>
              </div>
            )}

            {cityTaxData.parkingTaxPercent > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Parking Tax</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatTaxRate(cityTaxData.parkingTaxPercent)}
                </p>
              </div>
            )}

            {cityTaxData.businessTaxType !== 'none' && cityTaxData.businessTaxRatePercent > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                <p className="text-xs text-gray-600 mb-1">
                  Business Tax ({cityTaxData.businessTaxType})
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatTaxRate(cityTaxData.businessTaxRatePercent)}
                </p>
              </div>
            )}

            {cityTaxData.vehicleRegistrationAnnualAvgUsd > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                <p className="text-xs text-gray-600 mb-1">Avg. Vehicle Registration</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(cityTaxData.vehicleRegistrationAnnualAvgUsd)}/year
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {(cityTaxData?.medianPropertyTaxAnnualUsd || stateTaxData?.medianPropertyTaxAnnualUsd) && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Median Property Tax</h3>
                <p className="text-xs text-gray-600">Annual payment</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  cityTaxData?.medianPropertyTaxAnnualUsd ||
                    stateTaxData?.medianPropertyTaxAnnualUsd ||
                    0
                )}
              </p>
              <p className="text-xs text-gray-600">per year</p>
            </div>
          </div>
        </div>
      )}

      {stateTaxData && stateTaxData.taxBurdenRank > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">State Tax Burden Ranking</h3>
              <p className="text-xs text-gray-600">Among all states</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">#{stateTaxData.taxBurdenRank}</p>
              <p className="text-xs text-gray-600">out of 50</p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Info className="w-4 h-4" />
          <p>
            Tax data from{' '}
            {cityTaxData?.year || stateTaxData?.year || new Date().getFullYear()}. Rates may vary
            based on income level and property value.
          </p>
        </div>
      </div>
    </div>
  );
}
