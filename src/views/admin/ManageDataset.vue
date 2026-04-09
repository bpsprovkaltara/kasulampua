<template>
  <div class="dataset-wrapper">
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
      <div>
        <h3 class="fw-bold mb-1 text-dark">Manajemen Dataset Sektoral</h3>
        <p class="text-muted mb-0 small text-uppercase tracking-wider">Katalog Publikasi & Informasi Data</p>
      </div>
      <div>
        <button class="btn btn-primary shadow-sm fw-medium d-flex align-items-center gap-2 rounded-3 py-2 px-3" @click="openModal('add')">
          <i class="bi bi-file-earmark-plus"></i> Entry Dataset Baru
        </button>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      <div class="card-header bg-transparent border-bottom p-4 d-flex justify-content-between align-items-center">
        <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-database me-2 text-primary"></i> Master Data Dataset</h6>
        <div class="input-group input-group-sm" style="max-width: 250px;">
          <span class="input-group-text bg-light border-end-0 px-3"><i class="bi bi-search text-muted"></i></span>
          <input type="text" class="form-control bg-light border-start-0 ps-0 focus-ring" placeholder="Pencarian Dataset...">
        </div>
      </div>
      <div class="card-body p-0">
         <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead class="bg-light text-secondary">
              <tr>
                <th class="ps-4" style="width: 60px;">No</th>
                <th>Informasi Dataset</th>
                <th>Kategori & Region</th>
                <th>Tahun</th>
                <th>Status</th>
                <th class="text-center" style="width: 140px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="6" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status"></div>
                </td>
              </tr>
              <tr v-else-if="datasets.length === 0">
                 <td colspan="6" class="text-center py-5 text-muted">
                   <div class="display-3 text-secondary opacity-25 mb-3"><i class="bi bi-server"></i></div>
                   <p class="fw-medium">Belum ada dataset yang diinput.</p>
                 </td>
              </tr>
              <tr v-else v-for="(item, index) in datasets" :key="item.id || index">
                <td class="ps-4 fw-medium text-muted">{{ index + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div class="icon-circle bg-primary bg-opacity-10 text-primary fs-4 d-flex align-items-center justify-content-center flex-shrink-0" style="width:48px; height:48px; border-radius:12px;">
                      <i class="bi bi-file-earmark-spreadsheet"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold text-dark mb-1 d-inline-block text-truncate" style="max-width: 320px;" :title="item.title">{{ item.title }}</h6>
                      <p class="mb-0 text-muted small"><i class="bi bi-link me-1"></i><a :href="item.url" target="_blank" class="text-decoration-none" v-if="item.url">Tautan Eksternal</a><span v-else>Tidak ada tautan</span></p>
                    </div>
                  </div>
                </td>
                <td>
                   <div class="mb-1">
                      <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 shadow-sm" style="font-size: 0.70rem; font-weight: 600;"><i class="bi bi-folder2 me-1"></i>Kat {{ item.category }}</span>
                   </div>
                   <div class="small fw-semibold text-dark"><i class="bi bi-geo-alt text-danger me-1"></i>Reg {{ item.region || '-' }}</div>
                </td>
                <td>
                  <span class="text-dark fw-bold px-2 py-1 bg-light rounded-2 border">{{ item.year || '-' }}</span>
                </td>
                <td>
                   <span class="badge rounded-pill fw-medium" :class="(item.status && item.status.toLowerCase() !== 'draft') ? 'bg-success-subtle text-success border border-success border-opacity-25' : 'bg-warning-subtle text-warning border border-warning border-opacity-25'">
                     {{ item.status || 'Draft' }}
                   </span>
                </td>
                <td class="text-center pe-4">
                  <div class="btn-group shadow-sm">
                    <button class="btn btn-sm btn-light border bg-white px-2" @click="openModal('edit', item)">
                      <i class="bi bi-pencil align-middle text-primary"></i>
                    </button>
                    <button class="btn btn-sm btn-light border bg-white px-2" @click="confirmDelete(item)">
                      <i class="bi bi-trash text-danger align-middle"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Dataset Modal -->
    <div class="modal fade" id="datasetModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header bg-light border-0 p-4 pb-3">
            <h5 class="modal-title fw-bold text-dark"><i class="bi bi-database-fill-add me-2 text-primary"></i>{{ modalMode === 'edit' ? 'Update Entri Dataset' : 'Upload Dataset Baru' }}</h5>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="saveDataset">
            <div class="modal-body p-4 pt-4 bg-white">
              <div class="row g-4">
                 <!-- Kolom Kiri -->
                 <div class="col-lg-7">
                    <div class="mb-3">
                      <label class="form-label fw-bold text-secondary small text-uppercase">Judul / Nama Dataset *</label>
                      <input type="text" class="form-control form-control-lg bg-light border-0 focus-ring shadow-sm" v-model="formData.title" required placeholder="Judul dataset publikasi...">
                    </div>

                    <div class="row g-3 mb-3">
                       <div class="col-sm-6">
                           <label class="form-label fw-bold text-secondary small text-uppercase">Tahun Referensi / Rilis *</label>
                           <input type="text" class="form-control bg-light border-0 focus-ring shadow-sm" v-model="formData.year" required placeholder="Contoh: 2024">
                       </div>
                       <div class="col-sm-6">
                           <label class="form-label fw-bold text-secondary small text-uppercase">Tanggal Publikasi</label>
                           <input type="datetime-local" class="form-control bg-light border-0 focus-ring shadow-sm" v-model="formData.date">
                       </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label fw-bold text-secondary small text-uppercase">URL / Tautan Sumber Akses</label>
                      <input type="url" class="form-control bg-light border-0 focus-ring shadow-sm" v-model="formData.url" placeholder="https://domain.go.id/dataset/xyz">
                    </div>

                     <div class="mb-3 h-100">
                       <label class="form-label fw-bold text-secondary small text-uppercase">Deskripsi Dataset & Catatan (Opsional)</label>
                       <textarea class="form-control bg-light border-0 focus-ring shadow-sm p-3 h-100" v-model="formData.notes" rows="6" placeholder="Beri penjelasan singkat tentang konteks data, unit observasi, maupun metodologi dataset ini."></textarea>
                    </div>
                 </div>

                 <!-- Kolom Kanan -->
                 <div class="col-lg-5">
                    <div class="card border-0 shadow-sm bg-light rounded-3 mb-3">
                       <div class="card-body">
                          <h6 class="fw-bold mb-3 border-bottom pb-2">Klasifikasi & Meta Penempatan</h6>
                          
                          <div class="row g-3 mb-3">
                             <div class="col-6">
                                <label class="form-label text-secondary small text-uppercase">ID Kategori</label>
                                <input type="number" class="form-control border-0 shadow-sm focus-ring" v-model="formData.category" placeholder="Int">
                             </div>
                             <div class="col-6">
                                <label class="form-label text-secondary small text-uppercase">ID Regional</label>
                                <input type="number" class="form-control border-0 shadow-sm focus-ring" v-model="formData.region" placeholder="Int">
                             </div>
                          </div>

                          <div class="mb-3">
                              <label class="form-label text-secondary small text-uppercase">Path Distribusi Internal</label>
                              <input type="text" class="form-control border-0 shadow-sm focus-ring" v-model="formData.path" placeholder="/data/resources/file.csv">
                          </div>
                          
                          <div class="mb-1">
                              <label class="form-label text-secondary small text-uppercase">Visibilitas / Status</label>
                              <select class="form-select border-0 shadow-sm focus-ring" v-model="formData.status" required>
                                  <option value="Aktif">Aktif (Live)</option>
                                  <option value="Draft">Draft (Tersembunyi)</option>
                                  <option value="Archived">Diarsipkan</option>
                              </select>
                          </div>
                       </div>
                    </div>

                    <div class="card border-0 shadow-sm bg-light rounded-3">
                       <div class="card-body">
                          <h6 class="fw-bold mb-3 border-bottom pb-2 text-primary"><i class="bi bi-box-seam me-1"></i>Integrasi Paket CKAN</h6>
                          <div class="mb-2">
                              <label class="form-label text-secondary small text-uppercase">Repository CKD ID</label>
                              <input type="number" class="form-control border-0 shadow-sm focus-ring" v-model="formData.ckd_id" placeholder="Tinggalkan kosong jika independen">
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
            <div class="modal-footer border-0 bg-light p-3">
              <button type="button" class="btn btn-white fw-medium shadow-sm border" data-bs-dismiss="modal">Tutup</button>
              <button type="submit" class="btn btn-primary fw-medium px-4 shadow-sm" :disabled="isSaving">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ isSaving ? 'Menyimpan...' : 'Eksekusi & Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { fetchAuth } from '@/utils/auth.js';
import { API_ENDPOINTS } from '@/config/api.js';
import { Modal } from 'bootstrap';

let bsModal = null;
const datasets = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const modalMode = ref('add');
const selectedId = ref(null);

const formData = reactive({
  ckd_id: null,
  category: null,
  title: '',
  year: '',
  region: null,
  url: '',
  date: '',
  status: 'Aktif',
  path: '',
  notes: ''
});

const initModal = () => {
  const modalEl = document.getElementById('datasetModal');
  if(modalEl) bsModal = new Modal(modalEl);
};

const fetchDatasets = async () => {
  isLoading.value = true;
  try {
    const res = await fetchAuth(API_ENDPOINTS.DATASET);
    if(res.ok) {
        const body = await res.json();
        datasets.value = Array.isArray(body) ? body : (body.data || []);
    } else {
        console.error('API respons error:', res.status);
    }
  } catch(e) {
    console.error('API Fetch error:', e);
  } finally {
    isLoading.value = false;
  }
};

const openModal = (mode, item = null) => {
  modalMode.value = mode;
  
  if(mode === 'edit' && item) {
      selectedId.value = item.id;
      Object.assign(formData, {
          ckd_id: item.ckd_id || null,
          category: item.category || null,
          title: item.title || '',
          year: item.year || '',
          region: item.region || null,
          url: item.url || '',
          date: item.date ? new Date(item.date).toISOString().slice(0, 16) : '',
          status: item.status || 'Aktif',
          path: item.path || '',
          notes: item.notes || ''
      });
  } else {
      selectedId.value = null;
      Object.assign(formData, {
          ckd_id: null, category: null, title: '', year: new Date().getFullYear().toString(), 
          region: null, url: '', date: new Date().toISOString().slice(0, 16), 
          status: 'Aktif', path: '', notes: ''
      });
  }
  
  if(bsModal) bsModal.show();
};

const saveDataset = async () => {
  isSaving.value = true;
  
  const url = modalMode.value === 'add' ? API_ENDPOINTS.DATASET : API_ENDPOINTS.DATASET_DETAIL(selectedId.value);
  const method = modalMode.value === 'add' ? 'POST' : 'PUT';
  const payload = { ...formData };
  
  try {
    const res = await fetchAuth(url, {
        method,
        body: JSON.stringify(payload)
    });
    
    if(res.ok) {
        if(bsModal) bsModal.hide();
        fetchDatasets();
    } else {
        const err = await res.json();
        alert('Gagal mengeksekusi request data server: ' + (err.message || res.statusText));
    }
  } catch(e) {
    console.error(e);
    alert('Terjadi kesalahan koneksi.');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (item) => {
    if(confirm(`Yakin ingin menyisih data catalog: "${item.title}"?`)) {
        try {
            const res = await fetchAuth(API_ENDPOINTS.DATASET_DETAIL(item.id), { method: 'DELETE' });
            if(res.ok) {
                fetchDatasets();
            } else {
                alert('Gagal membuang dataset.');
            }
        } catch {
            alert('Kesalahan jaringan.');
        }
    }
};

onMounted(() => {
  fetchDatasets();
  initModal();
});
</script>

<style scoped>
.dataset-wrapper {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.custom-table {
  --bs-table-hover-bg: rgba(59, 130, 246, 0.02);
}

.custom-table thead th {
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.custom-table tbody td {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  vertical-align: middle;
  border-bottom: 1px solid #f1f5f9;
}

.focus-ring {
  transition: all 0.2s;
}

.focus-ring:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15) !important;
  outline: none;
}
</style>
