import React, { useState, useEffect } from 'react';
import type { Booking } from '../../types/hotel';
import { Modal, Button, Badge } from '../ui';
import { Calendar, CreditCard, MessageSquare, Clock } from 'lucide-react';
import { useUpdateBookingNotes } from '../../hooks/useHotelHooks';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  hotelId: string;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  hotelId
}) => {
  const [notes, setNotes] = useState(booking?.notes || '');
  const updateNotes = useUpdateBookingNotes(hotelId);

  useEffect(() => {
    if (booking) setNotes(booking.notes || '');
  }, [booking]);

  if (!booking) return null;

  const calculateNights = (checkIn: string, checkOut: string) => {
    const nights = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(nights));
  };

  const nights = calculateNights(booking.checkIn, booking.checkOut);

  const handleSaveNotes = () => {
    updateNotes.mutate({ bookingId: booking.id, notes });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details" className="max-w-2xl">
      <div className="space-y-8">
        {/* Guest Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {booking.userName.charAt(0)}
            </div>
            <div>
              <h4 className="text-xl font-bold dark:text-white">{booking.userName}</h4>
              <p className="text-slate-500 text-sm">{booking.userEmail}</p>
            </div>
          </div>
          <Badge variant={
            booking.status === 'CHECKED_IN' ? 'success' : 
            booking.status === 'CONFIRMED' ? 'info' : 
            booking.status === 'CHECKED_OUT' ? 'neutral' : 'error'
          }>
            {booking.status}
          </Badge>
        </div>

        {/* Stay Details */}
        <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-500">
              <Calendar size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">Stay Period</span>
            </div>
            <div>
              <p className="font-bold dark:text-white text-lg">{booking.checkIn} — {booking.checkOut}</p>
              <p className="text-primary text-sm font-bold flex items-center gap-1 mt-1">
                <Clock size={14} />
                {nights} Night{nights > 1 ? 's' : ''} Stay
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-500">
              <CreditCard size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">Payment</span>
            </div>
            <div>
              <p className="font-bold dark:text-white text-lg">₹{booking.totalAmount}</p>
              <p className="text-slate-400 text-sm mt-1">Inclusive of all taxes</p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <MessageSquare size={18} />
            <span className="font-bold">Operational Notes</span>
          </div>
          <textarea
            className="w-full h-32 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white text-sm"
            placeholder="Add special requests or internal notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 500))}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">{notes.length}/500 characters</p>
            <Button 
              size="sm" 
              onClick={handleSaveNotes}
              isLoading={updateNotes.isPending}
              disabled={notes === (booking.notes || '')}
            >
              Save Notes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
