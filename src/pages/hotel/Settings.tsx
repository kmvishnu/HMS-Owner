import React from 'react';
import { useParams } from 'react-router-dom';
import { useHotelSettings } from '../../hooks/useHotelHooks';
import { Card, Skeleton } from '../../components/ui';
import { HotelProfileForm } from '../../components/hotel/HotelProfileForm';
import { HotelImages } from '../../components/hotel/HotelImages';
import { HotelFeatures } from '../../components/hotel/HotelFeatures';
import { RoomTypeImages } from '../../components/hotel/RoomTypeImages';
import { Settings as SettingsIcon, Building, Palette, BedDouble } from 'lucide-react';

export const Settings: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { data: settings, isLoading, error } = useHotelSettings(hotelId || '');

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Card className="p-8"><Skeleton className="h-64 w-full" /></Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <SettingsIcon size={48} className="mb-4 opacity-20" />
        <h2 className="text-xl font-bold">Failed to load settings</h2>
        <p>Please check your connection and try again.</p>
      </div>
    );
  }

  const { hotel, roomTypes } = settings;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm">
            <SettingsIcon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Hotel Configuration</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your property details, branding, and inventory</p>
          </div>
        </div>
      </div>

      {/* Hotel Info Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
          <Building size={20} className="text-primary" />
          <h2 className="text-xl font-bold uppercase tracking-tight">Property Profile</h2>
        </div>
        <Card className="p-8 bg-white dark:bg-slate-900 shadow-sm border-slate-100 dark:border-slate-800">
          <HotelProfileForm 
            hotelId={hotelId || ''} 
            initialData={{
              name: hotel.name,
              location: hotel.location,
              contactEmail: hotel.contactEmail,
              address: hotel.address
            }} 
          />
        </Card>
      </section>

      {/* Visual Identity Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
          <Palette size={20} className="text-primary" />
          <h2 className="text-xl font-bold uppercase tracking-tight">Branding & Gallery</h2>
        </div>
        <Card className="p-8">
          <HotelImages images={hotel.images || []} />
          
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <HotelFeatures hotelId={hotelId || ''} initialFeatures={hotel.features || []} />
          </div>
        </Card>
      </section>

      {/* Room Inventory Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
          <BedDouble size={20} className="text-primary" />
          <h2 className="text-xl font-bold uppercase tracking-tight">Room Inventory Media</h2>
        </div>
        <RoomTypeImages hotelId={hotelId || ''} roomTypes={roomTypes} />
      </section>
    </div>
  );
};
