import { reactive, toRefs } from 'vue'
import { CKAN_ACTION_API } from '@/config/api'

const state = reactive({
  categories: [],
  isLoading: false,
  hasLoaded: false
})

export function useDatasetStore() {
  const fetchAllData = async () => {
    if (state.hasLoaded) return

    state.isLoading = true
    try {
      const res = await fetch(`${CKAN_ACTION_API.GROUP_LIST}?all_fields=true`)
      const data = await res.json()

      if (data.success && data.result) {
        state.categories = data.result.map(g => ({
          id: g.name,
          name: g.display_name || g.title || g.name,
          count: g.package_count || 0
        }))
      }

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
