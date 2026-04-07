<template>
  <div class="berita-wrapper">
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
      <div>
        <h3 class="fw-bold mb-1 text-dark">Kelola Berita & Publikasi</h3>
        <p class="text-muted mb-0 small text-uppercase tracking-wider">Manajemen Artikel Portal</p>
      </div>
      <div>
        <button class="btn btn-primary shadow-sm fw-medium d-flex align-items-center gap-2 rounded-3 py-2 px-3" @click="openModal('add')">
          <i class="bi bi-journal-plus"></i> Tulis Berita Baru
        </button>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div class="card-header bg-transparent border-bottom p-4 d-flex justify-content-between align-items-center">
        <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-newspaper me-2 text-primary"></i> Daftar Berita</h6>
        <div class="input-group input-group-sm" style="max-width: 250px;">
          <span class="input-group-text bg-light border-end-0 px-3"><i class="bi bi-search text-muted"></i></span>
          <input type="text" class="form-control bg-light border-start-0 ps-0" placeholder="Cari judul berita...">
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead class="bg-light text-secondary">
              <tr>
                <th class="ps-4" style="width: 60px;">No</th>
                <th>Judul & Info</th>
                <th>Status</th>
                <th>Tanggal Upload</th>
                <th class="text-center" style="width: 150px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="5" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                     <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="beritaList.length === 0">
                 <td colspan="5" class="text-center py-5 text-muted">
                   <div class="display-3 text-secondary opacity-25 mb-3"><i class="bi bi-journal-x"></i></div>
                   <p class="fw-medium">Belum ada berita dipublikasikan.</p>
                 </td>
              </tr>
              <tr v-else v-for="(item, index) in beritaList" :key="item.id || item.slug">
                <td class="ps-4 fw-medium text-muted">{{ index + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div v-if="item.image && !imageErrors[item.id]" class="img-thumbnail-wrapper shadow-sm rounded overflow-hidden">
                       <img :src="item.image" alt="Thumbnail" class="obj-fit-cover w-100 h-100" @error="markImageError(item.id)">
                    </div>
                    <div v-else class="img-thumbnail-wrapper shadow-sm rounded bg-primary bg-opacity-10 d-flex align-items-center justify-content-center text-primary">
                       <i class="bi bi-image" style="font-size: 1.25rem;"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold text-dark mb-1 d-inline-block text-truncate" style="max-width: 320px;" :title="item.title">{{ item.title }}</h6>
                      <p class="mb-0 text-muted small"><i class="bi bi-person me-1"></i>{{ item.author || 'Tim Redaksi' }}</p>
                    </div>
                  </div>
                </td>
                <td>
                   <span class="badge rounded-pill fw-medium" :class="(item.status === 'published' || item.status === 'publish') ? 'bg-success-subtle text-success border border-success border-opacity-25' : 'bg-warning-subtle text-warning border border-warning border-opacity-25'">
                     {{ (item.status === 'published' || item.status === 'publish') ? 'Published' : 'Draft' }}
                   </span>
                </td>
                <td>
                  <span class="text-dark fw-medium">{{ formatDate(item.created_at) }}</span>
                </td>
                <td class="text-center pe-4">
                  <div class="btn-group shadow-sm">
                    <button class="btn btn-sm btn-light border bg-white px-2" @click="openModal('edit', item)" title="Edit">
                      <i class="bi bi-pencil align-middle text-primary"></i>
                    </button>
                    <button class="btn btn-sm btn-light border bg-white px-2" @click="confirmDelete(item)" title="Hapus">
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

    <!-- Berita Modal -->
    <div class="modal fade" id="beritaModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header bg-light border-0 p-4 pb-3">
            <h5 class="modal-title fw-bold text-dark"><i :class="modalMode === 'edit' ? 'bi-pencil-square' : 'bi-plus-circle'" class="bi me-2 text-primary"></i>{{ modalMode === 'edit' ? 'Edit Berita' : 'Tulis Berita Baru' }}</h5>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="saveBerita" class="d-flex flex-column" style="max-height: calc(100vh - 120px);">
            <div class="modal-body p-4 pt-3 bg-white" style="overflow-y: auto;">
              <div class="row g-4">
                 <div class="col-md-8">
                    <div class="mb-3">
                      <label class="form-label fw-bold text-secondary small text-uppercase">Judul Berita *</label>
                      <input type="text" class="form-control form-control-lg bg-light border-0 focus-ring shadow-sm" v-model="formData.title" @input="generateSlug" required placeholder="Masukkan judul berita yang menarik...">
                    </div>
                    
                    <div class="mb-3 h-100">
                       <div class="d-flex justify-content-between align-items-end mb-1">
                         <label class="form-label fw-bold text-secondary small text-uppercase mb-0">Isi / Konten Berita *</label>
                         <small class="text-muted"><i class="bi bi-info-circle me-1"></i>Gunakan tag <code>&lt;blockquote&gt;...&lt;/blockquote&gt;</code> untuk kutipan/highlight.</small>
                       </div>
                       <!-- Fallback raw textarea for content -->
                       <textarea class="form-control bg-light border-0 focus-ring shadow-sm p-3 h-100" v-model="formData.content" rows="12" required placeholder="Tuliskan full isi berita HTML/Teks di sini...&#10;&#10;Contoh kutipan:&#10;&lt;blockquote&gt;&quot;Ini adalah kutipan penting.&quot; - Penulis&lt;/blockquote&gt;"></textarea>
                    </div>
                 </div>

                 <div class="col-md-4">
                    <div class="card border-0 shadow-sm bg-light rounded-3 mb-3">
                       <div class="card-body">
                          <label class="form-label fw-bold text-secondary small text-uppercase">Status</label>
                          <select class="form-select border-0 shadow-sm focus-ring mb-3" v-model="formData.status">
                             <option value="draft">Simpan Draft</option>
                             <option value="published">Publish Publik</option>
                          </select>

                          <label class="form-label fw-bold text-secondary small text-uppercase">URL Slug</label>
                          <input type="text" class="form-control mb-3 border-0 shadow-sm focus-ring" v-model="formData.slug" placeholder="otomatis-dari-judul">

                          <label class="form-label fw-bold text-secondary small text-uppercase">Penulis (Author)</label>
                          <input type="text" class="form-control border-0 shadow-sm focus-ring" v-model="formData.author" placeholder="Nama Penulis / Tim">
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
                             <input type="url" class="form-control mb-3 border-0 shadow-sm focus-ring" v-model="formData.image" placeholder="https://domain.com/image.jpg">
                             
                             <div class="text-center rounded-3 overflow-hidden border border-white border-3 shadow-sm bg-white mt-3" style="height: 140px;">
                                 <img v-if="(formData.image instanceof File ? uploadPreviewUrl : formData.image) && previewValid" 
                                      :src="formData.image instanceof File ? uploadPreviewUrl : formData.image" 
                                      class="w-100 h-100 obj-fit-cover" 
                                      alt="Preview Image" 
                                      @error="previewValid = false" 
                                      @load="previewValid = true">
                                 <div v-else class="d-flex align-items-center justify-content-center h-100 text-muted flex-column">
                                   <i class="bi bi-image text-secondary opacity-50 mb-2" style="font-size: 2.5rem;"></i>
                                   <small class="opacity-75">Preview Thumb</small>
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
                                    <p class="mb-1 fw-bold text-dark">Klik atau Drag & Drop gambar kesini</p>
                                    <small class="text-secondary">JPG, PNG, WEBP (Akan dikompres otomatis)</small>
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
              <button type="button" class="btn btn-white fw-medium shadow-sm border" data-bs-dismiss="modal">Batal</button>
              <button type="submit" class="btn btn-primary fw-medium px-4 shadow-sm" :disabled="isSaving || isCompressing">
                <span v-if="isSaving || isCompressing" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ isCompressing ? 'Mengompres Gambar...' : isSaving ? 'Memproses...' : (modalMode === 'edit' ? 'Update & Publikasi' : 'Submit Artikel') }}
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
const beritaList = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const isCompressing = ref(false);
const modalMode = ref('add');
const selectedId = ref(null);
const imageErrors = reactive({});
const previewValid = ref(true);
const imageInputMode = ref('url');
const fileError = ref('');
const isDragging = ref(false);
const fileInput = ref(null);

