import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addFavorite } from '../../slices/favoritesSlice';
import { searchPhotos } from '../../services/unsplash';
import Modal from '../../components/Modal/Modal';
import { saveAs } from 'file-saver';
import './Search.css';

import addIcon from '../../images/añadir.png';
import favoriteMarkedIcon from '../../images/añadirmarcado.png';
import downloadIcon from '../../images/descargar.png';
import infoIcon from '../../images/info.png';
import searchIcon from '../../images/lupa.png';

const Search = () => {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [activeFilter, setActiveFilter] = useState('global');
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
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
        if (query.trim() === '' && activeFilter === 'global') {
          setPhotos([]);
        } else if (activeFilter === 'global') {
          const results = await searchPhotos(query);
          setPhotos(results);
        }
      } catch (error) {
        console.error('Error al buscar fotos:', error);
      }
    };
    fetchPhotos();
  }, [query, activeFilter]);

  // Actualizar fondo según el filtro activo
  useEffect(() => {
    if (activeFilter === 'favoritas') {
      document.body.style.backgroundColor = '#FFC0CB'; // Fondo rosa
    } else {
      document.body.style.backgroundColor = ''; // Restaurar fondo
    }

    return () => {
      document.body.style.backgroundColor = ''; // Restaurar fondo al desmontar
    };
  }, [activeFilter]);

  // Filtrar favoritas por descripción
  useEffect(() => {
    if (activeFilter === 'favoritas') {
      setFilteredFavorites(
        favorites.filter((photo) =>
          photo.alt_description
            ?.toLowerCase()
            .includes(query.toLowerCase())
        )
      );
    }
  }, [query, favorites, activeFilter]);

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

  const handleUpdateDescription = (photoId, newDescription) => {
    const updatedFavorites = favorites.map((fav) =>
      fav.id === photoId ? { ...fav, alt_description: newDescription } : fav
    );
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (photo) => {
    setFavorites(favorites.filter((fav) => fav.id !== photo.id));
    localStorage.setItem('favorites', JSON.stringify(favorites.filter((fav) => fav.id !== photo.id)));
    setIsModalOpen(false);
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
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const downloadImage = (url, filename) => {
    saveAs(url, filename);
  };

  const renderPhotos = () => {
    const filteredPhotos =
      activeFilter === 'favoritas'
        ? filteredFavorites
        : sortPhotos(photos);

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
              <button onClick={() => downloadImage(photo.urls.full, `${photo.id}.jpg`)}>
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
            placeholder={
              activeFilter === 'favoritas'
                ? 'Buscar descripciones'
                : 'Buscar fotos'
            }
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        photo={selectedPhoto}
        onUpdateDescription={handleUpdateDescription}
        removeFromFavorites={removeFromFavorites}
        isFavoritas={activeFilter === 'favoritas'}
      />
    </div>
  );
};

export default Search;