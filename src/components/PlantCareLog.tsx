import React, { useState, useEffect } from 'react';
import type { Plant, CareLog } from '../types/plant';
import { getCareLogsByPlantId } from '../utils/storage';

interface PlantCareLogProps {
  plant: Plant;
  onClose: () => void;
}

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return diffDays === 1 ? '昨天' : `${diffDays} 天前`;
  } else if (diffHours > 0) {
    return diffHours === 1 ? '1 小时前' : `${diffHours} 小时前`;
  } else if (diffMinutes > 0) {
    return diffMinutes === 1 ? '1 分钟前' : `${diffMinutes} 分钟前`;
  } else {
    return '刚刚';
  }
};

const PlantCareLog: React.FC<PlantCareLogProps> = ({ plant, onClose }) => {
  const [logs, setLogs] = useState<CareLog[]>([]);

  useEffect(() => {
    const plantLogs = getCareLogsByPlantId(plant.id);
    setLogs(plantLogs);
  }, [plant.id]);

  const getLogIcon = (type: 'water' | 'fertilize'): string => {
    return type === 'water' ? '💧' : '🧪';
  };

  const getLogLabel = (type: 'water' | 'fertilize'): string => {
    return type === 'water' ? '浇水' : '施肥';
  };

  const getLogClass = (type: 'water' | 'fertilize'): string => {
    return type === 'water' ? 'log-water' : 'log-fertilize';
  };

  const waterLogs = logs.filter(log => log.type === 'water');
  const fertilizeLogs = logs.filter(log => log.type === 'fertilize');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="log-header-info">
            {plant.coverImage ? (
              <img src={plant.coverImage} alt={plant.name} className="log-plant-image" />
            ) : (
              <div className="log-plant-placeholder">
                <span>🌿</span>
              </div>
            )}
            <div className="log-plant-details">
              <h2>{plant.name}</h2>
              <p className="log-plant-variety">{plant.variety}</p>
            </div>
          </div>
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        <div className="log-stats">
          <div className="log-stat-item">
            <span className="stat-icon">💧</span>
            <div className="stat-content">
              <span className="stat-value">{waterLogs.length}</span>
              <span className="stat-label">浇水记录</span>
            </div>
          </div>
          <div className="log-stat-item">
            <span className="stat-icon">🧪</span>
            <div className="stat-content">
              <span className="stat-value">{fertilizeLogs.length}</span>
              <span className="stat-label">施肥记录</span>
            </div>
          </div>
        </div>

        <div className="log-content">
          {logs.length === 0 ? (
            <div className="log-empty">
              <div className="log-empty-icon">📝</div>
              <h3>暂无养护记录</h3>
              <p>开始记录你的第一次浇水或施肥吧</p>
            </div>
          ) : (
            <div className="log-timeline">
              {logs.map((log, index) => (
                <div key={log.id} className={`timeline-item ${getLogClass(log.type)}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-icon">{getLogIcon(log.type)}</span>
                      <span className="timeline-type">{getLogLabel(log.type)}</span>
                      <span className="timeline-relative">{formatRelativeTime(log.timestamp)}</span>
                    </div>
                    <div className="timeline-time">{formatDate(log.timestamp)}</div>
                    {log.notes && (
                      <div className="timeline-notes">{log.notes}</div>
                    )}
                  </div>
                  {index < logs.length - 1 && (
                    <div className="timeline-line"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantCareLog;