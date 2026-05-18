import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelApi } from '../api/hotel';
import toast from 'react-hot-toast';

export const useHotelDashboard = (hotelId: string) => {
  return useQuery({
    queryKey: ['hotel-dashboard', hotelId],
    queryFn: () => hotelApi.getDashboard(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useHotelBookings = (hotelId: string, params: any) => {
  return useQuery({
    queryKey: ['hotel-bookings', hotelId, params],
    queryFn: () => hotelApi.getBookings(hotelId, params),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateBookingNotes = (hotelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, notes }: { bookingId: string; notes: string }) => 
      hotelApi.updateBookingNotes(hotelId, bookingId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings', hotelId] });
      toast.success('Notes updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update notes');
    }
  });
};

export const useCheckIn = (hotelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => hotelApi.checkIn(hotelId, bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings', hotelId] });
      queryClient.invalidateQueries({ queryKey: ['hotel-dashboard', hotelId] });
      toast.success('Guest checked in successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to check in guest');
    }
  });
};

export const useCheckOut = (hotelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => hotelApi.checkOut(hotelId, bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings', hotelId] });
      queryClient.invalidateQueries({ queryKey: ['hotel-dashboard', hotelId] });
      toast.success('Guest checked out successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to check out guest');
    }
  });
};

export const useInventoryCalendar = (hotelId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['inventory-calendar', hotelId, startDate, endDate],
    queryFn: () => hotelApi.getInventoryCalendar(hotelId, startDate, endDate),
    enabled: !!hotelId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateInventory = (hotelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { roomTypeId: number; startDate: string; endDate: string; availableCount: number }) => 
      hotelApi.updateInventory(hotelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-calendar', hotelId] });
      queryClient.invalidateQueries({ queryKey: ['hotel-dashboard', hotelId] });
      toast.success('Inventory updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update inventory');
    }
  });
};

export const useHotelAnalytics = (hotelId: string) => {
  return useQuery({
    queryKey: ['hotel-analytics', hotelId],
    queryFn: () => hotelApi.getAnalytics(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProfileCompletion = (hotelId: string) => {
  return useQuery({
    queryKey: ['profile-completion', hotelId],
    queryFn: () => hotelApi.getProfileCompletion(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRoomTypes = (hotelId: string) => {
  return useQuery({
    queryKey: ['room-types', hotelId],
    queryFn: () => hotelApi.getRoomTypes(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useHotelSettings = (hotelId: string) => {
  return useQuery({
    queryKey: ['hotel-settings', hotelId],
    queryFn: () => hotelApi.getSettings(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateHotel = (hotelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { contactEmail: string; address: string }) => hotelApi.updateHotel(hotelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-settings', hotelId] });
      toast.success('Hotel profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update hotel profile');
    }
  });
};

export const useUpdateFeatures = (hotelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (features: string[]) => hotelApi.updateFeatures(hotelId, features),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-settings', hotelId] });
      toast.success('Hotel features updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update features');
    }
  });
};

export const useUploadRoomTypeImage = (hotelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomTypeId, file }: { roomTypeId: number; file: File }) => 
      hotelApi.uploadRoomTypeImage(hotelId, roomTypeId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-settings', hotelId] });
      toast.success('Image uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    }
  });
};
