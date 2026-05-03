import React, { useState, useEffect } from 'react';
import type { Plant } from '../types/plant';

interface PlantFormProps {
  plant?: Plant;
  onSave: (plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const PlantForm: React.FC<PlantFormProps> = ({ plant, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    location: '',
    notes: '',
    coverImage: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (plant) {
      setFormData({
        name: plant.name,
        variety: plant.variety,
        location: plant.location,
        notes: plant.notes,
        coverImage: plant.coverImage,
      });
      if (plant.coverImage) {
        setImagePreview(plant.coverImage);
      }
    }
  }, [plant]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '植物名称不能为空';
    }
    
    if (!formData.variety.trim()) {
      newErrors.variety = '植物品种不能为空';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = '摆放位置不能为空';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, coverImage: value }));
    setImagePreview(value || null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, coverImage: result }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const isEditMode = !!plant;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditMode ? '编辑植物' : '添加植物'}</h2>
          <button 
            className="modal-close" 
            onClick={onCancel}
            aria-label="关闭"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="plant-form">
          <div className="form-group">
            <label htmlFor="name">植物名称 <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="例如：绿萝"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="variety">植物品种 <span className="required">*</span></label>
            <input
              type="text"
              id="variety"
              name="variety"
              value={formData.variety}
              onChange={handleInputChange}
              placeholder="例如：心叶绿萝"
              className={errors.variety ? 'error' : ''}
            />
            {errors.variety && <span className="error-message">{errors.variety}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="location">摆放位置 <span className="required">*</span></label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="例如：客厅窗台"
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="coverImage">封面图</label>
            <div className="image-upload-section">
              <input
                type="text"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleImageUrlChange}
                placeholder="输入图片URL或上传图片"
              />
              <div className="file-upload">
                <label htmlFor="fileUpload" className="btn-upload">
                  上传图片
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="预览" />
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">备注</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="添加一些关于这株植物的备注..."
              rows={4}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              取消
            </button>
            <button type="submit" className="btn-save">
              {isEditMode ? '保存修改' : '添加植物'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlantForm;
