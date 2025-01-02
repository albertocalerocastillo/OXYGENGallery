import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ModalFavoritas from './ModalFavoritas';

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites.favorites);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleOpenModal = (photo) => {
    setSelectedPhoto(photo);
    setModalOpen(true);
  };

  return (
    <div>
      <h1>Favoritas</h1>
      <div className="photos-grid">
        {favorites.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img
              src={photo.urls.small}
              alt={photo.description || 'Foto'}
              onClick={() => handleOpenModal(photo)}
            />
          </div>
        ))}
      </div>
      {selectedPhoto && (
        <ModalFavoritas
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          photo={selectedPhoto}
        />
      )}
    </div>
  );
};

export default Favorites;