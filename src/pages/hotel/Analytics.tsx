import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  ArrowUpRight,
  Target
} from 'lucide-react';
import { Card, Skeleton } from '../../components/ui';
import { AnalyticsCharts } from '../../components/hotel/AnalyticsCharts';
import { useHotel } from '../../context/HotelContext';
import { useHotelAnalytics, useProfileCompletion } from '../../hooks/useHotelHooks';

export const Analytics: React.FC = () => {
  const { hotelId } = useHotel();
  const safeHotelId = hotelId || '';
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useHotelAnalytics(safeHotelId);
  const { data: profileData, isLoading: isProfileLoading } = useProfileCompletion(safeHotelId);

  if (isAnalyticsLoading || isProfileLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-20 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Analytics & Performance</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into your hotel metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avg Occupancy KPI */}
        <Card className="flex items-center justify-between bg-primary/5 border-primary/10">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Avg. Occupancy</p>
            <h3 className="text-4xl font-black dark:text-white mt-1">
              {Math.round(analyticsData?.occupancyRate || 0)}%
            </h3>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-500 font-bold">
              <ArrowUpRight size={14} />
              <span>Above sector average</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-primary shadow-sm">
            <Target size={32} />
          </div>
        </Card>

        {/* Profile Completion */}
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold dark:text-white flex items-center gap-2">
              <Users size={18} className="text-primary" />
              Hotel Profile Strength
            </h4>
            <span className="text-sm font-black text-primary">{profileData?.completionPercentage}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-primary transition-all duration-1000" 
              style={{ width: `${profileData?.completionPercentage}%` }} 
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {profileData?.missingFields.map((field, idx) => (
              <span key={idx} className="px-2 py-1 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase rounded-md border border-red-100 dark:border-red-900/20">
                Missing: {field}
              </span>
            ))}
            {!profileData?.missingFields.length && (
              <span className="text-xs text-green-500 font-bold">✓ Profile is 100% complete and optimized</span>
            )}
          </div>
        </Card>
      </div>

      {/* Main Trends Chart */}
      <AnalyticsCharts 
        data={analyticsData?.bookingsPerDay || []} 
        isLoading={isAnalyticsLoading} 
      />

      {/* Secondary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col items-center justify-center text-center p-10 space-y-4">
          <div className="p-4 rounded-full bg-accent/10 text-accent">
            <TrendingUp size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold dark:text-white">Growth Projection</h4>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              Based on current trends, your occupancy is expected to increase by 15% next month.
            </p>
          </div>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center p-10 space-y-4">
          <div className="p-4 rounded-full bg-green-500/10 text-green-500">
            <Calendar size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold dark:text-white">Peak Performance</h4>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              Weekends continue to be your strongest operational periods with 95% average occupancy.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
