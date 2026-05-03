import type { Plant } from '../types/plant';

export interface CareStatus {
  nextDate: string;
  daysRemaining: number;
  isOverdue: boolean;
  isUrgent: boolean;
}

const isValidDate = (date: Date): boolean => {
  return !isNaN(date.getTime());
};

export const calculateDaysRemaining = (
  lastDate: string | null | undefined,
  intervalDays: number
): CareStatus => {
  if (!lastDate || !intervalDays || intervalDays <= 0) {
    return {
      nextDate: '',
      daysRemaining: 0,
      isOverdue: false,
      isUrgent: false,
    };
  }

  const last = new Date(lastDate);
  if (!isValidDate(last)) {
    return {
      nextDate: '',
      daysRemaining: 0,
      isOverdue: false,
      isUrgent: false,
    };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);

  const next = new Date(last);
  next.setDate(last.getDate() + intervalDays);

  const daysRemaining = Math.ceil(
    (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    nextDate: next.toISOString().split('T')[0],
    daysRemaining,
    isOverdue: daysRemaining < 0,
    isUrgent: daysRemaining <= 2 && daysRemaining >= 0,
  };
};

export const getWateringStatus = (plant: Plant): CareStatus => {
  return calculateDaysRemaining(plant.lastWateredAt, plant.wateringIntervalDays);
};

export const getFertilizingStatus = (plant: Plant): CareStatus => {
  return calculateDaysRemaining(plant.lastFertilizedAt, plant.fertilizingIntervalDays);
};

export const formatDaysRemaining = (days: number): string => {
  if (days < 0) {
    return `已过期 ${Math.abs(days)} 天`;
  }
  if (days === 0) {
    return '今天';
  }
  if (days === 1) {
    return '明天';
  }
  return `${days} 天后`;
};
