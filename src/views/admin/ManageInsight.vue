<template>
  <div class="insight-wrapper">
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
      <div>
        <h3 class="fw-bold mb-1 text-dark">Data Regional Insights</h3>
        <p class="text-muted mb-0 small text-uppercase tracking-wider">Manajemen Indikator Strategis Wilayah</p>
      </div>
      <div>
        <button class="btn btn-primary shadow-sm fw-medium d-flex align-items-center gap-2 rounded-3 py-2 px-3" @click="openModal('add')">
          <i class="bi bi-bar-chart-fill"></i> Tambah Insight Baru
        </button>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div class="card-header bg-transparent border-bottom p-4 d-flex justify-content-between align-items-center">
        <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-lightbulb-fill me-2 text-warning"></i> Koleksi Insight</h6>
        <div class="input-group input-group-sm" style="max-width: 250px;">
          <span class="input-group-text bg-light border-end-0 px-3"><i class="bi bi-search text-muted"></i></span>
          <input type="text" class="form-control bg-light border-start-0 ps-0" placeholder="Filter regional/judul...">
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead class="bg-light text-secondary">
              <tr>
                <th class="ps-4" style="width: 60px;">No</th>
                <th>Insight / Topik</th>
                <th>Wilayah</th>
                <th>Views</th>
                <th class="text-center" style="width: 150px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="5" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status"></div>
                </td>
              </tr>
              <tr v-else-if="insights.length === 0">
                 <td colspan="5" class="text-center py-5 text-muted">
                   <div class="display-3 text-secondary opacity-25 mb-3"><i class="bi bi-inbox"></i></div>
                   <p class="fw-medium">Belum ada insight wilayah tersimpan.</p>
                 </td>
              </tr>
              <tr v-else v-for="(item, index) in insights" :key="item.id || item.slug">
                <td class="ps-4 fw-medium text-muted">{{ index + 1 }}</td>
                <td>
                  <div class="d-flex flex-column justify-content-center">
                      <div class="d-flex align-items-center gap-2 mb-1">
                          <span v-if="item.badge" class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25" style="font-size: 0.65rem;">{{ item.badge }}</span>
                          <span v-if="item.topic" class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25" style="font-size: 0.65rem;">{{ item.topic }}</span>
                      </div>
                      <h6 class="fw-bold text-dark mb-1 d-inline-block text-truncate" style="max-width: 350px;">{{ item.title }}</h6>
                      <p class="mb-0 text-muted small text-truncate" style="max-width: 350px;">{{ item.description || '-' }}</p>
                  </div>
                </td>
                <td>
                   <div class="d-flex align-items-center gap-2 text-dark fw-medium">
                      <i class="bi bi-geo-alt-fill text-danger opacity-75"></i> 
                      {{ item.region_name || `Regional ${item.region}` }}
                   </div>
                </td>
                <td>
                  <span class="badge rounded-pill bg-light text-dark fw-bold border"><i class="bi bi-eye text-primary me-1"></i> {{ item.views || 0 }}</span>
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

    <!-- Insight Modal -->
    <div class="modal fade" id="insightModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header bg-light border-0 p-4 pb-3">
            <h5 class="modal-title fw-bold text-dark"><i class="bi bi-lightbulb me-2 text-warning"></i>{{ modalMode === 'edit' ? 'Update Regional Insight' : 'Setup Baru Regional Insight' }}</h5>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="saveInsight" class="d-flex flex-column" style="max-height: calc(100vh - 120px);">
            <div class="modal-body p-4 pt-3 bg-white" style="overflow-y: auto;">
              <div class="row g-4">
                 <div class="col-md-7">
                    <div class="mb-3">
                      <label class="form-label fw-bold text-secondary small text-uppercase">Judul Insight *</label>
                      <input type="text" class="form-control bg-light border-0 focus-ring shadow-sm" v-model="formData.title" @input="generateSlug" required>
                    </div>

                    <div class="row g-3 mb-3">
                       <div class="col-sm-6">
                           <label class="form-label fw-bold text-secondary small text-uppercase">Slug URL</label>
                           <input type="text" class="form-control bg-light border-0 focus-ring shadow-sm" v-model="formData.slug" required>
                       </div>
                       <div class="col-sm-6">
                           <label class="form-label fw-bold text-secondary small text-uppercase">Status Tampilan</label>
                           <select class="form-select bg-light border-0 focus-ring shadow-sm" v-model="formData.status" required>
                               <option value="published">Aktif / Tampilkan</option>
                               <option value="draft">Sembunyikan</option>
                           </select>
                       </div>
                    </div>
                    
                    <div class="mb-3 h-100">
                       <label class="form-label fw-bold text-secondary small text-uppercase">Deskripsi Singkat *</label>
                       <!-- Fallback raw textarea for description -->
                       <textarea class="form-control bg-light border-0 focus-ring shadow-sm p-3 h-100" v-model="formData.description" rows="5" required placeholder="Ringkasan temuan indikator ini..."></textarea>
                    </div>

                     <div class="mb-3">
                      <label class="form-label fw-bold text-secondary small text-uppercase">Tautan Referensi Eksternal / PDF</label>
                      <input type="url" class="form-control bg-light border-0 focus-ring shadow-sm" v-model="formData.link" placeholder="Tautan menuju artikel BPS lengkap atau file dokumen">
                    </div>
                 </div>

                 <div class="col-md-5">
                    <div class="card border-0 shadow-sm bg-light rounded-3 mb-3">
                       <div class="card-body">
                          <h6 class="fw-bold mb-3 border-bottom pb-2">Kategori & Metadata</h6>
                          <div class="mb-3">
                              <label class="form-label text-secondary small text-uppercase">Nama Regional</label>
                              <input type="text" class="form-control mb-2 border-0 shadow-sm focus-ring" v-model="formData.region_name" placeholder="Misal: Provinsi Kaltara" required>
                          </div>
                           <div class="mb-3">
                              <label class="form-label text-secondary small text-uppercase">ID Regional (Opsional)</label>
                              <input type="number" class="form-control mb-2 border-0 shadow-sm focus-ring" v-model="formData.region">
                          </div>

                          <div class="row g-2 mb-3">
                             <div class="col-6">
                                <label class="form-label text-secondary small text-uppercase">Topik Macro</label>
                                <input type="text" class="form-control border-0 shadow-sm focus-ring" v-model="formData.topic" placeholder="Misal: Ekonomi">
                             </div>
                             <div class="col-6">
                                <label class="form-label text-secondary small text-uppercase">Pita / Badge Highlight</label>
                                <input type="text" class="form-control border-0 shadow-sm focus-ring" v-model="formData.badge" placeholder="Contoh: Terupdate">
                             </div>
                          </div>
                          
                          <div>
                              <p class="mb-1 text-secondary small text-uppercase">Views Metrics</p>
                              <span class="badge bg-white text-dark border"><i class="bi bi-eye-fill text-primary"></i> {{ formData.views || 0 }} Total Views</span>
                          </div>
                       </div>
                    </div>

                    <div class="card border-0 shadow-sm bg-light rounded-3">
                       <div class="card-body">
                          <label class="form-label fw-bold text-secondary small text-uppercase">Sumber Ilustrasi Gambar</label>

                          <ul class="nav nav-pills nav-fill mb-3 bg-white p-1 rounded-3 shadow-sm" style="font-size: 0.85rem;" role="tablist">
                             <li class="nav-item" role="presentation">
                               <button class="nav-link py-1" :class="{'active': imageInputMode === 'url'}" @click="imageInputMode = 'url'" type="button">Link URL</button>
                             </li>
                             <li class="nav-item" role="presentation">
                               <button class="nav-link py-1" :class="{'active': imageInputMode === 'file'}" @click="imageInputMode = 'file'" type="button">Upload File</button>
                             </li>
                          </ul>

                          <div v-if="imageInputMode === 'url'">
                             <input type="url" class="form-control mb-3 border-0 shadow-sm focus-ring" v-model="formData.image" placeholder="URL format JPG/PNG...">
                             
                             <div class="text-center rounded-3 overflow-hidden border border-white border-3 shadow-sm bg-white mt-3" style="height: 140px;">
                                 <img v-if="(formData.image instanceof File ? uploadPreviewUrl : formData.image) && previewValid" 
                                      :src="formData.image instanceof File ? uploadPreviewUrl : formData.image" 
                                      class="w-100 h-100 obj-fit-cover" 
                                      @error="previewValid = false" 
                                      @load="previewValid = true">
                                 <div v-else class="d-flex align-items-center justify-content-center h-100 text-muted flex-column">
                                   <i class="bi bi-file-image opacity-50 mb-2" style="font-size: 2.2rem;"></i>
                                   <small class="opacity-75">No Preview</small>
                                 </div>
                             </div>
                          </div>
                          <div v-else>
                             <div class="dropzone-area text-center p-4 rounded-3 border border-2 border-dashed position-relative transition-all" 
                                  :class="{'border-primary bg-primary bg-opacity-10': isDragging, 'border-secondary border-opacity-25 bg-light': !isDragging}"
                                  @dragover.prevent="isDragging = true" 
                                  @dragleave.prevent="isDragging = false" 
                                  @drop.prevent="handleDrop"
                                  @click="triggerFileInput">
                                <input type="file" ref="fileInput" class="d-none" accept="image/png, image/jpeg, image/webp" @change="handleFileUpload">
                                
                                <div v-if="formData.image && previewValid" class="position-absolute top-0 start-0 w-100 h-100 p-1 z-1">
                                    <div class="w-100 h-100 rounded-2 overflow-hidden position-relative group-hover">
                                        <img v-if="(formData.image instanceof File ? uploadPreviewUrl : formData.image) && previewValid" 
                                             :src="formData.image instanceof File ? uploadPreviewUrl : formData.image" 
                                             class="w-100 h-100 obj-fit-cover" 
                                             alt="Preview Image" 
                                             @error="previewValid = false" 
                                             @load="previewValid = true">
                                        <div class="position-absolute inset-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-opacity">
                                            <span class="text-white small fw-medium"><i class="bi bi-pencil-square me-1"></i>Ganti Gambar</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                                    <i class="bi bi-cloud-arrow-up fs-2 text-primary mb-2"></i>
                                    <p class="mb-1 fw-bold text-dark">Klik / Drag Drop</p>
                                    <small class="text-secondary">(Akan dikompres otomatis)</small>
                                </div>
                             </div>
                             <small class="text-danger d-block mt-2" v-if="fileError">{{ fileError }}</small>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
            <div class="modal-footer border-0 bg-light p-3">
              <button type="button" class="btn btn-white fw-medium shadow-sm border" data-bs-dismiss="modal">Tutup</button>
              <button type="submit" class="btn btn-primary fw-medium px-4 shadow-sm" :disabled="isSaving || isCompressing">
                <span v-if="isSaving || isCompressing" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ isCompressing ? 'Mengompres Gambar...' : isSaving ? 'Menyimpan...' : 'Simpan Data Insight' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { fetchAuth } from '@/utils/auth.js';
