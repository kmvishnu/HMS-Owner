import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import apiClient from '../../api/client';


export const HotelList: React.FC = () => {
  const navigate = useNavigate();

  const { data: hotels, isLoading } = useQuery({
    queryKey: ['owner-hotels'],
    queryFn: async () => {
      const response = await apiClient.get('/owner/hotels');
      return response.data.data || response.data; // Accommodate generic wrapping
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="animate-pulse h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="animate-pulse h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto min-h-screen bg-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white">Your Properties</h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">Select a hotel to manage its operations</p>
        </div>
        <Button className="gap-2 shrink-0 w-full sm:w-auto" variant="outline" onClick={() => navigate('/staff')}>
          <Building size={18} />
          Manage Global Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hotels?.map((hotel: any) => (
          <Card 
            key={hotel.id} 
            className="hover:scale-[1.02] transition-transform cursor-pointer group flex flex-col h-full !p-0 overflow-hidden border-2 border-transparent hover:border-primary/50"
            onClick={() => navigate(`/hotel/${hotel.id}/dashboard`)}
          >
            <div className="h-32 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
              {hotel.image_urls?.[0] ? (
                <img src={hotel.image_urls[0]} alt={hotel.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Building size={32} className="opacity-50" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3 flex gap-2">
                {!hotel.is_visible && (
                  <Badge variant="warning" className="shadow-lg backdrop-blur-md bg-amber-500/90 text-white">Hidden</Badge>
                )}
                {hotel.is_visible && (
                  <Badge variant="success" className="shadow-lg backdrop-blur-md bg-green-500/90 text-white">Live</Badge>
                )}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold dark:text-white group-hover:text-primary transition-colors line-clamp-1">{hotel.name}</h3>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mt-2">
                <MapPin size={14} className="shrink-0" />
                <span className="line-clamp-1">{hotel.location || 'Location not specified'}</span>
              </div>
              
              <div className="mt-auto pt-6">
                <Button className="w-full" variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/hotel/${hotel.id}/dashboard`);
                }}>Manage Operations</Button>
              </div>
            </div>
          </Card>
        ))}
        
        {(!hotels || hotels.length === 0) && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Building size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-bold dark:text-white">No Properties Found</h3>
            <p className="text-slate-500 mt-2">You haven't been assigned any hotels yet. Please contact the administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
};
