import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchPhotos } from '../../services/unsplash'; // Función que ya tienes para interactuar con la API.

export const fetchPhotos = createAsyncThunk(
  'search/fetchPhotos',
  async (query, { rejectWithValue }) => {
    try {
      const results = await searchPhotos(query);
      return results; // Asegúrate de devolver solo los datos necesarios.
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    photos: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearPhotos(state) {
      state.photos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.photos = action.payload; // Asegúrate de que action.payload tenga solo los datos necesarios.
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearPhotos } = searchSlice.actions;
export default searchSlice.reducer;