import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  Building, 
  Wifi, 
  ParkingCircle, 
  Waves, 
  Coffee, 
  Tv, 
  Utensils,
  Save,
  Eye,
  EyeOff,
  Image as ImageIcon,
  X,
  Upload
} from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import { useHotel } from '../../context/HotelContext';

export const Settings: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['WiFi', 'Parking', 'Pool']);
  const { hotelId } = useHotel();

  const features = [
    { id: 'WiFi', icon: Wifi },
    { id: 'Parking', icon: ParkingCircle },
    { id: 'Pool', icon: Waves },
    { id: 'Breakfast', icon: Coffee },
    { id: 'TV', icon: Tv },
    { id: 'Restaurant', icon: Utensils },
  ];

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const updateVisibility = useMutation({
    mutationFn: (isVisible: boolean) => apiClient.put(`/hotel/${hotelId}/visibility`, { isVisible }),
    onSuccess: () => {
      setIsVisible(!isVisible);
      toast.success(`Hotel is now ${!isVisible ? 'visible' : 'hidden'} to guests`);
    }
  });

  const updateFeatures = useMutation({
    mutationFn: (features: string[]) => apiClient.put(`/hotel/${hotelId}/features`, { features }),
    onSuccess: () => {
      toast.success('Hotel features updated');
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Hotel Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Configure your hotel profile and visibility</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Information */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Building className="text-primary" size={24} />
              <h3 className="text-xl font-bold dark:text-white">General Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Hotel Name" defaultValue="Grand Royal Hotel" />
                <Input label="Contact Email" defaultValue="contact@grandroyal.com" />
              </div>
              <Input label="Address" defaultValue="123 Luxury Ave, Beverly Hills, CA" />
              <div className="pt-2">
                <Button className="gap-2">
                  <Save size={18} />
                  Save General Info
                </Button>
              </div>
            </div>
          </Card>

          {/* Features & Amenities */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Wifi className="text-primary" size={24} />
                <h3 className="text-xl font-bold dark:text-white">Amenities & Features</h3>
              </div>
              <Button size="sm" onClick={() => updateFeatures.mutate(selectedFeatures)} isLoading={updateFeatures.isPending}>
                Update Amenities
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 text-center ${
                    selectedFeatures.includes(feature.id)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-100 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <feature.icon size={24} />
                  <span className="text-sm font-medium">{feature.id}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Hotel Images */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="text-primary" size={24} />
              <h3 className="text-xl font-bold dark:text-white">Hotel Images</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <ImageIcon size={32} />
                  </div>
                  <button className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                <Upload size={24} />
                <span className="text-xs mt-2 font-medium">Add Image</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
          {/* Visibility Toggle */}
          <Card className="!bg-slate-900 text-white border-none shadow-xl shadow-primary/10">
            <h3 className="text-lg font-bold mb-4">Hotel Visibility</h3>
            <p className="text-slate-400 text-sm mb-6">
              Toggle your hotel visibility on the guest-facing application. When off, guests cannot find or book your hotel.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                {isVisible ? <Eye className="text-green-500" /> : <EyeOff className="text-red-500" />}
                <span className="font-bold">{isVisible ? 'Visible' : 'Hidden'}</span>
              </div>
              <button 
                onClick={() => updateVisibility.mutate(!isVisible)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isVisible ? 'bg-primary' : 'bg-slate-600'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isVisible ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Bookings</span>
                <span className="font-bold dark:text-white">1,284</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Average Rating</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold dark:text-white">4.8</span>
                  <span className="text-amber-500 text-xs">★★★★★</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
