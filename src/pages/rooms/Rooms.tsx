import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  DollarSign, 
  Hash,
  X,
  Upload
} from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { useHotel } from '../../context/HotelContext';

export const Rooms: React.FC = () => {
  const { user } = useAuthStore();
  const isOwner = user?.role === 'HOTEL_OWNER';
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  const { hotelId } = useHotel();

  const { data: roomTypes, isLoading } = useQuery({
    queryKey: ['room-types', hotelId],
    queryFn: async () => {
      const response = await apiClient.get(`/hotel/${hotelId}/room-types`);
      return response.data.data;
    },
    enabled: !!hotelId
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/hotel/${hotelId}/room-types/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-types'] });
      toast.success('Room type deleted');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, call API
    toast.success(editingRoom ? 'Room updated' : 'Room created');
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Room Types</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your hotel inventory and pricing</p>
        </div>
        {isOwner && (
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Add Room Type
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomTypes?.map((room: any) => (
          <Card key={room.id} className="group relative overflow-hidden flex flex-col">
            <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
              <ImageIcon size={48} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold dark:text-white">{room.name}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5"><DollarSign size={14} /> Price per night</span>
                  <span className="font-bold text-primary">${room.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5"><Hash size={14} /> Total Inventory</span>
                  <span className="font-bold dark:text-white">{room.totalRooms} Rooms</span>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="mt-6 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-1.5"
                  onClick={() => {
                    setEditingRoom(room);
                    setIsModalOpen(true);
                  }}
                >
                  <Edit2 size={14} />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-1.5 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/30"
                  onClick={() => deleteMutation.mutate(room.id)}
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Modal - Simplistic implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => { setIsModalOpen(false); setEditingRoom(null); }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold dark:text-white mb-6">
              {editingRoom ? 'Edit Room Type' : 'Add New Room Type'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Room Name" placeholder="e.g. Deluxe Suite" defaultValue={editingRoom?.name} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price ($)" type="number" placeholder="150" defaultValue={editingRoom?.price} required />
                <Input label="Total Rooms" type="number" placeholder="10" defaultValue={editingRoom?.totalRooms} required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Room Images (Max 3)</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-24 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-primary transition-colors cursor-pointer">
                    <Upload size={20} />
                    <span className="text-[10px] mt-1">Upload</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => { setIsModalOpen(false); setEditingRoom(null); }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingRoom ? 'Save Changes' : 'Create Room'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
