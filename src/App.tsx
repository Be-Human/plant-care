import { useState, useEffect } from 'react';
import type { Plant } from './types/plant';
import { getPlants, addPlant, updatePlant, deletePlant } from './utils/storage';
import PlantList from './components/PlantList';
import PlantForm from './components/PlantForm';
import './App.css';

function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadPlants = () => {
      try {
        const storedPlants = getPlants();
        setPlants(storedPlants);
      } catch (error) {
        console.error('Failed to load plants from storage:', error);
        setPlants([]);
      } finally {
        setIsInitialized(true);
      }
    };

    loadPlants();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'plant-care-plants') {
        loadPlants();
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

  const handleSavePlant = (
    plantData: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>
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
    </div>
  );
}

export default App;
