'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Home, Map, GitCompare, BookOpen, ChevronRight, MapPin, Radar } from 'lucide-react';
import { getCountries, getStatesByCountry, getDistrictsByState, getCitiesByDistrict, type Country, type State, type District, type City } from '@/lib/locations';
import { useI18n } from '@/lib/i18n/context';
import { isFeatureEnabled } from '@/lib/feature-flags';

interface SidebarItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
  loadChildren?: () => Promise<SidebarItem[]>;
  isDynamic?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Tools']);
  const [dynamicChildren, setDynamicChildren] = useState<Record<string, SidebarItem[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [nearbyCitiesExpanded, setNearbyCitiesExpanded] = useState(false);

  const [radius, setRadius] = useState<number>(
    parseInt(searchParams.get('radius') || '25')
  );
  const [unit, setUnit] = useState<'miles' | 'kilometers'>(
    (searchParams.get('unit') as 'miles' | 'kilometers') || 'miles'
  );

  const updateProximityParams = (newRadius: number, newUnit: 'miles' | 'kilometers') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('radius', newRadius.toString());
    params.set('unit', newUnit);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    updateProximityParams(newRadius, unit);
  };

  const handleUnitChange = (newUnit: 'miles' | 'kilometers') => {
    setUnit(newUnit);
    updateProximityParams(radius, newUnit);
  };

  const toggleSection = async (label: string, item?: SidebarItem) => {
    const isCurrentlyExpanded = expandedSections.includes(label);

    if (!isCurrentlyExpanded && item?.loadChildren && !dynamicChildren[label]) {
      setLoading((prev) => ({ ...prev, [label]: true }));
      try {
        const children = await item.loadChildren();
        setDynamicChildren((prev) => ({ ...prev, [label]: children }));
      } catch (error) {
        console.error(`Error loading children for ${label}:`, error);
      } finally {
        setLoading((prev) => ({ ...prev, [label]: false }));
      }
    }

    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const createLocationItems = (): SidebarItem => {
    return {
      label: t('common.locations'),
      icon: <MapPin className="w-5 h-5" />,
      isDynamic: true,
      loadChildren: async () => {
        const countries = await getCountries();
        return countries.map((country) => ({
          label: country.name,
          href: `/location/${country.slug}`,
          icon: <ChevronRight className="w-4 h-4" />,
          isDynamic: true,
          loadChildren: async () => {
            const states = await getStatesByCountry(country.slug);
            return states.map((state) => ({
              label: state.name,
              href: `/location/${country.slug}/${state.slug}`,
              icon: <ChevronRight className="w-4 h-4" />,
              isDynamic: true,
              loadChildren: async () => {
                const districts = await getDistrictsByState(state.slug);
                return districts.map((district) => ({
                  label: district.name,
                  href: `/location/${country.slug}/${state.slug}/${district.slug}`,
                  icon: <ChevronRight className="w-4 h-4" />,
                  isDynamic: true,
                  loadChildren: async () => {
                    const cities = await getCitiesByDistrict(district.slug);
                    return cities.map((city) => ({
                      label: city.name,
                      href: `/location/${country.slug}/${state.slug}/${district.slug}/${city.slug}`,
                      icon: <ChevronRight className="w-4 h-4" />,
                    }));
                  },
                }));
              },
            }));
          },
        }));
      },
    };
  };

  const buildToolsSection = (): SidebarItem | null => {
    const toolsChildren: SidebarItem[] = [];

    if (isFeatureEnabled('compare')) {
      toolsChildren.push({
        label: t('common.compare'),
        href: '/compare',
        icon: <GitCompare className="w-4 h-4" />,
      });
    }

    if (isFeatureEnabled('methodology')) {
      toolsChildren.push({
        label: t('common.methodology'),
        href: '/methodology',
        icon: <BookOpen className="w-4 h-4" />,
      });
    }

    if (toolsChildren.length === 0) return null;

    return {
      label: t('common.tools'),
      icon: <ChevronRight className="w-5 h-5" />,
      children: toolsChildren,
    };
  };

  const navigationItems: SidebarItem[] = [
    {
      label: t('common.home'),
      href: '/',
      icon: <Home className="w-5 h-5" />,
    },
    createLocationItems(),
    {
      label: t('common.mapView'),
      href: '/map',
      icon: <Map className="w-5 h-5" />,
    },
    buildToolsSection(),
  ].filter((item): item is SidebarItem => item !== null);

  const renderItem = (item: SidebarItem, level = 0) => {
    const isExpanded = expandedSections.includes(item.label);
    const children = item.isDynamic ? dynamicChildren[item.label] : item.children;
    const hasChildren = (children && children.length > 0) || item.loadChildren;
    const isLoading = loading[item.label];

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleSection(item.label, item)}
            disabled={isLoading}
            className="w-full px-4 py-3 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors rounded-lg group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500 group-hover:text-blue-600 transition-colors">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {isLoading && <span className="text-xs text-gray-400">Loading...</span>}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isExpanded && children && (
            <div className="ml-2 border-l border-gray-200 mt-1 mb-1">
              {children.map((child) => renderItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href || '#'}
        onClick={onClose}
        className={`px-4 py-3 flex items-center gap-3 rounded-lg transition-all ${
          isActive(item.href)
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-50'
        } ${level > 0 ? 'text-sm' : ''}`}
      >
        <span
          className={`${
            isActive(item.href) ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          {item.icon}
        </span>
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  const renderNearbyCitiesControl = () => {
    if (!isFeatureEnabled('proximity')) return null;

    const isLocationsExpanded = expandedSections.includes(t('common.locations'));

    if (!isLocationsExpanded) return null;

    return (
      <div className="ml-2 border-l border-gray-200 mt-1 mb-1">
        <button
          onClick={() => setNearbyCitiesExpanded(!nearbyCitiesExpanded)}
          className="w-full px-4 py-2 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors rounded-lg group"
        >
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
            <span className="text-sm font-medium">Nearby Cities</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              nearbyCitiesExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {nearbyCitiesExpanded && (
          <div className="px-4 py-3 ml-2 border-l border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {t('common.radius')}
                </label>
                <div className="flex gap-2">
                  {[10, 25, 50].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRadiusChange(r)}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                        radius === r
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {t('common.units')}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUnitChange('miles')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      unit === 'miles'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {t('common.miles')}
                  </button>
                  <button
                    onClick={() => handleUnitChange('kilometers')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      unit === 'kilometers'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {t('common.kilometers')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto transition-transform md:relative md:top-0 md:h-screen md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <div key={item.label}>
              {renderItem(item)}
              {item.label === t('common.locations') && renderNearbyCitiesControl()}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
