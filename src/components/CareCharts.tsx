import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { Plant, CareLog } from '../types/plant';

interface CareChartsProps {
  plants: Plant[];
  logs: CareLog[];
}

const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const CareCharts: React.FC<CareChartsProps> = ({ plants, logs }) => {
  const getLast30DaysData = () => {
    const data: { date: string; water: number; fertilize: number }[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      data.push({ date: dateStr, water: 0, fertilize: 0 });
    }
    
    logs.forEach(log => {
      const logDate = new Date(log.timestamp);
      const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < 30) {
        const index = 29 - daysDiff;
        if (index >= 0 && index < data.length) {
          if (log.type === 'water') {
            data[index].water++;
          } else {
            data[index].fertilize++;
          }
        }
      }
    });
    
    return data;
  };

  const getPlantsCareData = () => {
    return plants.map(plant => {
      const plantLogs = logs.filter(log => log.plantId === plant.id);
      const waterCount = plantLogs.filter(log => log.type === 'water').length;
      const fertilizeCount = plantLogs.filter(log => log.type === 'fertilize').length;
      
      return {
        name: plant.name,
        浇水: waterCount,
        施肥: fertilizeCount,
        total: waterCount + fertilizeCount,
      };
    }).filter(item => item.total > 0);
  };

  const getPieChartData = () => {
    const data: { name: string; value: number; color: string }[] = [];
    
    plants.forEach((plant, index) => {
      const plantLogs = logs.filter(log => log.plantId === plant.id);
      if (plantLogs.length > 0) {
        data.push({
          name: plant.name,
          value: plantLogs.length,
          color: COLORS[index % COLORS.length],
        });
      }
    });
    
    return data;
  };

  const last30DaysData = getLast30DaysData();
  const plantsCareData = getPlantsCareData();
  const pieChartData = getPieChartData();

  const totalWater = logs.filter(l => l.type === 'water').length;
  const totalFertilize = logs.filter(l => l.type === 'fertilize').length;

  if (plants.length === 0) {
    return null;
  }

  return (
    <div className="care-charts">
      <div className="charts-header">
        <h2 className="charts-title">
          <span className="charts-icon">📊</span>
          养护统计
        </h2>
        <div className="charts-summary">
          <span className="summary-item">
            <span className="summary-icon">💧</span>
            <span className="summary-value">{totalWater}</span>
            <span className="summary-label">次浇水</span>
          </span>
          <span className="summary-item">
            <span className="summary-icon">🧪</span>
            <span className="summary-value">{totalFertilize}</span>
            <span className="summary-label">次施肥</span>
          </span>
        </div>
      </div>

      <div className="charts-grid">
        {last30DaysData.some(d => d.water > 0 || d.fertilize > 0) && (
          <div className="chart-card">
            <h3 className="chart-title">近30天养护频率</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={last30DaysData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="water" name="浇水" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fertilize" name="施肥" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {plantsCareData.length > 0 && (
          <div className="chart-card">
            <h3 className="chart-title">各植物养护情况</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={plantsCareData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    allowDecimals={false}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="浇水" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="施肥" fill="#ec4899" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {pieChartData.length > 0 && (
          <div className="chart-card chart-full">
            <h3 className="chart-title">养护占比分布</h3>
            <div className="chart-container pie-container">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {logs.length === 0 && (
        <div className="charts-empty">
          <div className="charts-empty-icon">📈</div>
          <h3>暂无统计数据</h3>
          <p>开始记录养护操作后，这里将显示统计图表</p>
        </div>
      )}
    </div>
  );
};

export default CareCharts;