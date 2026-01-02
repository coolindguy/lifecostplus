import citiesData from '@/data/cities.json';

export interface City {
  name: string;
  state: string;
  slug: string;
  lat: number;
  lng: number;
  medianIncome: number;
  monthlyCost: number;
  avgRent: number;
  commuteTime: number;
  crimeRate: number;
  amenitiesScore: number;
  scores: {
    affordability: number;
    jobs: number;
    commute: number;
    safety: number;
    lifestyle: number;
    overall: number;
  };
}

export function getCities(): City[] {
  return citiesData as City[];
}

export function getCityBySlug(slug: string): City | undefined {
  return getCities().find((city) => city.slug === slug);
}

export function filterCities(
  income: number,
  maxRent: number,
  maxCommute?: number,
  minSafety?: number
): City[] {
  return getCities().filter((city) => {
    const rentToIncome = (city.avgRent * 12) / income;
    const rentOk = city.avgRent <= maxRent;
    const commuteOk = maxCommute ? city.commuteTime <= maxCommute : true;
    const safetyOk = minSafety ? city.scores.safety >= minSafety : true;
    const affordableOk = rentToIncome <= 0.3;

    return rentOk && commuteOk && safetyOk && affordableOk;
  });
}

export function sortCitiesByPriority(
  cities: City[],
  priorities: string[]
): City[] {
  return [...cities].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    priorities.forEach((priority) => {
      switch (priority) {
        case 'affordability':
          scoreA += a.scores.affordability;
          scoreB += b.scores.affordability;
          break;
        case 'commute':
          scoreA += a.scores.commute;
          scoreB += b.scores.commute;
          break;
        case 'safety':
          scoreA += a.scores.safety;
          scoreB += b.scores.safety;
          break;
        case 'lifestyle':
          scoreA += a.scores.lifestyle;
          scoreB += b.scores.lifestyle;
          break;
        case 'education':
          scoreA += (a.scores.lifestyle + a.scores.safety) / 2;
          scoreB += (b.scores.lifestyle + b.scores.safety) / 2;
          break;
      }
    });

    return scoreB - scoreA;
  });
}
