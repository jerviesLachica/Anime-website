// api.js

const API_BASE_URL = 'https://api.jikan.moe/v4';

/**
 * Fetches data from the Jikan API and handles errors.
 * @param {string} endpoint The API endpoint to request.
 * @returns {Promise<object>} The JSON response from the API.
 */
async function fetchFromJikan(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status} ${response.statusText}`);
    }
    // Add a small delay to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 300));
    return response.json();
  } catch (error) {
    console.error('Failed to fetch from Jikan API:', error);
    // Return a default structure to prevent site-breaking errors
    return { data: [] };
  }
}

/**
 * Fetches the top-rated anime.
 * @returns {Promise<Array>} A list of top anime objects.
 */
export async function getTopAnime() {
  const response = await fetchFromJikan('top/anime?filter=airing&limit=15');
  return response.data;
}

/**
 * Fetches anime by a specific genre ID.
 * @param {number} genreId The ID of the genre.
 * @param {number} limit The number of results to return.
 * @returns {Promise<Array>} A list of anime objects in that genre.
 */
export async function getAnimeByGenre(genreId, limit = 10) {
  const response = await fetchFromJikan(`anime?genres=${genreId}&limit=${limit}&order_by=score&sort=desc`);
  return response.data;
}

/**
 * Fetches all available anime genres.
 * @returns {Promise<Array>} A list of genre objects.
 */
export async function getGenres() {
  const response = await fetchFromJikan('genres/anime');
  return response.data;
}

/**
 * Searches for anime by a query string.
 * @param {string} query The search term.
 * @returns {Promise<Array>} A list of anime objects matching the search query.
 */
export async function searchAnime(query) {
  const response = await fetchFromJikan(`anime?q=${encodeURIComponent(query)}&limit=10`);
  return response.data;
}

/**
 * Fetches detailed information for a single anime by its ID.
 * @param {number} animeId The MAL (MyAnimeList) ID of the anime.
 * @returns {Promise<object>} A single detailed anime object.
 */
export async function getAnimeById(animeId) {
  const response = await fetchFromJikan(`anime/${animeId}/full`);
  return response.data;
}

/**
 * Fetches recommended anime for a given anime ID.
 * @param {number} animeId The MAL ID of the anime.
 * @returns {Promise<Array>} A list of recommended anime objects.
 */
export async function getAnimeRecommendations(animeId) {
    const response = await fetchFromJikan(`anime/${animeId}/recommendations`);
    // The recommendations endpoint has a different structure
    return response.data.map(rec => rec.entry);
}