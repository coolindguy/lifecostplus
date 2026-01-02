export interface FeatureFlags {
  weather: boolean;
  news: boolean;
  education: boolean;
  forums: boolean;
  safety: boolean;
  environment: boolean;
  transportation: boolean;
  taxes: boolean;
  proximity: boolean;
  compare: boolean;
  methodology: boolean;
}

export const FEATURES: FeatureFlags = {
  weather: false,
  news: false,
  education: false,
  forums: false,
  safety: false,
  environment: false,
  transportation: false,
  taxes: false,
  proximity: false,
  compare: false,
  methodology: false,
};

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return FEATURES[feature] === true;
}

export function getEnabledFeatures(): (keyof FeatureFlags)[] {
  return (Object.keys(FEATURES) as (keyof FeatureFlags)[]).filter(
    (key) => FEATURES[key]
  );
}
