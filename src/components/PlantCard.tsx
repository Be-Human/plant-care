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
        <img 
          src={plant.coverImage || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20green%20plant%20in%20a%20white%20ceramic%20pot%20on%20a%20wooden%20table%2C%20natural%20lighting%2C%20minimalist%20style&image_size=square'} 
          alt={plant.name} 
          loading="lazy"
        />
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
