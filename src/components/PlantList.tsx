import React from 'react';
import type { Plant } from '../types/plant';
import type { CareAction } from '../App';
import PlantCard from './PlantCard';

interface PlantListProps {
  plants: Plant[];
  onEdit: (plant: Plant) => void;
  onDelete: (id: string) => void;
  onWater: (id: string) => void;
  onFertilize: (id: string) => void;
  lastCareAction: CareAction | null;
}

const PlantList: React.FC<PlantListProps> = ({ 
  plants, 
  onEdit, 
  onDelete, 
  onWater, 
  onFertilize,
  lastCareAction 
}) => {
  if (plants.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🌱</div>
        <h3>还没有植物</h3>
        <p>点击上方按钮添加你的第一株植物吧！</p>
      </div>
    );
  }

  return (
    <div className="plant-list">
      {plants.map(plant => (
        <PlantCard 
          key={plant.id} 
          plant={plant} 
          onEdit={onEdit} 
          onDelete={onDelete}
          onWater={onWater}
          onFertilize={onFertilize}
          lastCareAction={lastCareAction}
        />
      ))}
    </div>
  );
};

export default PlantList;
