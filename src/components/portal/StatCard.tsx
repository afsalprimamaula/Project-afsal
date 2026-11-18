'use client';

import { formatRupiah } from '@/lib/utils/currency';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label?: string;
  title?: string;
  value: number | string;
  tag: string;
  tagColor?: 'green' | 'amber' | 'blue' | 'slate' | 'red' | 'purple';
  icon: React.ReactNode;
  iconBg?: string;
  isLoading?: boolean;
  isCurrency?: boolean;
  trend?: number; // percentage change, optional
}

const TAG_STYLES: Record<string, string> = {
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  slate: 'bg-slate-100 text-slate-600',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
};

export function StatCard({
  label,
  title,
  value,
  tag,
  tagColor = 'slate',
  icon,
  iconBg = 'bg-green-100',
  isLoading = false,
  isCurrency,
  trend,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200" />
          <div className="w-20 h-5 rounded-full bg-slate-200" />
        </div>
        <div className="w-32 h-7 rounded-lg bg-slate-200 mb-2" />
        <div className="w-24 h-4 rounded bg-slate-100" />
      </div>
    );
  }

  const textLabel = label || title || '';
  const shouldFormatCurrency = isCurrency === true || (isCurrency === undefined && typeof value === 'number');
  const displayValue = shouldFormatCurrency && typeof value === 'number' ? formatRupiah(value) : value;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            TAG_STYLES[tagColor] || TAG_STYLES.slate
          }`}
        >
          {tag}
        </span>
      </div>
      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1 leading-tight">
        {displayValue}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500 font-medium">{textLabel}</div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-[11px] font-semibold ${
              trend >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}

// Loading skeleton row
export function StatCardRow({ count = 4, isLoading }: { count?: number; isLoading?: boolean }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCard key={i} label="" value={0} tag="" icon={null} isLoading={isLoading} />
      ))}
    </div>
  );
}

export default StatCard;
