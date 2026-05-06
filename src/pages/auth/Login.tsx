import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hotel, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button, Input, Card } from '../../components/ui';
import toast from 'react-hot-toast';
import apiClient from '../../api/client';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data.data;
      
      setAuth(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'HOTEL_OWNER') {
        navigate('/owner/hotels');
      } else {
        if (user.hotelId) {
          navigate(`/hotel/${user.hotelId}/dashboard`);
        } else {
          toast.error("No assigned hotel found for this account.");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-futuristic rounded-2xl items-center justify-center text-white shadow-glow mb-4">
            <Hotel size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">StayFlow</h1>
          <p className="text-slate-400 mt-2">Manage your hotel with ease</p>
        </div>

        <Card className="!bg-slate-900/50 backdrop-blur-xl border-slate-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-[38px] text-slate-500" size={18} />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@hotel.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-[38px] text-slate-500" size={18} />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary/20" />
                Remember me
              </label>
              <a href="#" className="text-primary hover:text-primary-light font-medium transition-colors">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full py-6 text-lg" isLoading={isLoading}>
              Sign In
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Protected by enterprise-grade security. 
          <br />
          &copy; 2026 StayFlow Systems.
        </p>
      </motion.div>
    </div>
  );
};
