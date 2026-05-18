import React from 'react';
import type { InventoryCalendarData } from '../../types/hotel';
import { Skeleton } from '../ui';

interface InventoryGridProps {
  data: InventoryCalendarData | undefined;
  dates: string[];
  roomTypes: { id: string; name: string; totalRooms: number }[];
  isLoading?: boolean;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({
  data,
  dates,
  roomTypes,
  isLoading
}) => {
  const getColorClass = (count: number, total: number) => {
    if (count === 0) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    if (count < total * 0.1) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString('en-US', { day: '2-digit' }),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-20 bg-slate-50 dark:bg-slate-900 p-4 border-b border-r border-slate-200 dark:border-slate-800 min-w-[200px] text-left">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Room Type</span>
            </th>
            {dates.map(date => {
              const formatted = formatDate(date);
              return (
                <th key={date} className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 min-w-[80px]">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-medium text-slate-400 uppercase">{formatted.weekday}</span>
                    <span className="text-lg font-bold dark:text-white">{formatted.day}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {roomTypes.map(rt => (
            <tr key={rt.id}>
              <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 p-4 border-r border-b border-slate-100 dark:border-slate-800 font-bold dark:text-white">
                {rt.name}
                <p className="text-[10px] text-slate-400 font-normal uppercase mt-1">Total: {rt.totalRooms} Rooms</p>
              </td>
              {dates.map(date => {
                const count = data?.[rt.id]?.[date] ?? rt.totalRooms;
                return (
                  <td key={date} className="p-2 border-b border-slate-100 dark:border-slate-800 text-center">
                    <div className={`
                      h-12 w-full flex items-center justify-center rounded-xl border text-sm font-bold transition-all
                      ${getColorClass(count, rt.totalRooms)}
                    `}>
                      {count}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