import { API_ENDPOINTS } from '@/config/api.js';
import { compressImage } from '@/utils/image.js';
import { Modal } from 'bootstrap';

let bsModal = null;
const insights = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const isCompressing = ref(false);
const modalMode = ref('add');
const selectedId = ref(null);
const previewValid = ref(true);
const imageInputMode = ref('url');
const fileError = ref('');
const isDragging = ref(false);
const fileInput = ref(null);

const formData = reactive({
  title: '',
  slug: '',
  description: '',
  image: '',
  link: '',
  status: 'published',
  region: 0,
  region_name: '',
  badge: '',
  topic: '',
  views: 0
});

const uploadPreviewUrl = ref(null);

watch(() => formData.image, () => {
   previewValid.value = true;
});

watch(() => formData.title, () => {
    if(modalMode.value === 'add') {
        formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
});

const initModal = () => {
  const modalEl = document.getElementById('insightModal');
  if(modalEl) bsModal = new Modal(modalEl);
};

const triggerFileInput = () => {
    if (fileInput.value) fileInput.value.click();
};

const handleDrop = (event) => {
    isDragging.value = false;
    const files = event.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) processFile(file);
};

const processFile = async (file) => {
  fileError.value = '';
  
  if (!file) return;

  if (file.size > 5242880) { 
    fileError.value = 'File terlalu besar (Maksimal 5 MB sebelum kompresi).';
    return;
  }

  if (!file.type.startsWith('image/')) {
    fileError.value = 'File harus berupa gambar (JPG/PNG/WEBP).';
    return;
  }

  isCompressing.value = true;
  try {
     const compressedFile = await compressImage(file, 600, 600, 0.5);
     formData.image = compressedFile;
     
     if (uploadPreviewUrl.value) {
         URL.revokeObjectURL(uploadPreviewUrl.value);
     }
     uploadPreviewUrl.value = URL.createObjectURL(compressedFile);
     previewValid.value = true;
  } catch(e) {
     fileError.value = 'Gagal memproses gambar.';
     console.error(e);
  } finally {
     isCompressing.value = false;
  }
};

