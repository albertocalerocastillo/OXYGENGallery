import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addFavorite } from '../slices/favoritesSlice';
import { searchPhotos } from '../services/unsplash';
import Modal from '../components/Modal'; // Importa el componente Modal
import './Search.css';

import addIcon from '../images/añadir.png';
import favoriteMarkedIcon from '../images/añadirmarcado.png';
import downloadIcon from '../images/descargar.png';
import infoIcon from '../images/info.png';
import searchIcon from '../images/lupa.png';

const Search = () => {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [activeFilter, setActiveFilter] = useState('global');
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Foto seleccionada para mostrar en el modal
  const dispatch = useDispatch();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        if (query.trim() === '') {
          setPhotos([]);
        } else {
          const results = await searchPhotos(query);
          setPhotos(results);
        }
      } catch (error) {
        console.error('Error al buscar fotos:', error);
      }
    };
    fetchPhotos();
  }, [query]);

  useEffect(() => {
    if (activeFilter === 'favoritas') {
      document.body.style.backgroundColor = '#F3D4D4'; // Fondo rosa
    } else {
      document.body.style.backgroundColor = ''; // Fondo por defecto
    }

    return () => {
      document.body.style.backgroundColor = ''; // Limpieza del estilo
    };
  }, [activeFilter]);

  const loadMorePhotos = async () => {
    const page = Math.ceil(photos.length / 12) + 1;
    const morePhotos = await searchPhotos(query, page);
    setPhotos([...photos, ...morePhotos]);
  };

  const toggleFavorite = (photo) => {
    const isFavorite = favorites.some((fav) => fav.id === photo.id);
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== photo.id));
    } else {
      setFavorites([...favorites, photo]);
    }
  };

  const sortPhotos = (photosToSort) => {
    switch (sortOption) {
      case 'date':
        return [...photosToSort].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case 'width':
        return [...photosToSort].sort((a, b) => b.width - a.width);
      case 'height':
        return [...photosToSort].sort((a, b) => b.height - a.height);
      case 'likes':
        return [...photosToSort].sort((a, b) => b.likes - a.likes);
      default:
        return photosToSort;
    }
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo); // Establece la foto seleccionada
    setIsModalOpen(true); // Abre el modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Cierra el modal
    setSelectedPhoto(null); // Limpia la foto seleccionada
  };

  const renderPhotos = () => {
    const filteredPhotos =
      activeFilter === 'favoritas' ? favorites : sortPhotos(photos);

    return (
      <div className="photo-grid">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img src={photo.urls.thumb} alt={photo.alt_description || 'Foto'} />
            <div className="photo-actions">
              <button
                className={`favorite-btn ${
                  favorites.some((fav) => fav.id === photo.id) ? 'added' : ''
                }`}
                onClick={() => toggleFavorite(photo)}
              >
                <img
                  src={
                    favorites.some((fav) => fav.id === photo.id)
                      ? favoriteMarkedIcon
                      : addIcon
                  }
                  alt="Favoritos"
                />
              </button>
              <button onClick={() => window.open(photo.urls.full, '_blank')}>
                <img src={downloadIcon} alt="Descargar" />
              </button>
              <button onClick={() => openModal(photo)}>
                <img src={infoIcon} alt="Info" />
              </button>
            </div>
          </div>
        ))}
        {activeFilter === 'global' && photos.length > 0 && (
          <div className="load-more-container">
            <button className="load-more" onClick={loadMorePhotos}>
              Cargar más
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-bar">
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar fotos"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <img src={searchIcon} alt="Buscar" className="search-icon" />
        </div>

        {activeFilter === 'global' && (
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Ordenar</option>
            <option value="date">Fecha</option>
            <option value="width">Ancho</option>
            <option value="height">Alto</option>
            <option value="likes">Likes</option>
          </select>
        )}
      </div>

      <div className="filters">
        <button
          className={`filter-button ${activeFilter === 'global' ? 'active' : ''}`}
          onClick={() => setActiveFilter('global')}
        >
          Global
        </button>
        <button
          className={`filter-button ${
            activeFilter === 'favoritas' ? 'active' : ''
          }`}
          onClick={() => setActiveFilter('favoritas')}
        >
          Favoritas
        </button>
      </div>

      {photos.length > 0 || activeFilter === 'favoritas' ? (
        renderPhotos()
      ) : (
        <p>No hay resultados</p>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} photo={selectedPhoto} />
    </div>
  );
};

export default Search;