const formData = reactive({
  title: '',
  slug: '',
  content: '',
  image: '', 
  author: '',
  status: 'published'
});

const uploadPreviewUrl = ref(null); 

watch(() => formData.title, () => {
    if(modalMode.value === 'add') {
        formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
});

watch(() => formData.image, () => {
   previewValid.value = true;
});

const generateSlug = () => {
    if(modalMode.value === 'add') {
        formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
};

const formatDate = (dateString) => {
    if(!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
};

const markImageError = (id) => {
    imageErrors[id] = true;
};

const initModal = () => {
  const modalEl = document.getElementById('beritaModal');
  if (modalEl) bsModal = new Modal(modalEl);
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

const fetchBerita = async () => {
  isLoading.value = true;
  try {
    const res = await fetchAuth(API_ENDPOINTS.BERITA);
    if(res.ok) {
        const body = await res.json();
        beritaList.value = Array.isArray(body) ? body : (body.data || []);
    } else {
        alert('Gagal mengambil data berita dari server.');
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
  imageInputMode.value = 'url';
  fileError.value = '';
  
  if(mode === 'edit' && item) {
      selectedId.value = item.id;
      formData.title = item.title || '';
      formData.slug = item.slug || '';
      formData.content = item.content || '';
      formData.image = item.image || ''; 
      formData.author = item.author || '';
      formData.status = item.status || 'draft';
      
      if (uploadPreviewUrl.value) {
          URL.revokeObjectURL(uploadPreviewUrl.value);
          uploadPreviewUrl.value = null;
      }
      
      if (formData.image) {
          imageInputMode.value = 'url';
      }
  } else {
      selectedId.value = null;
      formData.title = '';
      formData.slug = '';
      formData.content = '';
      formData.image = '';
      formData.author = '';
      formData.status = 'published';
      
      if (uploadPreviewUrl.value) {
          URL.revokeObjectURL(uploadPreviewUrl.value);
          uploadPreviewUrl.value = null;
      }
  }
  
  if(bsModal) bsModal.show();
};

const saveBerita = async () => {
  isSaving.value = true;
  
  const url = modalMode.value === 'add' ? API_ENDPOINTS.BERITA : API_ENDPOINTS.BERITA_DETAIL(selectedId.value);
  const method = modalMode.value === 'add' ? 'POST' : 'PUT';
  
  let fetchOptions = {
      method: method
  };

  if (formData.image instanceof File || formData.image instanceof Blob) {
      const payloadData = new FormData();
      payloadData.append('title', formData.title);
      payloadData.append('slug', formData.slug);
      payloadData.append('content', formData.content);
      payloadData.append('author', formData.author);
      payloadData.append('status', formData.status);
      payloadData.append('image', formData.image);
      
      fetchOptions.body = payloadData;
  } else {
      fetchOptions.body = JSON.stringify({ ...formData });
  }
  
  try {
    const res = await fetchAuth(url, fetchOptions);
    
    if(res.ok) {
        if(bsModal) bsModal.hide();
        fetchBerita();
    } else {
        const err = await res.json();
        alert('Gagal menyimpan berita: ' + (err.message || res.statusText));
    }
  } catch(e) {
    console.error(e);
    alert('Terjadi kesalahan koneksi saat menyimpan.');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (item) => {
    if(confirm(`Yakin ingin membuang artikel: "${item.title}"?`)) {
        try {
            const res = await fetchAuth(API_ENDPOINTS.BERITA_DETAIL(item.id), { method: 'DELETE' });
            if(res.ok) {
                fetchBerita();
            } else {
                alert('Gagal menghapus berita tersebut.');
            }
        } catch(e) {
            console.error(e);
            alert('Kesalahan jaringan saat menghapus');
        }
    }
};

onMounted(() => {
  fetchBerita();
  initModal();
});
</script>

<style scoped>
.berita-wrapper {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.img-thumbnail-wrapper {
  width: 50px;
  height: 40px;
  flex-shrink: 0;
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
  padding-top: 1rem;
  padding-bottom: 1rem;
  vertical-align: middle;
  border-bottom: 1px solid #f1f5f9;
}

.focus-ring {
  transition: all 0.2s;
}

.focus-ring:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
  outline: none;
}

.dropzone-area {
    min-height: 180px;
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
