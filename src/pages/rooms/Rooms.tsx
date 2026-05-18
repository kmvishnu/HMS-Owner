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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { hotelId } = useHotel();

  const { data: roomTypes, isLoading } = useQuery({
    queryKey: ['room-types', hotelId],
    queryFn: async () => {
      const response = await apiClient.get(`/hotel/${hotelId}/room-types`);
      return response.data.data;
    },
    enabled: !!hotelId
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post(`/hotel/${hotelId}/room-types`, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] });
      const newRoomId = response.data.data.id;
      
      if (selectedFile) {
        uploadImageMutation.mutate({ id: newRoomId, file: selectedFile });
      } else {
        toast.success('Room type created');
        setIsModalOpen(false);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create room type');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => apiClient.put(`/hotel/${hotelId}/room-types/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] });
      toast.success('Room type updated');
      setIsModalOpen(false);
      setEditingRoom(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update room type');
    }
  });

  const uploadImageMutation = useMutation({
    mutationFn: ({ id, file }: { id: string, file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      return apiClient.post(`/hotel/${hotelId}/room-types/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] });
      toast.success('Image uploaded');
      if (!editingRoom) {
        setIsModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/hotel/${hotelId}/room-types/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] });
      toast.success('Room type deleted');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this room type? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price') as string),
      totalRooms: parseInt(formData.get('totalRooms') as string),
    };

    if (editingRoom) {
      updateMutation.mutate({ id: editingRoom.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleImageUpload = (id: string | null, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (id) {
        uploadImageMutation.mutate({ id, file });
      } else {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const getImageUrl = (room: any) => {
    const apiBase = 'http://localhost:8081';
    const imageData = room.images?.[0];
    
    if (!imageData) {
      if (room.image_urls?.[0]) return room.image_urls[0];
      return null;
    }

    const url = typeof imageData === 'string' ? imageData : (imageData.image_url || imageData.url);
    
    if (!url) return null;
    
    if (url.startsWith('/public')) {
      return `${apiBase}${url}`;
    }
    
    return url;
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
            <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 relative overflow-hidden group">
              {getImageUrl(room) ? (
                <img src={getImageUrl(room)!} alt={room.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageIcon size={48} />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold dark:text-white">{room.name}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5"><DollarSign size={14} /> Price per night</span>
                  <span className="font-bold text-primary">₹{room.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5"><Hash size={14} /> Total Inventory</span>
                  <span className="font-bold dark:text-white">{room.totalRooms ?? room.total_rooms} Rooms</span>
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
                  onClick={() => handleDelete(room.id)}
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
              onClick={() => { 
                setIsModalOpen(false); 
                setEditingRoom(null); 
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white z-10"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold dark:text-white mb-6">
              {editingRoom ? 'Edit Room Type' : 'Add New Room Type'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Room Name" name="name" placeholder="e.g. Deluxe Suite" defaultValue={editingRoom?.name} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price (₹)" name="price" type="number" placeholder="150" defaultValue={editingRoom?.price} required />
                <Input label="Total Rooms" name="totalRooms" type="number" placeholder="10" defaultValue={editingRoom?.totalRooms ?? editingRoom?.total_rooms} required />
              </div>
              
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Room Images (Max 3)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Existing Images */}
                    {editingRoom?.images?.map((img: any) => (
                      <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 group">
                        <img src={typeof img === 'string' ? img : img.url} alt="Room" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => apiClient.delete(`/hotel/${hotelId}/room-types/images/${img.id || img}`).then(() => queryClient.invalidateQueries({ queryKey: ['room-types', hotelId] }))}
                          className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Local Preview for new room */}
                    {!editingRoom && previewUrl && (
                      <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 group">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                          className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}

                    {/* Upload Box */}
                    {((editingRoom?.images?.length || 0) + (previewUrl ? 1 : 0)) < 3 && (
                      <label className="h-24 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-primary transition-colors cursor-pointer relative">
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(editingRoom?.id || null, e)}
                        />
                        <Upload size={20} />
                        <span className="text-[10px] mt-1">Upload</span>
                      </label>
                    )}
                  </div>
                  {!editingRoom && <p className="text-[10px] text-slate-500">Image will be uploaded after creating the room type.</p>}
                </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => { 
                    setIsModalOpen(false); 
                    setEditingRoom(null); 
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={createMutation.isPending || updateMutation.isPending}>
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
