import React, { createContext, useContext, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface HotelContextType {
  hotelId: string | undefined;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { setLastHotelId } = useAuthStore();
  
  useEffect(() => {
    if (hotelId) {
      setLastHotelId(hotelId);
    }
  }, [hotelId, setLastHotelId]);

  useEffect(() => {
    if (user?.role === 'HOTEL_STAFF' && !location.pathname.startsWith('/hotel/')) {
       // Only if they aren't on a valid hotel path
       if (user.hotelId) {
           navigate(`/hotel/${user.hotelId}/dashboard`, { replace: true });
       }
    }
  }, [user, hotelId, navigate, location.pathname]);

  return (
    <HotelContext.Provider value={{ hotelId }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
