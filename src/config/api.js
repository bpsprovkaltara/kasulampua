const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const DATAHUB_BASE_URL = import.meta.env.VITE_DATAHUB_BASE_URL
const MATOMO_BASE_URL = import.meta.env.VITE_MATOMO_URL


export const MATOMO_ENDPOINT = {
  BASE_URL: `${MATOMO_BASE_URL}`,
}

export const API_ENDPOINTS = {
  BASE_URL: `${API_BASE_URL}`,

  // CRUD Berita
  BERITA: `${API_BASE_URL}/api/berita`,
  BERITA_SLUG: ($slug) => `${API_BASE_URL}/api/berita/slug/${$slug}`,
  BERITA_DETAIL: (id) => `${API_BASE_URL}/api/berita/${id}`,
  BERITA_IMAGE:`${API_BASE_URL}/uploads/berita`,
  BERITA_TERKINI:`${API_BASE_URL}/api/berita/newBerita`,


  // CRUD Insight
  INSIGHT: `${API_BASE_URL}/api/insight`,
  INSIGHT_SLUG:  ($slug) => `${API_BASE_URL}/api/insight/slug/${$slug}`,
  INSIGHT_DETAIL: (id) => `${API_BASE_URL}/api/insight/${id}`,
  INSIGHT_IMAGE:`${API_BASE_URL}/uploads/insight`,
  INSIGHT_TOP:`${API_BASE_URL}/api/insight/topInsight`,



  SETELAN: `${API_BASE_URL}/api/setelan`,


  DATASET_KATEGORI: `${API_BASE_URL}/api/dataset-kategori`,
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

  CEK_URL_DATA_GO_ID:`${DATAHUB_BASE_URL}/ckan/cek-url`

}