const fetchInsights = async () => {
  isLoading.value = true;
  try {
    const res = await fetchAuth(API_ENDPOINTS.INSIGHT);
    if(res.ok) {
        const body = await res.json();
        insights.value = Array.isArray(body) ? body : (body.data || []);
    } else {
        alert('Gagal memuat data insight dari API.');
    }
  } catch(e) {
    console.error('API Error:', e);
  } finally {
    isLoading.value = false;
  }
};

const openModal = (mode, item = null) => {
  modalMode.value = mode;
  previewValid.value = true;
  fileError.value = '';
  
  if (uploadPreviewUrl.value) {
      URL.revokeObjectURL(uploadPreviewUrl.value);
      uploadPreviewUrl.value = null;
  }

  if(mode === 'edit' && item) {
      selectedId.value = item.id;
      Object.assign(formData, item);
      formData.status = item.status || 'published';
      
      if (formData.image && typeof formData.image === 'string' && !formData.image.startsWith('data:image')) {
          imageInputMode.value = 'url';
      } else if (formData.image && (formData.image instanceof File || formData.image instanceof Blob || formData.image.startsWith('data:image'))) {
          imageInputMode.value = 'file';
          if (formData.image instanceof File || formData.image instanceof Blob) {
              uploadPreviewUrl.value = URL.createObjectURL(formData.image);
          } else if (formData.image.startsWith('data:image')) {
              uploadPreviewUrl.value = formData.image; 
          }
      } else {
          imageInputMode.value = 'url'; 
      }
  } else {
      selectedId.value = null;
      Object.assign(formData, {
          title: '', slug: '', description: '', image: '', link: '', status: 'published', region: null, region_name: '', badge: '', topic: '', views: 0
      });
      imageInputMode.value = 'url'; 
  }
  
  if(bsModal) bsModal.show();
};

