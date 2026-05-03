import React from 'react';
import type { Plant } from '../types/plant';
import { getWateringStatus, getFertilizingStatus, formatDaysRemaining } from '../utils/careUtils';

interface CareTask {
  plantId: string;
  plantName: string;
  plantImage: string;
  type: 'water' | 'fertilize';
  daysRemaining: number;
  isOverdue: boolean;
  isUrgent: boolean;
}

interface DashboardOverviewProps {
  plants: Plant[];
  onWater: (id: string) => void;
  onFertilize: (id: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ plants, onWater, onFertilize }) => {
  const getCareTasks = (): CareTask[] => {
    const tasks: CareTask[] = [];
    
    plants.forEach(plant => {
      const wateringStatus = getWateringStatus(plant);
      const fertilizingStatus = getFertilizingStatus(plant);
      
      if (wateringStatus.daysRemaining <= 2 || wateringStatus.isOverdue) {
        tasks.push({
          plantId: plant.id,
          plantName: plant.name,
          plantImage: plant.coverImage,
          type: 'water',
          daysRemaining: wateringStatus.daysRemaining,
          isOverdue: wateringStatus.isOverdue,
          isUrgent: wateringStatus.isUrgent,
        });
      }
      
      if (fertilizingStatus.daysRemaining <= 2 || fertilizingStatus.isOverdue) {
        tasks.push({
          plantId: plant.id,
          plantName: plant.name,
          plantImage: plant.coverImage,
          type: 'fertilize',
          daysRemaining: fertilizingStatus.daysRemaining,
          isOverdue: fertilizingStatus.isOverdue,
          isUrgent: fertilizingStatus.isUrgent,
        });
      }
    });
    
    return tasks.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      if (a.isOverdue && b.isOverdue) return a.daysRemaining - b.daysRemaining;
      return a.daysRemaining - b.daysRemaining;
    });
  };

  const tasks = getCareTasks();
  const overdueTasks = tasks.filter(t => t.isOverdue);
  const urgentTasks = tasks.filter(t => !t.isOverdue && t.isUrgent);
  const todayTasks = tasks.filter(t => !t.isOverdue && t.daysRemaining === 0);

  const getTaskClass = (task: CareTask): string => {
    if (task.isOverdue) return 'task-overdue';
    if (task.isUrgent) return 'task-urgent';
    return 'task-normal';
  };

  const getTaskIcon = (type: 'water' | 'fertilize'): string => {
    return type === 'water' ? '💧' : '🧪';
  };

  const getTaskLabel = (type: 'water' | 'fertilize'): string => {
    return type === 'water' ? '浇水' : '施肥';
  };

  if (plants.length === 0) {
    return null;
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <span className="dashboard-icon">📋</span>
          今日概览
        </h2>
        <div className="dashboard-stats">
          {overdueTasks.length > 0 && (
            <span className="stat-badge stat-overdue">
              ⚠️ 过期 {overdueTasks.length} 项
            </span>
          )}
          {urgentTasks.length > 0 && (
            <span className="stat-badge stat-urgent">
              🔥 紧急 {urgentTasks.length} 项
            </span>
          )}
          {todayTasks.length > 0 && (
            <span className="stat-badge stat-today">
              📅 今天 {todayTasks.length} 项
            </span>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="dashboard-empty">
          <div className="empty-icon">✨</div>
          <h3>所有植物都很健康！</h3>
          <p>近期没有需要处理的养护任务</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task, index) => (
            <div 
              key={`${task.plantId}-${task.type}-${index}`}
              className={`task-item ${getTaskClass(task)}`}
            >
              <div className="task-plant-info">
                {task.plantImage ? (
                  <img 
                    src={task.plantImage} 
                    alt={task.plantName} 
                    className="task-plant-image"
                  />
                ) : (
                  <div className="task-plant-placeholder">
                    <span>🌿</span>
                  </div>
                )}
                <div className="task-details">
                  <h4 className="task-plant-name">{task.plantName}</h4>
                  <div className="task-info">
                    <span className="task-type">
                      {getTaskIcon(task.type)} {getTaskLabel(task.type)}
                    </span>
                    <span className="task-time">
                      {formatDaysRemaining(task.daysRemaining)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className={`task-action-btn ${task.type === 'water' ? 'btn-water' : 'btn-fertilize'}`}
                onClick={() => task.type === 'water' ? onWater(task.plantId) : onFertilize(task.plantId)}
              >
                {task.type === 'water' ? '💧 立即浇水' : '🧪 立即施肥'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;