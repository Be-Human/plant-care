import { useState, useEffect } from 'react';
import type { Plant, CareLog } from './types/plant';
import type { PlantFormData } from './utils/storage';
import { 
  getPlants, 
  addPlant, 
  updatePlant, 
  deletePlant, 
  recordWatering, 
  recordFertilizing,
  getCareLogs 
} from './utils/storage';
import PlantList from './components/PlantList';
import PlantForm from './components/PlantForm';
import DashboardOverview from './components/DashboardOverview';
import PlantCareLog from './components/PlantCareLog';
import CareCharts from './components/CareCharts';
import './App.css';

export interface CareAction {
  plantId: string;
  action: 'water' | 'fertilize';
  timestamp: number;
}

function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | undefined>(undefined);
  const [selectedPlantForLog, setSelectedPlantForLog] = useState<Plant | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastCareAction, setLastCareAction] = useState<CareAction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPlants = () => {
      try {
        const storedPlants = getPlants();
        setPlants(storedPlants);
      } catch (error) {
        console.error('Failed to load plants from storage:', error);
        setPlants([]);
      }
    };

    const loadCareLogs = () => {
      try {
        const logs = getCareLogs();
        setCareLogs(logs);
      } catch (error) {
        console.error('Failed to load care logs from storage:', error);
        setCareLogs([]);
      } finally {
        setIsInitialized(true);
      }
    };

    loadPlants();
    loadCareLogs();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'plant-care-plants') {
        loadPlants();
      }
      if (e.key === 'plant-care-care-logs') {
        loadCareLogs();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAddPlant = () => {
    setEditingPlant(undefined);
    setIsModalOpen(true);
  };

  const handleEditPlant = (plant: Plant) => {
    setEditingPlant(plant);
    setIsModalOpen(true);
  };

  const handleDeletePlant = (id: string) => {
    try {
      const success = deletePlant(id);
      if (success) {
        setPlants(prev => prev.filter(plant => plant.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete plant:', error);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleWaterPlant = (id: string) => {
    try {
      const updatedPlant = recordWatering(id);
      if (updatedPlant) {
        setPlants(prev =>
          prev.map(plant =>
            plant.id === id ? updatedPlant : plant
          )
        );
        setCareLogs(getCareLogs());
        setLastCareAction({ plantId: id, action: 'water', timestamp: Date.now() });
        setTimeout(() => {
          setLastCareAction(prev => 
            prev && prev.plantId === id && prev.action === 'water' ? null : prev
          );
        }, 1500);
        showToast(`✓ 已记录给「${updatedPlant.name}」浇水`);
      }
    } catch (error) {
      console.error('Failed to record watering:', error);
    }
  };

  const handleFertilizePlant = (id: string) => {
    try {
      const updatedPlant = recordFertilizing(id);
      if (updatedPlant) {
        setPlants(prev =>
          prev.map(plant =>
            plant.id === id ? updatedPlant : plant
          )
        );
        setCareLogs(getCareLogs());
        setLastCareAction({ plantId: id, action: 'fertilize', timestamp: Date.now() });
        setTimeout(() => {
          setLastCareAction(prev => 
            prev && prev.plantId === id && prev.action === 'fertilize' ? null : prev
          );
        }, 1500);
        showToast(`✓ 已记录给「${updatedPlant.name}」施肥`);
      }
    } catch (error) {
      console.error('Failed to record fertilizing:', error);
    }
  };

  const handleViewLogs = (plant: Plant) => {
    setSelectedPlantForLog(plant);
  };

  const handleCloseLogs = () => {
    setSelectedPlantForLog(undefined);
  };

  const handleSavePlant = (
    plantData: PlantFormData
  ) => {
    try {
      if (editingPlant) {
        const updatedPlant = updatePlant(editingPlant.id, plantData);
        if (updatedPlant) {
          setPlants(prev =>
            prev.map(plant =>
              plant.id === editingPlant.id ? updatedPlant : plant
            )
          );
        }
      } else {
        const newPlant = addPlant(plantData);
        setPlants(prev => [newPlant, ...prev]);
      }
      setIsModalOpen(false);
      setEditingPlant(undefined);
    } catch (error) {
      console.error('Failed to save plant:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingPlant(undefined);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-icon">🌿</span>
              植物养护
            </h1>
            <button className="add-button" onClick={handleAddPlant}>
              <span className="button-icon">➕</span>
              添加植物
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {isInitialized && (
            <>
              <DashboardOverview
                plants={plants}
                onWater={handleWaterPlant}
                onFertilize={handleFertilizePlant}
              />
              
              <CareCharts
                plants={plants}
                logs={careLogs}
              />

              <div className="section-header">
                <h2 className="section-title">我的植物</h2>
                <span className="plant-count">
                  {plants.length} 株植物
                </span>
              </div>
              <PlantList
                plants={plants}
                onEdit={handleEditPlant}
                onDelete={handleDeletePlant}
                onWater={handleWaterPlant}
                onFertilize={handleFertilizePlant}
                onViewLogs={handleViewLogs}
                lastCareAction={lastCareAction}
              />
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p>用心呵护每一株植物 🌱</p>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <PlantForm
          plant={editingPlant}
          onSave={handleSavePlant}
          onCancel={handleCancel}
        />
      )}

      {selectedPlantForLog && (
        <PlantCareLog
          plant={selectedPlantForLog}
          onClose={handleCloseLogs}
        />
      )}

      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
