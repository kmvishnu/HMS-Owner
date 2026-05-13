import apiClient from './client';
import type { 
  DashboardStats, 
  Booking, 
  InventoryCalendarData, 
  AnalyticsData, 
  ProfileCompletion,
  InventoryDateStatus
} from '../types/hotel';

export const hotelApi = {
  getDashboard: async (hotelId: string): Promise<DashboardStats> => {
    const response = await apiClient.get(`/hotel/${hotelId}/dashboard`);
    return response.data.data; // Assuming backend already uses camelCase or is mapped here
  },

  getBookings: async (hotelId: string, params: any): Promise<{ data: Booking[]; pagination: any }> => {
    const response = await apiClient.get(`/hotel/${hotelId}/bookings`, { params });
    const { data, pagination } = response.data;
    
    // Map snake_case to camelCase
    const mappedData = data.map((b: any) => ({
      id: b.id,
      userName: b.user_name,
      userEmail: b.user_email,
      roomType: b.room_type_name,
      checkIn: b.check_in,
      checkOut: b.check_out,
      status: b.status,
      totalAmount: b.total_amount,
      notes: b.notes
    }));

    return { data: mappedData, pagination };
  },

  updateBookingNotes: async (hotelId: string, bookingId: string, notes: string): Promise<void> => {
    await apiClient.patch(`/hotel/${hotelId}/bookings/${bookingId}/notes`, { notes: notes.trim() });
  },

  getInventoryCalendar: async (hotelId: string, startDate: string, endDate: string): Promise<InventoryCalendarData> => {
    const response = await apiClient.get(`/hotel/${hotelId}/inventory/calendar`, {
      params: { startDate, endDate }
    });
    
    const flatData: InventoryDateStatus[] = response.data.data || response.data;
    
    // Transform flat array into { roomTypeId: { date: count } }
    const grouped: InventoryCalendarData = {};
    flatData.forEach(item => {
      if (!grouped[item.roomTypeId]) {
        grouped[item.roomTypeId] = {};
      }
      grouped[item.roomTypeId][item.date] = item.availableCount;
    });

    return grouped;
  },

  updateInventory: async (hotelId: string, data: { roomTypeId: number; startDate: string; endDate: string; availableCount: number }): Promise<void> => {
    await apiClient.patch(`/hotel/${hotelId}/inventory`, data);
  },

  getAnalytics: async (hotelId: string): Promise<AnalyticsData> => {
    const response = await apiClient.get(`/hotel/${hotelId}/analytics`);
    return response.data.data;
  },

  getRoomTypes: async (hotelId: string): Promise<any[]> => {
    const response = await apiClient.get(`/hotel/${hotelId}/room-types`);
    return response.data.data;
  },

  getProfileCompletion: async (hotelId: string): Promise<ProfileCompletion> => {
    const response = await apiClient.get(`/hotel/${hotelId}/profile-completion`);
    return response.data.data;
  },

  updateFeatures: async (hotelId: string, features: string[]): Promise<void> => {
    await apiClient.put(`/hotel/${hotelId}/features`, { features });
  },

  getSettings: async (hotelId: string): Promise<any> => {
    const response = await apiClient.get(`/hotel/${hotelId}/settings`);
    return response.data.data;
  },

  updateHotel: async (hotelId: string, data: { contactEmail: string; address: string }): Promise<void> => {
    await apiClient.put(`/hotel/${hotelId}`, data);
  },

  uploadRoomTypeImage: async (hotelId: string, roomTypeId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('image', file);
    await apiClient.post(`/hotel/${hotelId}/room-types/${roomTypeId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
