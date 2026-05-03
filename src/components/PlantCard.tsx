import React from 'react';
import type { Plant } from '../types/plant';

interface PlantCardProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
  onDelete: (id: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`确定要删除 "${plant.name}" 吗？`)) {
      onDelete(plant.id);
    }
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
        {plant.notes && (
          <p className="plant-notes">{plant.notes}</p>
        )}
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
