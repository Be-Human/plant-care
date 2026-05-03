import type { Plant, CareLog } from '../types/plant';

const PLANTS_STORAGE_KEY = 'plant-care-plants';
const CARE_LOGS_STORAGE_KEY = 'plant-care-care-logs';

const migratePlant = (plant: Partial<Plant>): Plant => {
  const now = new Date().toISOString();
  return {
    id: plant.id || '',
    name: plant.name || '',
    variety: plant.variety || '',
    location: plant.location || '',
    notes: plant.notes || '',
    coverImage: plant.coverImage || '',
    createdAt: plant.createdAt || now,
    updatedAt: plant.updatedAt || now,
    wateringIntervalDays: plant.wateringIntervalDays || 7,
    lastWateredAt: plant.lastWateredAt || plant.createdAt || now,
    fertilizingIntervalDays: plant.fertilizingIntervalDays || 30,
    lastFertilizedAt: plant.lastFertilizedAt || plant.createdAt || now,
  };
};

export const getPlants = (): Plant[] => {
  const stored = localStorage.getItem(PLANTS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const plants = JSON.parse(stored) as Partial<Plant>[];
    return plants.map(migratePlant);
  } catch (error) {
    console.error('Failed to parse plants from storage:', error);
    return [];
  }
};

export const savePlants = (plants: Plant[]): void => {
  localStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(plants));
};

export const getCareLogs = (): CareLog[] => {
  const stored = localStorage.getItem(CARE_LOGS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored) as CareLog[];
  } catch (error) {
    console.error('Failed to parse care logs from storage:', error);
    return [];
  }
};

export const saveCareLogs = (logs: CareLog[]): void => {
  localStorage.setItem(CARE_LOGS_STORAGE_KEY, JSON.stringify(logs));
};

export const getCareLogsByPlantId = (plantId: string): CareLog[] => {
  const logs = getCareLogs();
  return logs
    .filter(log => log.plantId === plantId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const addCareLog = (plantId: string, type: 'water' | 'fertilize', notes?: string): CareLog => {
  const logs = getCareLogs();
  const now = new Date().toISOString();
  
  const newLog: CareLog = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
    plantId,
    type,
    timestamp: now,
    notes,
  };
  
  logs.unshift(newLog);
  saveCareLogs(logs);
  
  return newLog;
};

export const getPlantById = (id: string): Plant | undefined => {
  const plants = getPlants();
  return plants.find(plant => plant.id === id);
};

export interface PlantFormData {
  name: string;
  variety: string;
  location: string;
  notes: string;
  coverImage: string;
  wateringIntervalDays: number;
  fertilizingIntervalDays: number;
}

export const addPlant = (plant: PlantFormData): Plant => {
  const plants = getPlants();
  const now = new Date().toISOString();
  
  const newPlant: Plant = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
    name: plant.name,
    variety: plant.variety,
    location: plant.location,
    notes: plant.notes,
    coverImage: plant.coverImage,
    createdAt: now,
    updatedAt: now,
    wateringIntervalDays: plant.wateringIntervalDays || 7,
    lastWateredAt: now,
    fertilizingIntervalDays: plant.fertilizingIntervalDays || 30,
    lastFertilizedAt: now,
  };
  
  plants.push(newPlant);
  savePlants(plants);
  
  return newPlant;
};

export const recordWatering = (id: string, notes?: string): Plant | null => {
  const plants = getPlants();
  const plantIndex = plants.findIndex(plant => plant.id === id);
  
  if (plantIndex === -1) return null;
  
  const now = new Date().toISOString();
  const updatedPlant: Plant = {
    ...plants[plantIndex],
    lastWateredAt: now,
    updatedAt: now,
  };
  
  plants[plantIndex] = updatedPlant;
  savePlants(plants);
  
  addCareLog(id, 'water', notes);
  
  return updatedPlant;
};

export const recordFertilizing = (id: string, notes?: string): Plant | null => {
  const plants = getPlants();
  const plantIndex = plants.findIndex(plant => plant.id === id);
  
  if (plantIndex === -1) return null;
  
  const now = new Date().toISOString();
  const updatedPlant: Plant = {
    ...plants[plantIndex],
    lastFertilizedAt: now,
    updatedAt: now,
  };
  
  plants[plantIndex] = updatedPlant;
  savePlants(plants);
  
  addCareLog(id, 'fertilize', notes);
  
  return updatedPlant;
};

export const updatePlant = (id: string, updatedFields: Partial<Omit<Plant, 'id' | 'createdAt'>>): Plant | null => {
  const plants = getPlants();
  const plantIndex = plants.findIndex(plant => plant.id === id);
  
  if (plantIndex === -1) return null;
  
  const updatedPlant: Plant = {
    ...plants[plantIndex],
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  };
  
  plants[plantIndex] = updatedPlant;
  savePlants(plants);
  
  return updatedPlant;
};

export const deletePlant = (id: string): boolean => {
  const plants = getPlants();
  const plantIndex = plants.findIndex(plant => plant.id === id);
  
  if (plantIndex === -1) return false;
  
  plants.splice(plantIndex, 1);
  savePlants(plants);
  
  const logs = getCareLogs();
  const filteredLogs = logs.filter(log => log.plantId !== id);
  saveCareLogs(filteredLogs);
  
  return true;
};
