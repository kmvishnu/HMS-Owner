import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  ParkingCircle, 
  Waves, 
  Coffee, 
  Tv, 
  Utensils,
  Save
} from 'lucide-react';
import { Button } from '../ui';
import { useUpdateFeatures } from '../../hooks/useHotelHooks';

const AVAILABLE_FEATURES = [
  { id: 'WiFi', icon: Wifi },
  { id: 'Parking', icon: ParkingCircle },
  { id: 'Pool', icon: Waves },
  { id: 'Breakfast', icon: Coffee },
  { id: 'TV', icon: Tv },
  { id: 'Restaurant', icon: Utensils },
];

interface HotelFeaturesProps {
  hotelId: string;
  initialFeatures: string[];
}

export const HotelFeatures: React.FC<HotelFeaturesProps> = ({ hotelId, initialFeatures }) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFeatures);
  const { mutate: updateFeatures, isPending } = useUpdateFeatures(hotelId);

  useEffect(() => {
    setSelectedFeatures(initialFeatures);
  }, [initialFeatures]);

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const hasChanges = JSON.stringify(selectedFeatures.sort()) !== JSON.stringify([...initialFeatures].sort());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Amenities & Features</h4>
        <Button 
          size="sm" 
          variant="primary" 
          className="gap-2"
          onClick={() => updateFeatures(selectedFeatures)}
          isLoading={isPending}
          disabled={!hasChanges}
        >
          <Save size={16} />
          Update Features
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {AVAILABLE_FEATURES.map((feature) => (
          <div 
            key={feature.id}
            onClick={() => toggleFeature(feature.id)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 text-center ${
              selectedFeatures.includes(feature.id)
                ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
                : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            <feature.icon size={24} />
            <span className="text-xs font-bold uppercase tracking-tight">{feature.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
