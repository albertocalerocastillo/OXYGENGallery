import React, { useState, useEffect } from 'react';
import ModalFavoritas from '../../components/Modal/ModalFavoritas';
import '../Search/Search.css'; // Usar estilos de Search

const Favoritas = () => {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Fondo rosa
  useEffect(() => {
    document.body.style.backgroundColor = '#F3D4D4';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Cargar fotos favoritas desde el localStorage
  useEffect(() => {
    const storedPhotos = JSON.parse(localStorage.getItem('myPhotos')) || [];
    setPhotos(storedPhotos);
  }, []);

  // Guardar fotos actualizadas en el localStorage
  const savePhotosToLocalStorage = (updatedPhotos) => {
    localStorage.setItem('myPhotos', JSON.stringify(updatedPhotos));
    setPhotos(updatedPhotos);
  };

  // Abrir modal
  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  // Eliminar foto
  const handleDelete = (photoId) => {
    const updatedPhotos = photos.filter((photo) => photo.id !== photoId);
    savePhotosToLocalStorage(updatedPhotos);
    closeModal();
  };

  // Guardar descripción
  const handleSaveDescription = (photoId, newDescription) => {
    const updatedPhotos = photos.map((photo) =>
      photo.id === photoId ? { ...photo, description: newDescription } : photo
    );
    savePhotosToLocalStorage(updatedPhotos);
  };

  // Filtrar y ordenar fotos
  const filteredPhotos = photos
    .filter((photo) =>
      photo.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'date') {
        return new Date(b.date) - new Date(a.date); // Ordenar por fecha descendente
      } else if (sortOption === 'name') {
        return a.name.localeCompare(b.name); // Ordenar alfabéticamente
      }
      return 0;
    });

  return (
    <div className="favoritas-page">
      <header>
        <h1>Favoritas</h1>
      </header>

      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar fotos..."
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Ordenar por</option>
          <option value="date">Fecha</option>
          <option value="name">Nombre</option>
        </select>
      </div>

      <div className="photo-grid">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img src={photo.url} alt={photo.name} />
            <div className="photo-actions">
              <button onClick={() => openModal(photo)}>Ver</button>
              <button onClick={() => handleDelete(photo.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ModalFavoritas
          isOpen={isModalOpen}
          onClose={closeModal}
          photo={selectedPhoto}
          onDelete={handleDelete}
          onSaveDescription={handleSaveDescription}
        />
      )}
    </div>
  );
};

export default Favoritas;