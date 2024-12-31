import React, { useState } from 'react';
import Modal from './Modal';
import ModalFavoritas from './ModalFavoritas';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorites, setIsFavorites] = useState(false); // Cambia según la pestaña
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const openModal = (photo, favorites) => {
    setSelectedPhoto(photo);
    setIsFavorites(favorites);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleDelete = (photoId) => {
    console.log('Borrar foto con ID:', photoId);
    // Lógica para eliminar la foto de favoritos
  };

  const handleSaveDescription = (photoId, description) => {
    console.log('Guardar descripción para ID:', photoId, 'Descripción:', description);
    // Lógica para guardar la descripción
  };

  return (
    <div>
      {/* Renderizar según la pestaña activa */}
      {isFavorites ? (
        <ModalFavoritas
          isOpen={isModalOpen}
          onClose={closeModal}
          photo={selectedPhoto}
          onDelete={handleDelete}
          onSaveDescription={handleSaveDescription}
        />
      ) : (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          photo={selectedPhoto}
        />
      )}
    </div>
  );
};

export default App;
