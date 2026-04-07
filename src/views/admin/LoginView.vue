<template>
  <div class="login-wrapper d-flex align-items-center justify-content-center">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>

    <div class="login-card shadow-lg">
      <div class="card-body p-sm-5 p-4">
        <div class="text-center mb-5">
          <div class="logo-box mx-auto mb-3 shadow-sm">
            <i class="bi bi-shield-lock-fill text-amber"></i>
          </div>
          <h3 class="fw-bold mb-1 text-dark">Welcome Back</h3>
          <p class="text-muted">Kasulampua Portal Admin Panel</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="form-label text-secondary fw-semibold small text-uppercase tracking-wide">Username</label>
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-light border-end-0 px-3">
                <i class="bi bi-person text-muted"></i>
              </span>
              <input 
                type="text" 
                class="form-control bg-light border-start-0 ps-0 fs-6" 
                v-model="form.username" 
                placeholder="Enter admin username"
                required
              >
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label text-secondary fw-semibold small text-uppercase tracking-wide">Password</label>
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-light border-end-0 px-3">
                <i class="bi bi-lock text-muted"></i>
              </span>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="form-control bg-light border-start-0 border-end-0 ps-0 fs-6" 
                v-model="form.password" 
                placeholder="Enter password"
                required
              >
              <span class="input-group-text bg-light border-start-0 px-3 cursor-pointer" @click="showPassword = !showPassword">
                <i class="bi text-muted" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </span>
            </div>
          </div>

          <transition name="shake">
            <div v-if="errorMsg" class="alert alert-danger py-2 border-0 rounded-3 mb-4 d-flex align-items-center">
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              <small class="fw-medium">{{ errorMsg }}</small>
            </div>
          </transition>

          <button 
            type="submit" 
            class="btn btn-primary w-100 py-3 mt-2 rounded-3 fw-bold login-btn text-white fs-6"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ isLoading ? 'Authenticating...' : 'Secure Sign In' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { setAuthToken, setAuthUser } from '@/utils/auth.js';
import { API_ENDPOINTS } from '@/config/api.js';

const router = useRouter();
const form = reactive({
  username: '',
  password: ''
});
const showPassword = ref(false);
const isLoading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = '';

  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        us_username: form.username,
        us_password: form.password
      })
    });

    const body = await response.json();

    if (response.ok) {
       const token = body.access_token || body.token || (body.data && body.data.token);
       if(token) {
           setAuthToken(token);
           const user = body.user || body.data?.user || { us_name: form.username, us_username: form.username }; 
           setAuthUser(user);
           router.push('/admin/dashboard');
       } else {
           setAuthToken('dummy-token-for-dev-fallback');
           setAuthUser({ us_name: form.username, us_username: form.username });
           router.push('/admin/dashboard');
       }
    } else {
       errorMsg.value = body.message || 'Invalid username or password.';
    }

  } catch (error) {
    console.error('Login error:', error);
    errorMsg.value = 'Failed to connect to the authentication server.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.tracking-wide {
  letter-spacing: 0.05em;
}

.login-wrapper {
  min-height: 100vh;
  background: #e2e8f0;
  position: relative;
  overflow: hidden;
}

.shape {
  position: absolute;
  filter: blur(60px);
  z-index: 1;
  border-radius: 50%;
  animation: float 10s infinite;
  opacity: 0.7;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
  bottom: -50px;
  right: -50px;
  animation-delay: -4s;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
  top: 30%;
  left: 20%;
  animation-delay: -7s;
}

@keyframes float {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(40px, 40px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: 1.5rem;
  z-index: 2;
  margin: 1rem;
}

.logo-box {
  width: 65px;
  height: 65px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  transform: rotate(-10deg);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.login-card:hover .logo-box {
  transform: rotate(0deg) scale(1.05);
}

.form-control, .input-group-text {
  border-color: #cbd5e1;
  color: #1e293b;
  box-shadow: none;
}

.form-control::placeholder {
  color: #94a3b8;
}

.input-group {
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  overflow: hidden;
}

.input-group:focus-within {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.input-group:focus-within .input-group-text,
.input-group:focus-within .form-control {
  border-color: #f59e0b;
  background-color: #fff !important;
}

.cursor-pointer {
  cursor: pointer;
}

.login-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #d97706 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(217, 119, 6, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* Error alert shake animation */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake-enter-active {
  animation: shake 0.5s;
}
</style>
