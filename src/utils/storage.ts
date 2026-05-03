import type { Plant } from '../types/plant';

const STORAGE_KEY = 'plant-care-plants';

export const getPlants = (): Plant[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePlants = (plants: Plant[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
};

export const getPlantById = (id: string): Plant | undefined => {
  const plants = getPlants();
  return plants.find(plant => plant.id === id);
};

export const addPlant = (plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>): Plant => {
  const plants = getPlants();
  const now = new Date().toISOString();
  
  const newPlant: Plant = {
    ...plant,
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
    createdAt: now,
    updatedAt: now,
  };
  
  plants.push(newPlant);
  savePlants(plants);
  
  return newPlant;
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
  
  return true;
};
