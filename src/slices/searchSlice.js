import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchPhotos } from '../../services/unsplash';

export const fetchPhotos = createAsyncThunk(
  'search/fetchPhotos',
  async (query, { rejectWithValue }) => {
    try {
      const results = await searchPhotos(query);
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    photos: [],
    status: 'idle',
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
        state.photos = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearPhotos } = searchSlice.actions;
export default searchSlice.reducer;