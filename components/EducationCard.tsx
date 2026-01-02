'use client';

import { GraduationCap, Users, TrendingUp, Award, Building, Star, DollarSign } from 'lucide-react';

interface EducationCardProps {
  id: string;
  name: string;
  type: 'public' | 'private';
  totalSchools: number;
  totalStudents: number;
  studentTeacherRatio: number;
  graduationRate: number;
  collegeReadiness: number;
  testScoresAvg: number;
  rating: number;
  fundingPerStudent: number;
  specialPrograms?: string[];
}

export default function EducationCard({
  name,
  type,
  totalSchools,
  totalStudents,
  studentTeacherRatio,
  graduationRate,
  collegeReadiness,
  testScoresAvg,
  rating,
  fundingPerStudent,
  specialPrograms = [],
}: EducationCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600 bg-green-50';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  type === 'public'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}
              >
                {type === 'public' ? 'Public' : 'Private'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {totalSchools} {totalSchools === 1 ? 'School' : 'Schools'}
              </span>
              <span className="text-gray-300">•</span>
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{totalStudents.toLocaleString()} Students</span>
            </div>
          </div>
          <div className={`px-3 py-2 rounded-lg font-bold text-lg ${getRatingColor(rating)}`}>
            {rating.toFixed(1)}
            <span className="text-xs font-normal ml-1">/10</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">Graduation Rate</span>
            </div>
            <p className={`text-xl font-bold ${getPerformanceColor(graduationRate)}`}>
              {graduationRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">College Readiness</span>
            </div>
            <p className={`text-xl font-bold ${getPerformanceColor(collegeReadiness)}`}>
              {collegeReadiness.toFixed(1)}%
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">Test Scores</span>
            </div>
            <p className={`text-xl font-bold ${getPerformanceColor(testScoresAvg)}`}>
              {testScoresAvg.toFixed(1)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">Student:Teacher</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{studentTeacherRatio.toFixed(1)}:1</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Funding: <span className="font-semibold text-gray-900">${fundingPerStudent.toLocaleString()}</span> per student
            </span>
          </div>

          {specialPrograms.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">Special Programs</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {specialPrograms.slice(0, 4).map((program, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {program}
                  </span>
                ))}
                {specialPrograms.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    +{specialPrograms.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
