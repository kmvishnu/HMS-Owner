import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Mail,
  Shield,
  X,
  Search
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

export const Staff: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const { data: staffList, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const response = await apiClient.get('/staff');
      return response.data.data;
    }
  });

  const { data: hotels } = useQuery({
    queryKey: ['owner-hotels'],
    queryFn: async () => {
      const response = await apiClient.get('/owner/hotels');
      return response.data.data || response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/staff/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member removed');
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/staff', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member added successfully');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add staff member');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.put(`/staff/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member updated successfully');
      setIsModalOpen(false);
      setEditingStaff(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update staff member');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      hotelId: parseInt(formData.get('hotelId') as string),
      ...(editingStaff ? {} : { password: formData.get('password') })
    };

    if (editingStaff) {
      updateMutation.mutate({ id: editingStaff.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Staff Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your team and their access</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Staff Member
        </Button>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search staff..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {staffList?.map((staff: any) => (
                <tr key={staff.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {staff.name.charAt(0)}
                      </div>
                      <span className="font-bold dark:text-white">{staff.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      {staff.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Shield size={14} className="text-blue-500" />
                      {staff.role.replace('HOTEL_', '')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="success">{staff.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="p-2"
                        onClick={() => { setEditingStaff(staff); setIsModalOpen(true); }}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="p-2 text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => deleteMutation.mutate(staff.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => { setIsModalOpen(false); setEditingStaff(null); }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold dark:text-white mb-6">
              {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" name="name" placeholder="John Doe" defaultValue={editingStaff?.name} required />
              <Input label="Email Address" name="email" type="email" placeholder="john@hotel.com" defaultValue={editingStaff?.email} required />
              {!editingStaff && (
                <Input label="Password" name="password" type="password" placeholder="••••••••" required />
              )}
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                <select name="role" className="input-field appearance-none bg-no-repeat bg-right pr-10" defaultValue={editingStaff?.role || "HOTEL_STAFF"}>
                  <option value="HOTEL_STAFF">Hotel Staff</option>
                  <option value="HOTEL_OWNER">Hotel Owner</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assign to Hotel</label>
                <select name="hotelId" className="input-field appearance-none bg-no-repeat bg-right pr-10" required defaultValue={editingStaff?.hotelId || ""}>
                  <option value="" disabled>Select a hotel...</option>
                  {hotels?.map((hotel: any) => (
                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => { setIsModalOpen(false); setEditingStaff(null); }}
                >
                  Cancel
                </Button>
                 <Button type="submit" className="flex-1" isLoading={createMutation.isPending || updateMutation.isPending}>
                  {editingStaff ? 'Save Changes' : 'Add Staff'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
