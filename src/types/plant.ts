export interface CareLog {
  id: string;
  plantId: string;
  type: 'water' | 'fertilize';
  timestamp: string;
  notes?: string;
}

export interface Plant {
  id: string;
  name: string;
  variety: string;
  location: string;
  notes: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  wateringIntervalDays: number;
  lastWateredAt: string | null;
  fertilizingIntervalDays: number;
  lastFertilizedAt: string | null;
}
