import React, { useState, useEffect } from 'react';
import closeIcon from '../../images/cerrar.png';
import editIcon from '../../images/editar.png';
import saveIcon from '../../images/guardar.png';
import deleteIcon from '../../images/eliminar.png';
import './Modal.css';

const Modal = ({ isOpen, onClose, photo, onUpdateDescription, removeFromFavorites, isFavoritas }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (photo) {
      setDescription(photo.alt_description || 'Sin descripción disponible');
    }
  }, [photo]);

  if (!isOpen || !photo) return null;

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateDescription) {
      onUpdateDescription(photo.id, description);
    }
  };

  const handleDelete = () => {
    if (removeFromFavorites) {
      removeFromFavorites(photo);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img
          src={closeIcon}
          alt="Cerrar"
          className="modal-close"
          onClick={onClose}
        />
        <div className="photo-preview">
          <img src={photo.urls.full} alt={description || 'Sin descripción'} />
        </div>
        <div className="photo-details">
          <p><strong>Fecha de importación:</strong> {new Date(photo.created_at).toLocaleDateString()}</p>
          <p><strong>Ancho:</strong> {photo.width}px</p>
          <p><strong>Alto:</strong> {photo.height}px</p>
          <p><strong>Likes:</strong> {photo.likes}</p>
          <p><strong>Descripción:</strong></p>
          <textarea
            readOnly={!isEditing}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              backgroundColor: isEditing ? '#fff' : '#f5f5f5',
              cursor: isEditing ? 'text' : 'not-allowed',
            }}
          />
        </div>
        {isFavoritas && (
          <div className="photo-actions">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="small-button">
                <img src={editIcon} alt="Editar" />
              </button>
            ) : (
              <button onClick={handleSave} className="small-button">
                <img src={saveIcon} alt="Guardar" />
              </button>
            )}
            <button onClick={handleDelete} className="small-button">
              <img src={deleteIcon} alt="Borrar" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
