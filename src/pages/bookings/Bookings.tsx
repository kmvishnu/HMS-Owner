import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock
} from 'lucide-react';
import { Card, Button, Badge, Skeleton } from '../../components/ui';
import { BookingDetailsModal } from '../../components/hotel/BookingDetailsModal';
import { useHotel } from '../../context/HotelContext';
import { useHotelBookings } from '../../hooks/useHotelHooks';

export const Bookings: React.FC = () => {
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'checked-in' | 'completed'>('today');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hotelId } = useHotel();
  const safeHotelId = hotelId || '';

  const { data, isLoading } = useHotelBookings(safeHotelId, { filter });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <Badge variant="info">CONFIRMED</Badge>;
      case 'CHECKED_IN': return <Badge variant="success">CHECKED-IN</Badge>;
      case 'CHECKED_OUT': return <Badge variant="neutral">CHECKED-OUT</Badge>;
      case 'CANCELLED': return <Badge variant="error">CANCELLED</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const nights = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24);
    const n = Math.max(1, Math.round(nights));
    return `${n} Night${n > 1 ? 's' : ''}`;
  };

  const handleRowClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Advanced guest & reservation management</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['today', 'upcoming', 'checked-in', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
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

      <Card className="!p-0 overflow-hidden shadow-xl border-slate-100 dark:border-slate-800">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search guest or room..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              Date Range
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} />
              Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Room Type</th>
                <th className="px-6 py-4">Stay Details</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td colSpan={8} className="px-6 py-4"><Skeleton className="h-12 w-full" /></td>
                  </tr>
                ))
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <Filter size={32} />
                      </div>
                      <p className="font-bold dark:text-white">No bookings found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : data?.data?.map((booking: any) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  onClick={() => handleRowClick(booking)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-colors">
                        {booking.userName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold dark:text-white truncate">{booking.userName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{booking.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{booking.roomType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[11px] font-bold">
                      <p className="dark:text-white">{booking.checkIn}</p>
                      <p className="text-slate-400">{booking.checkOut}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <Clock size={12} />
                      {calculateNights(booking.checkIn, booking.checkOut)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-slate-400">
                      <MessageSquare size={14} className={booking.notes ? 'text-primary' : ''} />
                      <span className="text-xs truncate max-w-[100px]">
                        {booking.notes || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black dark:text-white">
                    ₹{booking.totalAmount}
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="p-2" onClick={() => handleRowClick(booking)}>
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
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {data?.data?.length || 0} Reservations found
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled><ChevronLeft size={16} /></Button>
            <Button variant="outline" size="sm" disabled><ChevronRight size={16} /></Button>
          </div>
        </div>
      </Card>

      <BookingDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        booking={selectedBooking} 
        hotelId={safeHotelId}
      />
    </div>
  );
};
