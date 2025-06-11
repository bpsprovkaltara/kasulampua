<template>
  <div class="container my-4">
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger text-start">
      Gagal memuat data: {{ error }}
    </div>

    <div v-else class="card shadow-sm">
      <div class="card-header bg-success text-white">
        <h5 class="mb-0 text-start">Detail Data</h5>
      </div>
      <div class="card-body text-start">
        <h5 class="card-title">{{ resource.name }}</h5>
        <p class="card-text"><strong>Format:</strong> {{ resource.format }}</p>
        <p class="card-text"><strong>Dibuat:</strong> {{ formatDate(resource.created) }}</p>
        <p class="card-text"><strong>Terakhir Diubah:</strong> {{ formatDate(resource.last_modified) }}</p>
        <p class="card-text"><strong>Deskripsi:</strong></p>
        <p v-html="resource.description"></p>

        <div class="text-end mt-4">
          <a v-if="resource.url != '-'" :href="resource.url" class="btn btn-success" target="_blank">
            <i class="bi bi-download me-1"></i> Unduh File
          </a>
        </div>
      </div>

      <div class="card-header bg-success text-white">
        <h5 class="mb-0 text-start">Preview Data</h5>
      </div>
      <div class="card-body text-start">
        <ExcelPreview v-if="(isExcelPreview || !statistikData.length) && fileUrl" :fileUrl="fileUrl" :visible="true" />

        <div v-else>
          <div class="form-horizontal">
            <div class="row">
              <div class="form-group col-lg-4">
                <div class="col-lg-12 mb-4">
                  <label>Pilih Wilayah</label>
                  <select v-model="wilayahData" class="form-control">
                    <option disabled value="">Pilih wilayah data</option>
                    <option v-for="t in opsiWilayah" :key="t.val" :value="t.val">
                      {{ t.label }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group col-lg-2 mb-2 mb-lg-0">
                <div class="col-12">
                  <label>Pilih Tahun</label>
                  <select v-model.number="tahunAwal" class="form-control" @change="e => alert(tahunAwal)">
                    <option disabled value="">Pilih tahun awal</option>
                    <option v-for="t in tahunOptions" :key="t.label" :value="parseInt(t.label)">
                      {{ t.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group col-lg-2 mb-2 mb-lg-0">
                <div class="col-12">
                  <label class="d-none d-sm-block">&nbsp;</label>
                  <select v-model.number="tahunAkhir" class="form-control" :disabled="filteredTahunAkhir.length === 0">
                    <option disabled value="">Pilih tahun akhir</option>
                    <option v-for="t in filteredTahunAkhir" :key="t.label" :value="parseInt(t.label)">
                      {{ t.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <DynamicTabelStatistik class="mt-2" :data="statistikData" :index="0" :yearRange="rangeData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits, watch } from 'vue'
import { useRoute } from 'vue-router'
import ExcelPreview from '../components/ExcelPreview.vue'
import { DATAHUB_ENDPOINTS } from '@/config/api'
import DynamicTabelStatistik from '../components/DynamicTabelStatistik.vue'

const route = useRoute()
const resourceId = route.params.id
const emitData = defineEmits(['emitJudul'])

const resource = ref({
  name: '',
  description: '',
  format: '',
  created: '',
  last_modified: '',
  url: ''
})
const loading = ref(true)
const error = ref(null)
const fileUrl = ref('')
const statistikData = ref([])
const dataResponse = ref([])


const tahunAwal = ref()
const tahunAkhir = ref()
const tahunOptions = ref([])
const wilayahData = ref()
const selectedFilter = ref([])

const opsiWilayah = ref([
  {val:'kasulampua',label:'Kasulampua',filter:[6100,6200,6300,6400,6500,7100,7200,7300,7400,7500,7600,8100,8200,9100,9200,9400,9500,9600,9700]},
  {val:'indonesia',label:'Indonesia',filter:[]}
]
)


const filteredTahunAkhir = computed(() => {
  if (!tahunAwal.value) return []
  return tahunOptions.value.filter(t => parseInt(t.label) >= tahunAwal.value)
})

const rangeData = computed(() => {
  if (tahunAwal.value && tahunAkhir.value) {
    return `${tahunAwal.value}-${tahunAkhir.value}`
  }
  return ''
})

const isResoff = computed(() => resourceId?.startsWith('resoff-'))
const isResbps = computed(() => resourceId?.startsWith('resbps-'))
const isExcelPreview = computed(() => isResoff.value || isResbps.value)

watch(wilayahData,(newVal)=>{


  selectedFilter.value = opsiWilayah.value.find(w => w.val === newVal)?.filter || []

  if(!dataResponse.value)return

  if(selectedFilter.value.length >0){
    let json = JSON.parse(JSON.stringify(dataResponse.value))
    json.vervar = json.vervar.filter(v => selectedFilter.value.includes(v.val))

    statistikData.value = [json]
  }else{
    let json = JSON.parse(JSON.stringify(dataResponse.value))
    statistikData.value = [json]
  }

})

onMounted(async () => {
  if (isResoff.value) {
    try {
      const res = await fetch(`${DATAHUB_ENDPOINTS.RESOFF}/${resourceId}`)
      const json = await res.json()
      if (json && json.url) {
        fileUrl.value = json.url
        resource.value = {
          name: json.judul,
          description: '-',
          format: '-',
          created: json.date,
          last_modified: json.date,
          url: json.url
        }
        emitData('emitJudul', json.judul)
      } else {
        throw new Error('Data tidak ditemukan')
      }
    } catch (error) {
      error.value = error.message
    } finally {
      loading.value = false
    }
  } else if (isResbps.value) {
    try {
      const res = await fetch(`${DATAHUB_ENDPOINTS.RESBPS}/${resourceId}`)
      if (!res.ok) {
        throw new Error(`Gagal fetch data: ${res.status} ${res.statusText}`)
      }

      const json = await res.json()
      json.labelvervar = 'Provinsi'

      let htmlTeks = json.var[0].note;

      htmlTeks.replace(/^(?:\s*<p><br\s*\/?><\/p>\s*){2,}/i, '<p><br /></p>').replace(/(?:\s*<p><br\s*\/?><\/p>\s*){2,}$/i, '<p><br /></p>');
      json.var[0].note = htmlTeks

      dataResponse.value = JSON.parse(JSON.stringify(json))

      wilayahData.value = 'kasulampua'

      selectedFilter.value = opsiWilayah.value.find(w => w.val === wilayahData.value)?.filter || []

      json.vervar = json.vervar.filter(v => selectedFilter.value.includes(v.val))

      statistikData.value = [json]
      resource.value = {
        name: json.var[0].label,
        description: json.var[0].note,
        format: '-',
        created: json.last_update,
        last_modified: json.last_update,
        url: json.url || '-'
      }
      emitData('emitJudul', json.var[0].label)
      tahunOptions.value = json.tahun

      const currentYear = new Date().getFullYear()
      const defaultStart = currentYear - 5

      const tahunValList = json.tahun.map(t => parseInt(t.label))
      const tahunStart = tahunValList.includes(defaultStart) ? defaultStart : Math.min(...tahunValList)
      const tahunEnd = tahunValList.includes(currentYear) ? currentYear : Math.max(...tahunValList)

      tahunAwal.value = tahunStart
      tahunAkhir.value = tahunEnd
      fileUrl.value = ''
    } catch (err) {
      error.value = err.message || 'Terjadi kesalahan saat mengambil data'
    } finally {
      loading.value = false
    }
  } else {
    try {
      const res = await fetch(`${DATAHUB_ENDPOINTS.CKAN_RESOURCE_DETAIL}/${resourceId}`)
      const json = await res.json()
      if (json.result) {
        resource.value = json.result
        fileUrl.value = json.result.url
      } else {
        throw new Error('Data tidak ditemukan')
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
})

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString()
}
</script>
