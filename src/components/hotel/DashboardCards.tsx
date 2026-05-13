import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card, Skeleton } from '../ui';

interface DashboardCardsProps {
  checkIns: number;
  checkOuts: number;
  occupancyRate: number;
  isLoading?: boolean;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ 
  checkIns, 
  checkOuts, 
  occupancyRate,
  isLoading 
}) => {
  const cards = [
    { 
      label: 'Today Check-ins', 
      value: checkIns, 
      icon: Clock, 
      color: 'text-amber-500',
      link: '/bookings?filter=today'
    },
    { 
      label: 'Today Check-outs', 
      value: checkOuts, 
      icon: CheckCircle2, 
      color: 'text-green-500',
      link: '/bookings?filter=today'
    },
    { 
      label: 'Occupancy Rate', 
      value: `${Math.round(occupancyRate)}%`, 
      icon: TrendingUp, 
      color: 'text-purple-500',
      link: '/inventory'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          onClick={() => window.location.href = card.link}
        >
          <Card className="flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
              <h3 className="text-2xl font-bold dark:text-white mt-1">{card.value}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-500 font-medium">
                <ArrowUpRight size={14} />
                <span>Operational goal met</span>
              </div>
            </div>
            <div className={`p-4 rounded-xl bg-slate-100 dark:bg-slate-800 ${card.color}`}>
              <card.icon size={24} />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
