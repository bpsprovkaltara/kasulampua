import { reactive, toRefs } from 'vue'
// import { API_ENDPOINTS } from '@/config/api'

const state = reactive({
  allDatasets: [],
  categories: [],
  regions: [],
  isLoading: false,
  hasLoaded: false
})

export function useDatasetStore() {
  const fetchAllData = async () => {
    if (state.hasLoaded) return

    state.isLoading = true
    try {
      /* 
      const [dsRes, catRes, regRes] = await Promise.all([
        fetch(API_ENDPOINTS.DATASET),
        fetch(API_ENDPOINTS.DATASET_KATEGORI),
        fetch(API_ENDPOINTS.DATASET_REGION)
      ])
      
      state.allDatasets = (await dsRes.json()) || []
      state.categories = (await catRes.json()) || []
      state.regions = (await regRes.json()) || []
      */

      // DUMMY DATA 
      state.categories = [
        { id: 1, name: 'Sosial' },
        { id: 2, name: 'Kependudukan' },
        { id: 3, name: 'Pertanian' },
        { id: 4, name: 'Ekonomi' },
        { id: 5, name: 'Kesehatan' },
        { id: 6, name: 'Pendidikan' }
      ]

      state.regions = [
        { id: 1, name: 'Kalimantan Utara' },
        { id: 2, name: 'Sulawesi Tengah' },
        { id: 3, name: 'Maluku Utara' },
        { id: 4, name: 'Papua Barat' }
      ]

      state.allDatasets = [
        { id: 101, title: 'Populasi Ternak Besar 2023', category: 3, region: 1, region_name: 'Kalimantan Utara', year: 2023, date: '2024-01-10', notes: 'Data populasi ternak sapi, kerbau, dan kuda di seluruh kabupaten/kota.', status: 'active', slug: 'ternak-besar-2023' },
        { id: 102, title: 'Indeks Pembangunan Manusia 2024', category: 1, region: 2, region_name: 'Sulawesi Tengah', year: 2024, date: '2024-02-05', notes: 'Capaian IPM provinsi berdasarkan dimensi umur, pengetahuan, dan standar layak hidup.', status: 'active', slug: 'ipm-2024' },
        { id: 103, title: 'Produksi Padi Menurut Kabupaten', category: 3, region: 3, region_name: 'Maluku Utara', year: 2023, date: '2023-12-15', notes: 'Volume produksi padi (GKG) yang dihasilkan oleh tiap kabupaten per tahun.', status: 'active', slug: 'produksi-padi-kab' },
        { id: 104, title: 'Tingkat Kemiskinan Regional', category: 4, region: 4, region_name: 'Papua Barat', year: 2024, date: '2024-01-20', notes: 'Persentase penduduk miskin terhadap total penduduk di wilayah regional.', status: 'active', slug: 'kemiskinan-regional' },
        { id: 105, title: 'Jumlah Fasilitas Kesehatan Dasar', category: 5, region: 1, region_name: 'Kalimantan Utara', year: 2024, date: '2024-02-12', notes: 'Sebaran Puskesmas, Klinik, dan Posyandu di wilayah Kalimantan Utara.', status: 'active', slug: 'faskes-dasar' },
        { id: 106, title: 'Rasio Guru per Murid SD/SMP', category: 6, region: 2, region_name: 'Sulawesi Tengah', year: 2024, date: '2024-02-18', notes: 'Analisis perbandingan jumlah tenaga pendidik dengan peserta didik tetap.', status: 'active', slug: 'rasio-guru-murid' }
      ]

      state.hasLoaded = true
    } catch (err) {
      console.error('Gagal memuat dataset store:', err)
    } finally {
      state.isLoading = false
    }
  }

  return {
    ...toRefs(state),
    fetchAllData
  }
}
