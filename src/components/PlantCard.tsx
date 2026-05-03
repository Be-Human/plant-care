import React from 'react';
import type { Plant } from '../types/plant';
import { getWateringStatus, getFertilizingStatus, formatDaysRemaining } from '../utils/careUtils';

interface PlantCardProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
  onDelete: (id: string) => void;
  onWater: (id: string) => void;
  onFertilize: (id: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onEdit, onDelete, onWater, onFertilize }) => {
  const wateringStatus = getWateringStatus(plant);
  const fertilizingStatus = getFertilizingStatus(plant);

  const handleDelete = () => {
    if (window.confirm(`确定要删除 "${plant.name}" 吗？`)) {
      onDelete(plant.id);
    }
  };

  const getCareClass = (isOverdue: boolean, isUrgent: boolean): string => {
    if (isOverdue) return 'care-overdue';
    if (isUrgent) return 'care-urgent';
    return 'care-normal';
  };

  return (
    <div className="plant-card">
      <div className="plant-image">
        {plant.coverImage ? (
          <img 
            src={plant.coverImage} 
            alt={plant.name} 
            loading="lazy"
          />
        ) : (
          <div className="plant-image-placeholder">
            <span className="placeholder-icon">🌿</span>
            <span className="placeholder-text">暂无图片</span>
          </div>
        )}
      </div>
      <div className="plant-info">
        <h3 className="plant-name">{plant.name}</h3>
        <p className="plant-variety">{plant.variety}</p>
        <div className="plant-location">
          <span className="location-icon">📍</span>
          <span>{plant.location}</span>
        </div>
        
        <div className="plant-care-status">
          <div className={`care-item ${getCareClass(wateringStatus.isOverdue, wateringStatus.isUrgent)}`}>
            <span className="care-icon">💧</span>
            <span className="care-label">浇水</span>
            <span className="care-days">{formatDaysRemaining(wateringStatus.daysRemaining)}</span>
          </div>
          <div className={`care-item ${getCareClass(fertilizingStatus.isOverdue, fertilizingStatus.isUrgent)}`}>
            <span className="care-icon">🧪</span>
            <span className="care-label">施肥</span>
            <span className="care-days">{formatDaysRemaining(fertilizingStatus.daysRemaining)}</span>
          </div>
        </div>

        {plant.notes && (
          <p className="plant-notes">{plant.notes}</p>
        )}

        <div className="plant-care-actions">
          <button 
            className="btn-care btn-water" 
            onClick={() => onWater(plant.id)}
          >
            💧 浇水
          </button>
          <button 
            className="btn-care btn-fertilize" 
            onClick={() => onFertilize(plant.id)}
          >
            🧪 施肥
          </button>
        </div>

        <div className="plant-actions">
          <button 
            className="btn-edit" 
            onClick={() => onEdit(plant)}
          >
            编辑
          </button>
          <button 
            className="btn-delete" 
            onClick={handleDelete}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
