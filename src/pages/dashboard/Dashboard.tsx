import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, Plus, ArrowRight } from 'lucide-react';
import { Card, Button, Badge, Skeleton } from '../../components/ui';
import { DashboardCards } from '../../components/hotel/DashboardCards';
import { useHotel } from '../../context/HotelContext';
import { useHotelDashboard } from '../../hooks/useHotelHooks';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { hotelId } = useHotel();
  const safeHotelId = hotelId || '';
  const { data: dashboardData, isLoading, error } = useHotelDashboard(safeHotelId);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <DashboardCards hotelId={safeHotelId} checkIns={0} checkOuts={0} occupancyRate={0} isLoading />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full text-red-500">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-2xl font-bold dark:text-white">Failed to load dashboard</h2>
        <p className="text-slate-500">Please check your connection or try again later.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time operational insights</p>
        </div>
        <Link to={`/hotel/${safeHotelId}/rooms`}>
          <Button className="gap-2">
            <Plus size={18} />
            Manage Rooms
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
        <div className="space-y-3">
          {dashboardData.alerts.map((alert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 p-4 rounded-2xl border ${
                alert.type === 'OVERBOOKED' 
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 text-red-700 dark:text-red-400' 
                  : 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20 text-amber-700 dark:text-amber-400'
              }`}
            >
              <div className={alert.type === 'OVERBOOKED' ? 'text-red-500' : 'text-amber-500'}>
                {alert.type === 'OVERBOOKED' ? <AlertTriangle size={20} /> : <Info size={20} />}
              </div>
              <p className="text-sm font-bold tracking-tight">{alert.message}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <DashboardCards 
        hotelId={safeHotelId}
        checkIns={dashboardData?.todayCheckIns || 0} 
        checkOuts={dashboardData?.todayCheckOuts || 0} 
        occupancyRate={dashboardData?.occupancy?.occupancyRate || 0} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Operational Card */}
        <Card className="lg:col-span-2 overflow-hidden !p-0">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xl font-bold dark:text-white">Occupancy Breakdown</h3>
            <Link to={`/hotel/${safeHotelId}/inventory`}>
              <Button variant="ghost" size="sm" className="gap-2">
                Full Calendar <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="p-8 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-1">Live Occupancy</p>
                <h4 className="text-5xl font-black dark:text-white">
                  {Math.round(dashboardData?.occupancy?.occupancyRate || 0)}%
                </h4>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold dark:text-white">
                  {dashboardData?.occupancy?.bookedToday} / {dashboardData?.occupancy?.totalRooms}
                </p>
                <p className="text-xs text-slate-500">Rooms Booked Today</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${dashboardData?.occupancy?.occupancyRate || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Available</p>
                <p className="text-xl font-bold dark:text-white">
                  {(dashboardData?.occupancy?.totalRooms || 0) - (dashboardData?.occupancy?.bookedToday || 0)}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Check-ins</p>
                <p className="text-xl font-bold dark:text-white">{dashboardData?.todayCheckIns}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Check-outs</p>
                <p className="text-xl font-bold dark:text-white">{dashboardData?.todayCheckOuts}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming Arrivals Side Card */}
        <Card className="flex flex-col">
          <h3 className="text-xl font-bold dark:text-white mb-6">Upcoming Arrivals</h3>
          <div className="space-y-6 flex-1">
            {dashboardData?.upcomingBookings?.length ? (
              dashboardData.upcomingBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-sm font-black dark:text-white group-hover:text-primary transition-colors">
                      {new Date(booking.checkIn).toLocaleDateString('en-US', { day: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold dark:text-white truncate">{booking.guestName}</p>
                    <p className="text-xs text-slate-500 truncate">{booking.roomType}</p>
                  </div>
                  <Link to={`/hotel/${safeHotelId}/bookings?search=${booking.guestName}`}>
                    <Badge variant="info" className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      View
                    </Badge>
                  </Link>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Info size={24} />
                </div>
                <p className="text-sm font-medium">No upcoming arrivals</p>
              </div>
            )}
          </div>
          <Link to={`/hotel/${safeHotelId}/bookings?filter=upcoming`} className="mt-8">
            <Button variant="outline" className="w-full">See All Bookings</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
