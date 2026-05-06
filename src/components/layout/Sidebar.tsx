import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BedDouble, 
  Users, 
  Settings, 
  Package,
  ChevronLeft,
  ChevronRight,
  Hotel
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../config/permissions';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const { user, lastHotelId } = useAuthStore();
  const role = user?.role || 'HOTEL_STAFF';

  const { hotelId: urlHotelId } = useParams<{ hotelId: string }>();
  const hotelId = urlHotelId || lastHotelId;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: `/hotel/${hotelId}/dashboard`, permission: 'view_bookings', isScoped: true },
    { name: 'Bookings', icon: CalendarCheck, path: `/hotel/${hotelId}/bookings`, permission: 'view_bookings', isScoped: true },
    { name: 'Rooms', icon: BedDouble, path: `/hotel/${hotelId}/rooms`, permission: 'view_bookings', isScoped: true },
    { name: 'Inventory', icon: Package, path: `/hotel/${hotelId}/inventory`, permission: 'manage_inventory', isScoped: true },
    { name: 'Staff', icon: Users, path: '/staff', permission: 'manage_staff', isScoped: false },
    { name: 'Settings', icon: Settings, path: `/hotel/${hotelId}/settings`, permission: 'view_settings', isScoped: true },
  ].filter(item => hasPermission(role, item.permission as any) && (!item.isScoped || hotelId));

  return (
    <aside 
      className={clsx(
        "fixed inset-y-0 left-0 lg:sticky lg:top-0 h-screen glass-card !rounded-none border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-50",
        isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
      )}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-futuristic rounded-xl flex items-center justify-center text-white shadow-glow">
          <Hotel size={24} />
        </div>
        {isOpen && (
          <span className="font-bold text-xl tracking-tight bg-gradient-futuristic bg-clip-text text-transparent">
            StayFlow
          </span>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-primary text-white shadow-glow" 
                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            )}
          >
            <item.icon size={22} className={clsx("min-w-[22px]")} />
            {isOpen && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <button 
          onClick={toggle}
          className="w-full flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};