const saveInsight = async () => {
  isSaving.value = true;
  const method = modalMode.value === 'add' ? 'POST' : 'PUT';
  const url = modalMode.value === 'add' ? API_ENDPOINTS.INSIGHT : API_ENDPOINTS.INSIGHT_DETAIL(selectedId.value);
  
  let fetchOptions = {
      method: method
  };

  if (formData.image instanceof File || formData.image instanceof Blob) {
      const payloadData = new FormData();
      Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== undefined) {
              payloadData.append(key, formData[key]);
          }
      });
      
      fetchOptions.body = payloadData;
  } else {
      fetchOptions.body = JSON.stringify({ ...formData });
  }

  try {
    const res = await fetchAuth(url, fetchOptions);
    if(res.ok) {
        if(bsModal) bsModal.hide();
        fetchInsights();
    } else {
        const err = await res.json();
        alert('Gagal mengeksekusi request: ' + (err.message || res.statusText));
    }
  } catch(e) {
    console.error(e);
    alert('Terjadi kesalahan koneksi jaringan.');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (item) => {
    if(confirm(`Hentikan tayang Insight: "${item.title}"?`)) {
        try {
            const res = await fetchAuth(API_ENDPOINTS.INSIGHT_DETAIL(item.id), { method: 'DELETE' });
            if(res.ok) {
                fetchInsights();
            } else {
                alert('Gagal memusnahkan insight.');
            }
        } catch {
            alert('Kesalahan jaringan saat menghapus');
        }
    }
};

onMounted(() => {
  fetchInsights();
  initModal();
});
</script>

<style scoped>
.insight-wrapper {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.obj-fit-cover {
  object-fit: cover;
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
  padding-top: 1.2rem;
  padding-bottom: 1.2rem;
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

.dropzone-area {
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.dropzone-area:hover {
    border-color: var(--primary-color) !important;
    background-color: rgba(245, 158, 11, 0.05) !important;
}

.hover-opacity-100 {
    opacity: 0;
}
.group-hover:hover .hover-opacity-100 {
    opacity: 1;
}

.transition-opacity {
    transition: opacity 0.2s ease-in-out;
}
.transition-all {
    transition: all 0.2s ease-in-out;
}
.inset-0 {
    top: 0; left: 0; right: 0; bottom: 0;
}
</style>
