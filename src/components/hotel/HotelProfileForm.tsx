import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button } from '../ui';
import { useUpdateHotel } from '../../hooks/useHotelHooks';

const profileSchema = z.object({
  contactEmail: z.string().email('Invalid email format').trim(),
  address: z.string().min(1, 'Address is required').max(500, 'Address too long').trim(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface HotelProfileFormProps {
  hotelId: string;
  initialData: {
    name: string;
    location: string;
    contactEmail: string;
    address: string;
  };
}

export const HotelProfileForm: React.FC<HotelProfileFormProps> = ({ hotelId, initialData }) => {
  const { mutate: updateHotel, isPending } = useUpdateHotel(hotelId);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      contactEmail: initialData.contactEmail,
      address: initialData.address,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateHotel(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Hotel Name"
          value={initialData.name}
          disabled
          className="bg-slate-50 dark:bg-slate-800/50"
        />
        <Input
          label="Location"
          value={initialData.location}
          disabled
          className="bg-slate-50 dark:bg-slate-800/50"
        />
      </div>

      <Input
        label="Contact Email"
        {...register('contactEmail')}
        error={errors.contactEmail?.message}
        placeholder="contact@hotel.com"
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
        <textarea
          {...register('address')}
          className={`input-field min-h-[100px] py-2 ${errors.address ? 'border-red-500 focus:ring-red-500/20' : ''}`}
          placeholder="Enter full hotel address"
        />
        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};
