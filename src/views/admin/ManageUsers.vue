<template>
  <div class="users-wrapper">
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light">
      <div>
        <h3 class="fw-bold mb-1 text-dark">Kelola Data Users</h3>
        <p class="text-muted mb-0 small text-uppercase tracking-wider">Manajemen Hak Akses dan Pengguna</p>
      </div>
      <div>
        <button class="btn btn-primary shadow-sm fw-medium d-flex align-items-center gap-2 rounded-3 py-2 px-3" @click="openModal('add')">
          <i class="bi bi-person-plus-fill"></i> Tambah User Baru
        </button>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div class="card-header bg-transparent border-bottom p-4 d-flex justify-content-between align-items-center">
        <h6 class="mb-0 fw-bold text-dark"><i class="bi bi-table me-2 text-primary"></i> Daftar Pengguna Aktif</h6>
        <!-- Simple Search Mock -->
        <div class="input-group input-group-sm" style="max-width: 250px;">
          <span class="input-group-text bg-light border-end-0 px-3"><i class="bi bi-search text-muted"></i></span>
          <input type="text" class="form-control bg-light border-start-0 ps-0" placeholder="Cari nama atau username...">
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 custom-table">
            <thead class="bg-light text-secondary">
              <tr>
                <th class="ps-4" style="width: 60px;">No</th>
                <th>User Profile</th>
                <th>Username / Email</th>
                <th class="text-center" style="width: 150px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="4" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2 text-muted fw-medium mb-0">Memuat data pengguna...</p>
                </td>
              </tr>
              <tr v-else-if="users.length === 0">
                 <td colspan="4" class="text-center py-5 text-muted">
                   <div class="display-3 text-secondary opacity-25 mb-3"><i class="bi bi-inbox"></i></div>
                   <p class="fw-medium">Belum ada data pengguna ditemukan.</p>
                 </td>
              </tr>
              <tr v-else v-for="(user, index) in users" :key="user.id || user.us_id">
                <td class="ps-4 fw-medium text-muted">{{ index + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div class="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5">
                      {{ (user.us_name || user.us_username || '?').substring(0,1).toUpperCase() }}
                    </div>
                    <div>
                      <h6 class="fw-bold text-dark mb-0">{{ user.us_name || '-' }}</h6>
                      <small class="badge bg-success-subtle text-success border border-success border-opacity-25 mt-1">Aktif</small>
                    </div>
                  </div>
                </td>
                <td>
                  <p class="mb-0 text-dark fw-medium">@{{ user.us_username }}</p>
                  <small class="text-muted"><i class="bi bi-envelope me-1"></i>{{ user.us_email || 'Tidak ada email' }}</small>
                </td>
                <td class="text-center pe-4">
                  <div class="btn-group shadow-sm">
                    <button class="btn btn-sm btn-light border bg-white px-2" @click="openModal('edit', user)" title="Edit">
                      <i class="bi bi-pencil align-middle text-primary"></i>
                    </button>
                    <button class="btn btn-sm btn-light border bg-white px-2" @click="confirmDelete(user)" title="Hapus">
                      <i class="bi bi-trash text-danger align-middle"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Pagination Footer -->
      <div class="card-footer bg-transparent p-3 border-top d-flex justify-content-between align-items-center">
        <small class="text-muted fw-medium">Menampilkan <b>{{ users.length }}</b> data</small>
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item disabled"><a class="page-link shadow-sm border-0 bg-white ms-1 rounded" href="#">Prev</a></li>
          <li class="page-item active"><a class="page-link shadow-sm border-0 ms-1 rounded" href="#">1</a></li>
          <li class="page-item disabled"><a class="page-link shadow-sm border-0 bg-white ms-1 rounded" href="#">Next</a></li>
        </ul>
      </div>
    </div>

    <!-- User Modal (Create/Edit) -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header bg-light border-0 p-4 pb-3">
            <h5 class="modal-title fw-bold text-dark"><i :class="modalMode === 'edit' ? 'bi-pencil-square' : 'bi-person-plus'" class="bi me-2 text-primary"></i>{{ modalMode === 'edit' ? 'Edit Data Pengguna' : 'Registrasi User Baru' }}</h5>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="saveUser">
            <div class="modal-body p-4 pt-2">
              <div class="row g-3">
                 <div class="col-12">
                  <label class="form-label fw-bold text-secondary small text-uppercase">Nama Lengkap *</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-person-vcard"></i></span>
                    <input type="text" class="form-control bg-light border-start-0 ps-0 focus-ring" v-model="formData.us_name" required placeholder="John Doe">
                  </div>
                </div>
                
                <div class="col-12">
                  <label class="form-label fw-bold text-secondary small text-uppercase">Username *</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted">@</span>
                    <input type="text" class="form-control bg-light border-start-0 ps-0 focus-ring" v-model="formData.us_username" required placeholder="username_unik">
                  </div>
                </div>
                
                <div class="col-12">
                  <label class="form-label fw-bold text-secondary small text-uppercase">Alamat Email</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-envelope"></i></span>
                    <input type="email" class="form-control bg-light border-start-0 ps-0 focus-ring" v-model="formData.us_email" placeholder="john@example.com">
                  </div>
                </div>

                <div class="col-12" v-if="modalMode === 'add'">
                  <label class="form-label fw-bold text-secondary small text-uppercase">Password Akses *</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-shield-lock"></i></span>
                    <input type="text" class="form-control bg-light border-start-0 ps-0 focus-ring" v-model="formData.us_password" required placeholder="Minimal 6 karakter" autocomplete="off">
                  </div>
                </div>

                <div class="col-12" v-if="modalMode === 'edit'">
                  <label class="form-label fw-bold text-secondary small text-uppercase">Update Password</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 text-muted"><i class="bi bi-shield-lock"></i></span>
                    <input type="text" class="form-control bg-light border-start-0 ps-0 focus-ring" v-model="formData.us_password" placeholder="(Opsional) Kosongkan jika tidak berubah!" autocomplete="off">
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 bg-light p-3">
              <button type="button" class="btn btn-white fw-medium shadow-sm border" data-bs-dismiss="modal">Batalkan</button>
              <button type="submit" class="btn btn-primary fw-medium px-4 shadow-sm" :disabled="isSaving">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ isSaving ? 'Memproses...' : (modalMode === 'edit' ? 'Update Data' : 'Simpan User') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { fetchAuth } from '@/utils/auth.js';
import { API_ENDPOINTS } from '@/config/api.js';
import { Modal } from 'bootstrap';

let bsModal = null;
const users = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const modalMode = ref('add');
const selectedUserId = ref(null);

const formData = reactive({
  us_name: '',
  us_username: '',
  us_email: '',
  us_password: ''
});

const initModal = () => {
  const modalEl = document.getElementById('userModal');
  if (modalEl) bsModal = new Modal(modalEl);
};

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const res = await fetchAuth(API_ENDPOINTS.USERS);
    if(res.ok) {
        const body = await res.json();
        users.value = Array.isArray(body) ? body : (body.data || []);
    } else {
        alert('Ups! Gagal memuat daftar pengguna.');
    }
  } catch(e) {
    console.warn('Error koneksi API:', e);
  } finally {
    isLoading.value = false;
  }
};

