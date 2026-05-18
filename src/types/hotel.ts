export interface DashboardStats {
  todayCheckIns: number;
  todayCheckOuts: number;
  occupancy: {
    totalRooms: number;
    bookedToday: number;
    occupancyRate: number;
  };
  upcomingBookings: UpcomingBooking[];
  alerts: DashboardAlert[];
}

export interface UpcomingBooking {
  id: string;
  guestName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
}

export interface DashboardAlert {
  type: 'LOW_AVAILABILITY' | 'OVERBOOKED';
  message: string;
}

export interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  totalAmount: number;
  notes: string | null;
}

export interface InventoryDateStatus {
  date: string;
  roomTypeId: number;
  availableCount: number;
}

export interface InventoryCalendarData {
  [roomTypeId: string]: {
    [date: string]: number;
  };
}

export interface AnalyticsData {
  occupancyRate: number;
  bookingsPerDay: {
    date: string;
    count: number;
  }[];
}

export interface ProfileCompletion {
  completionPercentage: number;
  missingFields: string[];
}

export interface HotelInfo {
  id: number;
  name: string;
  location: string;
  contactEmail: string;
  address: string;
  isVisible: boolean;
  features: string[];
  images: string[];
}

export interface RoomType {
  id: number;
  name: string;
  price: number;
  totalRooms: number;
  images: string[];
}

export interface HotelSettings {
  hotel: HotelInfo;
  roomTypes: RoomType[];
}
