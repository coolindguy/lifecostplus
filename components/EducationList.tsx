'use client';

import { useEffect, useState } from 'react';
import EducationCard from './EducationCard';
import { SchoolDistrict } from '@/lib/education';

interface EducationListProps {
  cityId: string;
}

export default function EducationList({ cityId }: EducationListProps) {
  const [districts, setDistricts] = useState<SchoolDistrict[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<SchoolDistrict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    async function fetchDistricts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/education?city_id=${cityId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch education data');
        }

        const data = await response.json();
        setDistricts(data);
        setFilteredDistricts(data);
      } catch (err) {
        console.error('Error fetching education data:', err);
        setError('Failed to load education data');
      } finally {
        setLoading(false);
      }
    }

    if (cityId) {
      fetchDistricts();
    }
  }, [cityId]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredDistricts(districts);
    } else {
      setFilteredDistricts(districts.filter((d) => d.type === filter));
    }
  }, [filter, districts]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (districts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-600">
        <p>No school district data available for this location yet.</p>
      </div>
    );
  }

  const publicCount = districts.filter((d) => d.type === 'public').length;
  const privateCount = districts.filter((d) => d.type === 'private').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({districts.length})
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'public'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Public ({publicCount})
          </button>
          <button
            onClick={() => setFilter('private')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'private'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Private ({privateCount})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredDistricts.map((district) => (
          <EducationCard
            key={district.id}
            id={district.id}
            name={district.name}
            type={district.type}
            totalSchools={district.total_schools}
            totalStudents={district.total_students}
            studentTeacherRatio={district.student_teacher_ratio}
            graduationRate={district.graduation_rate}
            collegeReadiness={district.college_readiness}
            testScoresAvg={district.test_scores_avg}
            rating={district.rating}
            fundingPerStudent={district.funding_per_student}
            specialPrograms={district.special_programs}
          />
        ))}
      </div>
    </div>
  );
}