const openModal = (mode, user = null) => {
  modalMode.value = mode;
  if(mode === 'edit' && user) {
      selectedUserId.value = user.id || user.us_id;
      formData.us_name = user.us_name || '';
      formData.us_username = user.us_username || '';
      formData.us_email = user.us_email || '';
      formData.us_password = '';
  } else {
      selectedUserId.value = null;
      formData.us_name = '';
      formData.us_username = '';
      formData.us_email = '';
      formData.us_password = '';
  }
  
  if(bsModal) bsModal.show();
};

const saveUser = async () => {
  isSaving.value = true;
  
  const url = modalMode.value === 'add' ? API_ENDPOINTS.USERS : API_ENDPOINTS.USER_DETAIL(selectedUserId.value);
  const method = modalMode.value === 'add' ? 'POST' : 'PUT';
  
  const payload = { ...formData };
  if(modalMode.value === 'edit' && !payload.us_password) {
      delete payload.us_password;
  }

  try {
    const res = await fetchAuth(url, {
        method,
        body: JSON.stringify(payload)
    });
    
    if(res.ok) {
        if(bsModal) bsModal.hide();
        fetchUsers();
    } else {
        const err = await res.json();
        alert('Gagal menyimpan data akun: ' + (err.message || res.statusText));
    }
  } catch(e) {
    console.error(e);
    alert('Jaringan Error saat menyimpan data.');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (user) => {
    const id = user.id || user.us_id;
    if(confirm(`WARNING!\n\nApakah anda sangat yakin ingin menghapus akses untuk pengguna: @${user.us_username}?`)) {
        try {
            const res = await fetchAuth(API_ENDPOINTS.USER_DETAIL(id), { method: 'DELETE' });
            if(res.ok) {
                fetchUsers();
            } else {
                alert('Gagal menghapus data dari server.');
            }
        } catch(e) {
            console.error(e);
            alert('Kesalahan jaringan saat menghapus');
        }
    }
};

onMounted(() => {
  fetchUsers();
  initModal();
});
</script>

<style scoped>
.users-wrapper {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.avatar-sm {
  width: 44px;
  height: 44px;
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

.btn-group .btn {
  padding: 0.35rem 0.6rem;
}
.btn-group .btn:hover {
  background-color: #f8fafc !important;
  color: #0f172a;
}

.focus-ring {
  transition: all 0.2s;
  border: 1px solid transparent; 
}

.input-group:focus-within {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  border-radius: 0.375rem;
}
.input-group:focus-within .form-control,
.input-group:focus-within .input-group-text {
  background-color: #fff !important;
  border-color: #3b82f6 !important;
}

.form-control, .input-group-text {
  border-color: #e2e8f0;
}
</style>
