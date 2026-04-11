import { reactive, toRefs } from 'vue'
import { CKAN_ACTION_API } from '@/config/api'
import { ckanOrgToWilayahLabel, sortWilayahRegions } from '@/utils/ckanOrganizationWilayah.js'

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 menit

const state = reactive({
  categories: [],
  wilayahRegions: [],
  isLoading: false,
  hasLoaded: false,
  lastFetchedAt: null,
})

export function useDatasetStore() {
  const fetchAllData = async (force = false) => {
    const isStale = !state.lastFetchedAt || (Date.now() - state.lastFetchedAt > CACHE_TTL_MS)
    if (state.hasLoaded && !isStale && !force) return

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

      try {
        const orgRes = await fetch(`${CKAN_ACTION_API.ORGANIZATION_LIST}?all_fields=true&limit=500`)
        const orgJson = await orgRes.json()
        if (orgJson.success && Array.isArray(orgJson.result)) {
          const mapped = orgJson.result
            .filter((o) => o && o.name)
            .map((o) => ({
              id: o.name,
              label: ckanOrgToWilayahLabel(o),
              count: o.package_count ?? 0
            }))
          state.wilayahRegions = sortWilayahRegions(mapped)
        }
      } catch (e) {
        console.error('Gagal memuat organisasi CKAN:', e)
      }

      state.hasLoaded = true
      state.lastFetchedAt = Date.now()
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
