const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const DATAHUB_BASE_URL = import.meta.env.VITE_DATAHUB_BASE_URL
/** API publikasi BPS (host terpisah dari datahub CKAN), mis. https://datahub-api.kasulampua.id */
const PUBLICATION_API_BASE_URL =
  import.meta.env.VITE_PUBLICATION_API_BASE_URL || DATAHUB_BASE_URL
const CKAN_BASE_URL = import.meta.env.VITE_CKAN_BASE_URL
const CKAN_FILE_BASE = import.meta.env.VITE_CKAN_FILE_BASE_URL
const MATOMO_BASE_URL = import.meta.env.VITE_MATOMO_URL


export const MATOMO_ENDPOINT = {
  BASE_URL: `${MATOMO_BASE_URL}`,
}

export const API_ENDPOINTS = {
  BASE_URL: `${API_BASE_URL}`,

  // Auth
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  PROFILE: `${API_BASE_URL}/api/profile`,
  OAUTH_TOKEN: `${API_BASE_URL}/api/oauth/token`,

  // Users
  USERS: `${API_BASE_URL}/api/users`,
  USER_DETAIL: (id) => `${API_BASE_URL}/api/users/${id}`,

  // Analytics
  ANALYTICS_VISITORS: `${API_BASE_URL}/api/analytics/visitors`,

  // CRUD Berita
  BERITA: `${API_BASE_URL}/api/berita`,
  BERITA_SLUG: ($slug) => `${API_BASE_URL}/api/berita/slug/${$slug}`,
  BERITA_DETAIL: (id) => `${API_BASE_URL}/api/berita/${id}`,
  BERITA_IMAGE:`${API_BASE_URL}/uploads/berita`,
  BERITA_TERKINI:`${API_BASE_URL}/api/berita`, 

  // CRUD Insight
  INSIGHT: `${API_BASE_URL}/api/insight`,
  INSIGHT_SLUG:  ($slug) => `${API_BASE_URL}/api/insight/slug/${$slug}`,
  INSIGHT_DETAIL: (id) => `${API_BASE_URL}/api/insight/${id}`,
  INSIGHT_IMAGE:`${API_BASE_URL}/uploads/insight`,
  INSIGHT_TOP:`${API_BASE_URL}/api/insight`, 

  SETELAN: `${API_BASE_URL}/api/setelan`,

  // Dataset
  DATASET: `${API_BASE_URL}/api/dataset`,
  DATASET_KATEGORI: `${API_BASE_URL}/api/dataset/kategori`,
  DATASET_REGION: `${API_BASE_URL}/api/dataset/region`,
  DATASET_DETAIL: (id) => `${API_BASE_URL}/api/dataset/${id}`,

  // Legacy/Other (Kept for compatibility if used elsewhere)
  LISTDATASET: `${API_BASE_URL}/api/dataset-list`,
}


export const DATAHUB_ENDPOINTS = {
  BASE_URL: `${DATAHUB_BASE_URL}`,
  CKAN_DATASET: `${DATAHUB_BASE_URL}/ckan/datasets`,
  CKAN_DATASET_SHOW: `${DATAHUB_BASE_URL}/ckan/datasets-show`,
  CKAN_GROUP: `${DATAHUB_BASE_URL}/ckan/group`,
  CKAN_GROUP_PACKAGE: `${DATAHUB_BASE_URL}/ckan/group-packages`,
  CKAN_DATASET_SEARCH: `${DATAHUB_BASE_URL}/ckan/datasets-search`,
  CKAN_ORGANIZATION_PACKAGE: `${DATAHUB_BASE_URL}/ckan/organization-packages`,
  CKAN_GROUP_LIST: `${DATAHUB_BASE_URL}/ckan/group_list`,
  CKAN_ORGANIZATION_LIST: `${DATAHUB_BASE_URL}/ckan/organization_list`,
  CKAN_RESOURCE_DETAIL: `${DATAHUB_BASE_URL}/ckan/resource`,

  CKAN_URL_PROXY: `${DATAHUB_BASE_URL}/ckan/proxy-excel`,

  ANALYTICS_DOWNLOAD: `${DATAHUB_BASE_URL}/analytics/download-statistik`,

  RESOFF:`${DATAHUB_BASE_URL}/api/ress-off`,
  RESBPS:`${DATAHUB_BASE_URL}/api/ress-bps`,
  RESDB:`${DATAHUB_BASE_URL}/api/ress-db`,

  CEK_URL_DATA_GO_ID:`${DATAHUB_BASE_URL}/ckan/cek-url`,

  PUBLICATIONS: `${PUBLICATION_API_BASE_URL}/publications`,
  PUBLICATION_DETAIL: (id) => `${PUBLICATION_API_BASE_URL}/publications/${id}`,
  PUBLICATION_COVER: (id) => `${PUBLICATION_API_BASE_URL}/publications/${id}/cover`,
  PUBLICATION_PDF: (id) => `${PUBLICATION_API_BASE_URL}/publications/${id}/pdf`,
}

export const CKAN_ACTION_API = {
  GROUP_LIST: `${CKAN_BASE_URL}/group_list`,
  ORGANIZATION_LIST: `${CKAN_BASE_URL}/organization_list`,
  PACKAGE_SEARCH: `${CKAN_BASE_URL}/package_search`,
  PACKAGE_SHOW: `${CKAN_BASE_URL}/package_show`,
  RESOURCE_SHOW: `${CKAN_BASE_URL}/resource_show`,
  DATASTORE_SEARCH: `${CKAN_BASE_URL}/datastore_search`,
}

export const CKAN_FILE_BASE_URL = CKAN_FILE_BASE || ''
