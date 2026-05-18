import React, { useState } from 'react';
import type { RoomType } from '../../types/hotel';
import { Card, Button } from '../ui';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useUploadRoomTypeImage } from '../../hooks/useHotelHooks';

interface RoomTypeImagesProps {
  hotelId: string;
  roomTypes: RoomType[];
}

export const RoomTypeImages: React.FC<RoomTypeImagesProps> = ({ hotelId, roomTypes }) => {
  const { mutate: uploadImage, isPending } = useUploadRoomTypeImage(hotelId);
  const [previews, setPreviews] = useState<{ [key: number]: string | null }>({});

  const handleFileChange = (roomTypeId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > 1024 * 1024) {
      alert('File size must be less than 1MB');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPEG, PNG and SVG are allowed');
      return;
    }

    // Set preview
    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [roomTypeId]: previewUrl }));

    // Auto upload for simplicity, or we could add a "Confirm" button
    uploadImage({ roomTypeId, file }, {
      onSettled: () => {
        setPreviews(prev => ({ ...prev, [roomTypeId]: null }));
        URL.revokeObjectURL(previewUrl);
      }
    });
  };

  return (
    <div className="space-y-8">
      {roomTypes.map(rt => (
        <Card key={rt.id} className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-lg font-bold dark:text-white">{rt.name}</h4>
              <p className="text-sm text-slate-500">₹{rt.price} • {rt.totalRooms} Rooms</p>
            </div>
            
            <label className="relative">
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/svg+xml"
                onChange={(e) => handleFileChange(rt.id, e)}
                disabled={isPending}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 pointer-events-none"
                isLoading={isPending && previews[rt.id] !== null}
              >
                <Upload size={16} />
                Upload Image
              </Button>
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {rt.images.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800">
                <img src={img} alt={`${rt.name} ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            
            {previews[rt.id] && (
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary border-dashed relative">
                <img src={previews[rt.id]!} alt="Preview" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                </div>
              </div>
            )}

            {rt.images.length === 0 && !previews[rt.id] && (
              <div className="aspect-square rounded-lg border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400">
                <ImageIcon size={24} />
                <span className="text-[10px] mt-1">No images</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
