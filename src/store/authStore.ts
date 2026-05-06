import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'HOTEL_OWNER' | 'HOTEL_STAFF';
  hotelId?: number | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  lastHotelId: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLastHotelId: (hotelId: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      lastHotelId: null,
      setAuth: (user, accessToken, refreshToken) => 
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      setTokens: (accessToken, refreshToken) => 
        set({ accessToken, refreshToken }),
      setLastHotelId: (lastHotelId) => 
        set({ lastHotelId }),
      logout: () => 
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, lastHotelId: null }),
    }),
    {
      name: 'hms-auth-storage',
    }
  )
);
