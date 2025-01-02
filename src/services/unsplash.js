const ACCESS_KEY = 'U50Eg7Swlf-pt3kAGD8ppMrsNyaxsBDPltyUMd3BKNc';

export const searchPhotos = async (query, page = 1) => {
  const url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=12&client_id=${ACCESS_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener las fotos de Unsplash.');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error en la búsqueda de fotos:', error);
    throw error;
  }
};