import React from 'react';
import { Card } from '../ui';
import { ImageIcon } from 'lucide-react';

interface HotelImagesProps {
  images: string[];
}

export const HotelImages: React.FC<HotelImagesProps> = ({ images }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
        <ImageIcon size={20} />
        <h3 className="font-bold">Hotel Gallery</h3>
      </div>
      
      {images.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent">
          <ImageIcon size={48} className="text-slate-300 mb-2" />
          <p className="text-slate-500 text-sm">No images available for this hotel</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:ring-2 hover:ring-primary/50 transition-all"
            >
              <img 
                src={img} 
                alt={`Hotel gallery ${idx + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
