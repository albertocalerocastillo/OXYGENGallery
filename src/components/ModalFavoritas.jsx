import React, { useState } from 'react';
import closeIcon from '../images/cerrar.png';
import editIcon from '../images/editar.png';
import saveIcon from '../images/guardar.png';
import deleteIcon from '../images/eliminar.png';
import './Modal.css';

const ModalFavoritas = ({ isOpen, onClose, photo, onDelete, onSaveDescription }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(photo?.alt_description || 'No hay descripción.');

  if (!isOpen || !photo) return null;

  const handleSave = () => {
    setIsEditing(false);
    if (onSaveDescription) {
      onSaveDescription(photo.id, description);
    }
  };

  console.log("Rendering ModalFavoritas");

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-favorites">
        <img
          src={closeIcon}
          alt="Cerrar"
          className="modal-close"
          onClick={onClose}
        />

        <div className="photo-preview">
          <img src={photo.urls.small} alt={photo.alt_description || 'Foto'} />
        </div>

        <div className="photo-details">
          <p>
            <strong>Fecha de importación:</strong>{' '}
            {new Date(photo.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Ancho:</strong> {photo.width}px
          </p>
          <p>
            <strong>Alto:</strong> {photo.height}px
          </p>
          <p>
            <strong>Likes:</strong> {photo.likes}
          </p>
        </div>

        <div className="photo-description">
          <p>
            <strong>Descripción:</strong>
          </p>
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

        <div className="photo-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>
              <img src={editIcon} alt="Editar" />
            </button>
          ) : (
            <button onClick={handleSave}>
              <img src={saveIcon} alt="Guardar" />
            </button>
          )}
          <button onClick={() => onDelete(photo.id)}>
            <img src={deleteIcon} alt="Eliminar" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalFavoritas;
