export type Permission = 
  | 'manage_rooms' 
  | 'manage_staff' 
  | 'view_bookings' 
  | 'checkin' 
  | 'checkout' 
  | 'manage_inventory'
  | 'view_settings'
  | 'manage_settings';

export const ROLES = {
  HOTEL_OWNER: 'HOTEL_OWNER',
  HOTEL_STAFF: 'HOTEL_STAFF',
} as const;

export type Role = keyof typeof ROLES;

export const rolePermissions: Record<Role, Permission[]> = {
  HOTEL_OWNER: [
    'manage_rooms',
    'manage_staff',
    'view_bookings',
    'checkin',
    'checkout',
    'manage_inventory',
    'view_settings',
    'manage_settings'
  ],
  HOTEL_STAFF: [
    'view_bookings',
    'checkin',
    'checkout',
    'manage_inventory',
    'view_settings'
  ],
};

export const hasPermission = (role: Role, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};
