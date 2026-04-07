export const getAuthToken = () => {
  return localStorage.getItem('admin_token');
};

export const setAuthToken = (token) => {
  localStorage.setItem('admin_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('admin_token');
};

export const getAuthUser = () => {
  const user = localStorage.getItem('admin_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setAuthUser = (user) => {
  localStorage.setItem('admin_user', JSON.stringify(user));
};

export const removeAuthUser = () => {
  localStorage.removeItem('admin_user');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const fetchAuth = async (url, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    ...options.headers
  };

  // Only set Content-Type if it's not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    removeAuthToken();
    removeAuthUser();
    window.location.href = '/admin/login';
  }

  return response;
};
