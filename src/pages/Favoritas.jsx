import React, { useState, useEffect } from 'react';
import './Search.css';

const Favoritas = () => {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [view, setView] = useState('global');

  useEffect(() => {
    const storedPhotos = JSON.parse(localStorage.getItem('myPhotos')) || [];
    setPhotos(storedPhotos);
  }, []);

  const deletePhoto = (id) => {
    const updatedPhotos = photos.filter((photo) => photo.id !== id);
    setPhotos(updatedPhotos);
    localStorage.setItem('myPhotos', JSON.stringify(updatedPhotos));
  };

  const editDescription = (id, newDescription) => {
    const updatedPhotos = photos.map((photo) =>
      photo.id === id ? { ...photo, description: newDescription } : photo
    );
    setPhotos(updatedPhotos);
    localStorage.setItem('myPhotos', JSON.stringify(updatedPhotos));
  };

  const handleSort = (option) => {
    const sortedPhotos = [...photos].sort((a, b) => {
      if (option === 'date') {
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      } else if (option === 'width') {
        return a.width - b.width;
      } else if (option === 'height') {
        return a.height - b.height;
      } else if (option === 'likes') {
        return b.likes - a.likes;
      }
      return 0;
    });
    setSortOption(option);
    setPhotos(sortedPhotos);
  };

  const filteredPhotos = photos.filter((photo) =>
    photo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedPhotos = view === 'favoritas' 
    ? photos.filter((photo) => photo.isFavorite)
    : filteredPhotos;

  return (
    <div>
      <header>
        <h1>Favoritas</h1>
      </header>

      <div className="toggle-buttons">
        <button 
          className={view === 'global' ? 'active' : ''}
          onClick={() => setView('global')}
        >
          Global
        </button>
        <button 
          className={view === 'favoritas' ? 'active' : ''}
          onClick={() => setView('favoritas')}
        >
          Favoritas
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar descripciones"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOption}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="">Ordenar por</option>
          <option value="date">Fecha</option>
          <option value="width">Ancho</option>
          <option value="height">Alto</option>
          <option value="likes">Likes</option>
        </select>
      </div>

      <div className="photo-grid">
        {displayedPhotos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img src={photo.urls.thumb} alt={photo.description || 'Photo'} />
            <div className="photo-actions">
              <button onClick={() => deletePhoto(photo.id)}>🗑</button>
              <button
                onClick={() => {
                  const newDescription = prompt(
                    'Editar descripción:',
                    photo.description || ''
                  );
                  if (newDescription !== null) {
                    editDescription(photo.id, newDescription);
                  }
                }}
              >
                ✏️
              </button>
            </div>
            <p>{photo.description || 'Sin descripción'}</p>
            <p>Ancho: {photo.width}, Alto: {photo.height}, Likes: {photo.likes}</p>
            <p>Fecha añadida: {new Date(photo.dateAdded).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favoritas;