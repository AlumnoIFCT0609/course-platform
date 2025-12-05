// ============================================
// ARCHIVO 6: frontend/lib/api.ts
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Error desconocido',
      }));
      throw new Error(error.error || 'Error en la petición');
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async post(endpoint: string, data?: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse(response);
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

   async patch(endpoint: string, data: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}






export const api = new ApiClient(API_URL);

// Funciones de autenticación
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// Funciones de cursos
export const courseApi = {
  getAll: (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/courses${params ? '?' + params : ''}`);
  },
  
  getById: (id: string) =>
    api.get(`/courses/${id}`),
  
  create: (data: any) =>
    api.post('/courses', data),
  
  update: (id: string, data: any) =>
    api.put(`/courses/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/courses/${id}`),

  publish: (id: string) =>
    api.post(`/courses/${id}/publish`),

};

export const userApi = {
  getAll: (params?: { role?: string; search?: string; page?: number; limit?: number; isActive?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    const query = queryParams.toString();
    return api.get(`/users${query ? '?' + query : ''}`);
  },
  
  getById: (id: string) =>
    api.get(`/users/${id}`),
  
  create: (data: any) =>
    api.post('/users', data),
  
  update: (id: string, data: any) =>
    api.put(`/users/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/users/${id}`),
  
 toggleStatus: (id: string, isActive: boolean) =>
  api.patch(`/users/${id}/toggle-status`, { isActive }),
  
  getStats: () =>
    api.get('/users/stats'),
};

