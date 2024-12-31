import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: JSON.parse(localStorage.getItem('myPhotos')) || [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const photo = action.payload;
      if (!state.favorites.some((p) => p.id === photo.id)) {
        state.favorites.push(photo);
        localStorage.setItem('myPhotos', JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action) => {
      const updatedFavorites = state.favorites.filter(
        (photo) => photo.id !== action.payload
      );
      state.favorites = updatedFavorites;
      localStorage.setItem('myPhotos', JSON.stringify(updatedFavorites));
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;