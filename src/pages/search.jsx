import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite } from '../slices/favoritesSlice';
import { searchPhotos } from '../services/unsplash';
import './Search.css';

import addIcon from '../images/añadir.png';
import downloadIcon from '../images/descargar.png';
import infoIcon from '../images/info.png';

const Search = () => {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const favorites = useSelector((state) => state.favorites.favorites);
  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const results = await searchPhotos(query, 1);
      setPhotos(results);
      setPage(2);
    } catch (error) {
      console.error('Error al buscar fotos:', error);
    }
  };

  const loadMore = async () => {
    try {
      const results = await searchPhotos(query, page);
      setPhotos((prev) => [...prev, ...results]);
      setPage(page + 1);
    } catch (error) {
      console.error('Error al cargar más fotos:', error);
    }
  };

  const addToFavorites = (photo) => {
    dispatch(addFavorite(photo));
  };

  const isFavorite = (photoId) =>
    favorites.some((photo) => photo.id === photoId);

  const renderPhotos = () => (
    <div className="photo-grid">
      {photos.map((photo) => (
        <div key={photo.id} className="photo-card">
          <img src={photo.urls.thumb} alt={photo.alt_description || 'Foto'} />
          <div className="photo-actions">
            <button
              className={`favorite-btn ${isFavorite(photo.id) ? 'added' : ''}`}
              onClick={() => addToFavorites(photo)}
              disabled={isFavorite(photo.id)}
            >
              <img src={addIcon} alt="Añadir a favoritos" className="action-icon" />
            </button>
            <button
              onClick={() => window.open(photo.urls.full, '_blank')}
              title="Descargar imagen"
            >
              <img src={downloadIcon} alt="Descargar" className="action-icon" />
            </button>
            <button onClick={() => setSelectedPhoto(photo)}>
              <img src={infoIcon} alt="Ver información" className="action-icon" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const closeModal = () => setSelectedPhoto(null);

  return (
    <div className="search-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar imágenes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {photos.length > 0 ? renderPhotos() : <p>No hay resultados</p>}

      {photos.length > 0 && (
        <button className="load-more" onClick={loadMore}>
          Cargar más
        </button>
      )}

      {selectedPhoto && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Información de la Foto</h2>
            <img src={selectedPhoto.urls.regular} alt="Foto seleccionada" />
            <p><strong>Descripción:</strong> {selectedPhoto.alt_description || 'Sin descripción'}</p>
            <p><strong>Autor:</strong> {selectedPhoto.user.name}</p>
            <p><strong>Ubicación:</strong> {selectedPhoto.location ? selectedPhoto.location.title : 'Desconocido'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;