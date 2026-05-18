import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Settings2,
  Info
} from 'lucide-react';
import { Card, Button, Input, Modal } from '../../components/ui';
import { InventoryGrid } from '../../components/hotel/InventoryGrid';
import { useHotel } from '../../context/HotelContext';
import { useInventoryCalendar, useRoomTypes, useUpdateInventory } from '../../hooks/useHotelHooks';

export const InventoryCalendar: React.FC = () => {
  const { hotelId } = useHotel();
  const safeHotelId = hotelId || '';
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Generate 14 days from startDate
  const getDates = (start: string) => {
    const dates = [];
    const curr = new Date(start);
    for (let i = 0; i < 14; i++) {
      dates.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  const dates = getDates(startDate);
  const endDate = dates[dates.length - 1];

  const { data: inventoryData, isLoading: isInvLoading } = useInventoryCalendar(safeHotelId, startDate, endDate);
  const { data: roomTypes, isLoading: isRTLoading } = useRoomTypes(safeHotelId);
  const updateInventory = useUpdateInventory(safeHotelId);

  const handlePrev = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() - 14);
    setStartDate(d.toISOString().split('T')[0]);
  };

  const handleNext = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 14);
    setStartDate(d.toISOString().split('T')[0]);
  };

  const handleBulkUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      roomTypeId: parseInt(formData.get('roomTypeId') as string),
      startDate: formData.get('bulkStart') as string,
      endDate: formData.get('bulkEnd') as string,
      availableCount: parseInt(formData.get('count') as string),
    };
    updateInventory.mutate(data, {
      onSuccess: () => setIsBulkModalOpen(false)
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Inventory Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time availability management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handlePrev}>
            <ChevronLeft size={18} />
            Previous 14 Days
          </Button>
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-2 font-bold dark:text-white">
            <CalendarIcon size={18} className="text-primary" />
            {startDate}
          </div>
          <Button variant="outline" className="gap-2" onClick={handleNext}>
            Next 14 Days
            <ChevronRight size={18} />
          </Button>
          <Button className="gap-2 ml-2" onClick={() => setIsBulkModalOpen(true)}>
            <Plus size={18} />
            Bulk Update
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Good Availability</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low (&lt; 10%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sold Out</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-primary">
          <Info size={14} />
          <span className="text-xs font-bold">Grid updates instantly after selection</span>
        </div>
      </div>

      <Card className="!p-0 overflow-hidden shadow-xl">
        <InventoryGrid 
          data={inventoryData} 
          dates={dates} 
          roomTypes={roomTypes?.map((rt: any) => ({ id: rt.id, name: rt.name, totalRooms: rt.totalRooms ?? rt.total_rooms })) || []}
          isLoading={isInvLoading || isRTLoading}
        />
      </Card>

      {/* Bulk Update Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} title="Bulk Inventory Update">
        <form onSubmit={handleBulkUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Room Type</label>
            <select 
              name="roomTypeId" 
              required 
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
            >
              <option value="">Select Room Type</option>
              {roomTypes?.map((rt: any) => (
                <option key={rt.id} value={rt.id}>{rt.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" name="bulkStart" type="date" required defaultValue={startDate} />
            <Input label="End Date" name="bulkEnd" type="date" required defaultValue={endDate} />
          </div>

          <Input label="Rooms Available" name="count" type="number" placeholder="Enter count" required />

          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 text-primary text-xs font-bold border border-primary/10">
            <Settings2 size={16} />
            This will overwrite availability for the selected range.
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsBulkModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={updateInventory.isPending}>Apply Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
