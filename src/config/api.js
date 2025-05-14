const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  BASE_URL: `${API_BASE_URL}`,

  // CRUD Berita
  BERITA: `${API_BASE_URL}/api/berita`,
  BERITA_DETAIL: (id) => `${API_BASE_URL}/api/berita/${id}`,
  BERITA_IMAGE:`${API_BASE_URL}/uploads/berita`
}
