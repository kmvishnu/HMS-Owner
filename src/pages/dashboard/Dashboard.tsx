import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BedDouble, 
  CalendarCheck, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Ban
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import apiClient from '../../api/client';
import { useHotel } from '../../context/HotelContext';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { hotelId } = useHotel();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', hotelId],
    queryFn: async () => {
      const response = await apiClient.get(`/hotel/${hotelId}/dashboard`);
      return response.data.data;
    },
    enabled: !!hotelId
  });

  const stats = [
    { label: 'Total Rooms', value: dashboardData?.occupancy?.totalRooms || 0, icon: BedDouble, color: 'text-blue-500' },
    { label: 'Booked Today', value: dashboardData?.occupancy?.bookedToday || 0, icon: CalendarCheck, color: 'text-green-500' },
    { label: 'Occupancy Rate', value: `${Math.round(((dashboardData?.occupancy?.bookedToday || 0) / (dashboardData?.occupancy?.totalRooms || 1)) * 100)}%`, icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Check-ins Due', value: 4, icon: Clock, color: 'text-amber-500' },
  ];

  if (isLoading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
    </div>
    <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
  </div>;

  // If the owner has multiple hotels and hasn't selected one
  if (dashboardData?.ownedHotels && !dashboardData?.occupancy) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Your Hotels</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Select a hotel to manage</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.ownedHotels.map((hotel: any) => (
            <Card key={hotel.id} className="hover:scale-[1.02] transition-transform cursor-pointer group">
              <div className="aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden relative">
                {hotel.image_urls?.[0] ? (
                  <img src={hotel.image_urls[0]} alt={hotel.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Plus size={48} />
                  </div>
                )}
                {!hotel.is_visible && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="warning">Hidden</Badge>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold dark:text-white group-hover:text-primary transition-colors">{hotel.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{hotel.location}</p>
              <Button className="w-full mt-6">Manage Hotel</Button>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance and operations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Plus size={18} />
            Quick Action
          </Button>
          <Button className="gap-2">
            <CheckCircle2 size={18} />
            Check-in Guest
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <h3 className="text-2xl font-bold dark:text-white mt-1">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-500 font-medium">
                  <ArrowUpRight size={14} />
                  <span>+12% from yesterday</span>
                </div>
              </div>
              <div className={`p-4 rounded-xl bg-slate-100 dark:bg-slate-800 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Bookings */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold dark:text-white">Today's Bookings</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {dashboardData?.todayBookings?.map((booking: any) => (
              <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {booking.guest.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold dark:text-white">{booking.guest}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{booking.room} • Arrived at {booking.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={booking.status === 'CHECKED_IN' ? 'success' : 'info'}>
                    {booking.status}
                  </Badge>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            ))}
            {!dashboardData?.todayBookings?.length && (
              <div className="py-8 text-center text-slate-500">No bookings for today.</div>
            )}
          </div>
        </Card>

        {/* Quick Actions & Upcoming */}
        <div className="space-y-8">
          <Card className="!bg-primary/5 border-primary/20">
            <h3 className="text-lg font-bold dark:text-white mb-4">Quick Operations</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex-col gap-2 h-24 dark:bg-slate-900/50">
                <Plus size={20} />
                <span>Add Room</span>
              </Button>
              <Button variant="outline" className="flex-col gap-2 h-24 dark:bg-slate-900/50">
                <Ban size={20} />
                <span>Block Rooms</span>
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold dark:text-white mb-4">Upcoming Arrivals</h3>
            <div className="space-y-4">
              {dashboardData?.upcomingBookings?.map((booking: any) => (
                <div key={booking.id} className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-accent rounded-full" />
                  <div>
                    <p className="text-sm font-bold dark:text-white">{booking.guest}</p>
                    <p className="text-xs text-slate-500">{booking.date} • {booking.room}</p>
                  </div>
                </div>
              ))}
              {!dashboardData?.upcomingBookings?.length && (
                <div className="py-4 text-center text-slate-500 text-sm">No upcoming arrivals.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
