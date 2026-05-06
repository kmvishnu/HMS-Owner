import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Save
} from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import { format, addDays, startOfToday } from 'date-fns';
import { useHotel } from '../../context/HotelContext';

export const Inventory: React.FC = () => {
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [startDate, setStartDate] = useState(format(startOfToday(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(startOfToday(), 7), 'yyyy-MM-dd'));
  const [availableCount, setAvailableCount] = useState<number>(0);
  const queryClient = useQueryClient();

  const { hotelId } = useHotel();

  const { data: roomTypes } = useQuery({
    queryKey: ['room-types', hotelId],
    queryFn: async () => {
      const response = await apiClient.get(`/hotel/${hotelId}/room-types`);
      return response.data.data;
    },
    enabled: !!hotelId
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiClient.patch(`/hotel/${hotelId}/inventory`, data),
    onSuccess: () => {
      toast.success('Inventory updated successfully');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      toast.error('Failed to update inventory');
    }
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomType) return toast.error('Please select a room type');
    
    updateMutation.mutate({
      roomTypeId: parseInt(selectedRoomType),
      startDate,
      endDate,
      availableCount
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Inventory Management</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Block or unblock rooms manually for specific dates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <h3 className="text-lg font-bold dark:text-white mb-6">Inventory Control</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Room Type</label>
              <select 
                className="input-field"
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                required
              >
                <option value="">Choose a room...</option>
                {roomTypes?.map((rt: any) => (
                  <option key={rt.id} value={rt.id}>{rt.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Start Date" 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                required 
              />
              <Input 
                label="End Date" 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Set Availability</label>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  className="input-field w-32" 
                  value={availableCount}
                  onChange={(e) => setAvailableCount(parseInt(e.target.value))}
                  min="0"
                />
                <span className="text-sm text-slate-500">
                  Set to 0 to block all rooms for these dates
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full gap-2" isLoading={updateMutation.isPending}>
                <Save size={18} />
                Update Inventory
              </Button>
            </div>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold dark:text-white">Current Status View</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><ChevronLeft size={16} /></Button>
              <Button variant="outline" size="sm" className="px-4">May 2026</Button>
              <Button variant="outline" size="sm"><ChevronRight size={16} /></Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-start gap-3">
              <ShieldCheck className="text-blue-500 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-bold text-blue-800 dark:text-blue-300">Operational Tip</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Blocking rooms here will prevent guests from booking online for the selected date range. This is useful for renovations or group bookings.
                </p>
              </div>
            </div>

            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-8 bg-slate-50 dark:bg-slate-900/50 p-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-1 text-left px-2">Room Type</div>
                {[...Array(7)].map((_, i) => (
                  <div key={i}>{format(addDays(startOfToday(), i), 'MMM d')}</div>
                ))}
              </div>
              
              {roomTypes?.map((rt: any) => (
                <div key={rt.id} className="grid grid-cols-8 p-2 border-t border-slate-100 dark:border-slate-800 items-center text-center">
                  <div className="col-span-1 text-left px-2 text-xs font-bold dark:text-white">{rt.name}</div>
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex justify-center">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-400">
                        10
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-6 mt-4 px-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                Available
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                Low Stock
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                Blocked/Sold Out
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
