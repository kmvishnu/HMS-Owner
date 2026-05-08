import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  UserMinus,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import { useHotel } from '../../context/HotelContext';

export const Bookings: React.FC = () => {
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'checked-in'>('today');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { hotelId } = useHotel();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', filter, hotelId],
    queryFn: async () => {
      const response = await apiClient.get(`/hotel/${hotelId}/bookings?filter=${filter}`);
      return response.data.data;
    },
    enabled: !!hotelId
  });

  const checkInMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/hotel/${hotelId}/bookings/${id}/checkin`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Guest checked in successfully');
    }
  });

  const checkOutMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/hotel/${hotelId}/bookings/${id}/checkout`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Guest checked out successfully');
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <Badge variant="info">CONFIRMED</Badge>;
      case 'CHECKED_IN': return <Badge variant="success">CHECKED-IN</Badge>;
      case 'CHECKED_OUT': return <Badge variant="neutral">CHECKED-OUT</Badge>;
      case 'CANCELLED': return <Badge variant="error">CANCELLED</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage guest reservations and operations</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['today', 'upcoming', 'checked-in'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f 
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search guest or room..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              Select Date
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} />
              More Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Room Type</th>
                <th className="px-6 py-4">Check In/Out</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div></td>
                  </tr>
                ))
              ) : bookings?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No bookings found for this filter.</td>
                </tr>
              ) : bookings?.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                        {booking.guestName.charAt(0)}
                      </div>
                      <span className="font-bold dark:text-white">{booking.guestName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 dark:text-slate-400">{booking.roomType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="dark:text-white font-medium">{booking.checkIn}</p>
                      <p className="text-slate-500 text-xs">{booking.checkOut}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 font-bold dark:text-white">
                    ₹{booking.price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {booking.status === 'CONFIRMED' && (
                        <Button 
                          size="sm" 
                          className="gap-1 bg-green-500 hover:bg-green-600"
                          onClick={() => checkInMutation.mutate(booking.id)}
                          isLoading={checkInMutation.isPending}
                        >
                          <UserCheck size={14} />
                          Check-in
                        </Button>
                      )}
                      {booking.status === 'CHECKED_IN' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-1 border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => checkOutMutation.mutate(booking.id)}
                          isLoading={checkOutMutation.isPending}
                        >
                          <UserMinus size={14} />
                          Check-out
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="p-2">
                        <MoreHorizontal size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-sm text-slate-500">Showing {bookings?.length || 0} results</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled><ChevronLeft size={16} /></Button>
            <Button variant="outline" size="sm" disabled><ChevronRight size={16} /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
