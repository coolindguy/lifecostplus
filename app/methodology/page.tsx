import Link from 'next/link';
import { BookOpen, Database, Calculator } from 'lucide-react';

export default function Methodology() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              LifeCost+
            </Link>
            <div className="flex gap-6">
              <Link href="/map" className="text-gray-700 hover:text-blue-600 font-medium">
                Map View
              </Link>
              <Link href="/compare" className="text-gray-700 hover:text-blue-600 font-medium">
                Compare
              </Link>
              <Link href="/methodology" className="text-blue-600 hover:text-blue-700 font-medium">
                Methodology
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Methodology</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Scoring Formulas</h2>

          <div className="space-y-8">
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Affordability Score</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                  (Annual Income ÷ Annual Cost) × 100
                </span>
              </p>
              <p className="text-gray-600">
                Measures how much purchasing power you retain after essential expenses. Higher scores
                mean better affordability. A score above 80 indicates strong affordability.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Commute Score</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                  100 ÷ (Average Commute Time in minutes)
                </span>
              </p>
              <p className="text-gray-600">
                Inverse of commute time ensures shorter commutes receive higher scores. A 25-minute
                average commute receives a score of 80, while 50 minutes yields 50.
              </p>
            </div>

            <div className="border-l-4 border-red-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Safety Score</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                  100 - (Crime Rate × Weighting Factor)
                </span>
              </p>
              <p className="text-gray-600">
                Based on crime rates per capita. Lower crime rates result in higher safety scores.
                Normalized to a 0-100 scale for consistency.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lifestyle Score</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                  (Amenities Count × Population Density Factor)
                </span>
              </p>
              <p className="text-gray-600">
                Combines cultural amenities, recreational facilities, and entertainment options
                weighted by city size. Reflects cultural richness and quality of life.
              </p>
            </div>

            <div className="border-l-4 border-yellow-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Jobs Score</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                  Job Growth Rate × Industry Diversity Index
                </span>
              </p>
              <p className="text-gray-600">
                Measures employment opportunities and economic stability. Considers job market growth
                and industry diversity within each metropolitan area.
              </p>
            </div>

            <div className="border-l-4 border-orange-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Overall Score</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                  Average of all five component scores
                </span>
              </p>
              <p className="text-gray-600">
                Synthesizes all factors into a single livability score. Provides a holistic view of
                each city's suitability as a place to live.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Data Sources
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 pb-4 border-b border-gray-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">U.S. Census Bureau</h3>
                <p className="text-gray-600">Population data, median income, household income</p>
              </div>
            </div>

            <div className="flex gap-4 pb-4 border-b border-gray-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-green-500 text-white">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Bureau of Labor Statistics (BLS)</h3>
                <p className="text-gray-600">Employment data, job market trends, cost of living</p>
              </div>
            </div>

            <div className="flex gap-4 pb-4 border-b border-gray-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-red-500 text-white">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">FBI Uniform Crime Reporting</h3>
                <p className="text-gray-600">Crime statistics, safety metrics</p>
              </div>
            </div>

            <div className="flex gap-4 pb-4 border-b border-gray-200">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-yellow-500 text-white">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">U.S. Department of Transportation</h3>
                <p className="text-gray-600">Commute times, transit infrastructure data</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-500 text-white">
                  5
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">OpenStreetMap & Local Data</h3>
                <p className="text-gray-600">Amenities, points of interest, lifestyle indicators</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Important Disclaimer
          </h2>
          <p className="text-gray-800 leading-relaxed">
            The data and scores on LifeCost+ are aggregated from publicly available sources and are
            provided for informational purposes only. They represent general trends and may not
            reflect current, real-time conditions. Individual experiences vary significantly based
            on personal circumstances, career, and lifestyle preferences.
          </p>
          <p className="text-gray-800 leading-relaxed mt-4">
            Scores and metrics should be used as starting points for research, not as definitive
            decision-makers. We recommend visiting cities in person and consulting local resources
            before making relocation decisions. LifeCost+ is not responsible for decisions made based
            on this information.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Calculator className="w-6 h-6 text-blue-600" />
            How We Calculate Monthly Cost
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 font-semibold mb-2">Monthly Cost = Rent + Food + Transportation + Utilities</p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Rent:</strong> Average monthly rent for a 1-bedroom apartment in the city
                  center
                </p>
                <p>
                  <strong>Food:</strong> Estimated groceries and dining (~$400/month for a single
                  person)
                </p>
                <p>
                  <strong>Transportation:</strong> Public transit, car ownership costs (~$200/month)
                </p>
                <p>
                  <strong>Utilities:</strong> Electric, water, internet (~$150/month average)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 LifeCost+. All rights reserved.</p>
          <p className="text-gray-500 mt-2">
            Data is aggregated and indicative only. Always verify current information before making
            important decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
