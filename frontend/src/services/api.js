import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const saveAuthSession = ({ token, user }) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  window.dispatchEvent(new Event('auth-change'))
}

export const clearAuthSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.dispatchEvent(new Event('auth-change'))
}

// ==================== Add JWT Token to Requests ====================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ==================== Projects ====================
export const projectsAPI = {
  // Get all projects with nested user stories and tasks
  getAll: (params) => api.get('/projects', { params }),
  
  // Get project by ID with user stories and tasks
  getById: (id) => api.get(`/projects/${id}`),

  // Get stories under a project
  getStories: (id, params) => api.get(`/projects/${id}/stories`, { params }),
  
  // Create new project
  create: (data) => api.post('/projects', data),
  
  // Update project
  update: (id, data) => api.patch(`/projects/${id}`, data),
  
  // Delete project
  delete: (id) => api.delete(`/projects/${id}`),
}

// ==================== Auth ====================
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

// ==================== User Stories ====================
export const userStoriesAPI = {
  // Get user stories by project ID
  getByProject: (projectId, params) => api.get('/user-stories', {
    params: { projectId, ...params },
  }),

  // Get tasks under a story
  getTasks: (id, params) => api.get(`/stories/${id}/tasks`, {
    params,
  }),

  // Legacy flat endpoint
  getByProjectLegacy: (projectId) => api.get('/user-stories', {
    params: { projectId },
  }),
  
  // Create new user story
  create: (data) => api.post('/user-stories', data),
  
  // Update user story
  update: (id, data) => api.patch(`/user-stories/${id}`, data),
  
  // Delete user story
  delete: (id) => api.delete(`/user-stories/${id}`),
}

// ==================== Tasks ====================
export const tasksAPI = {
  // Get tasks by user story ID
  getByStory: (storyId, params) => api.get('/tasks', {
    params: { storyId, ...params },
  }),
  
  // Create new task
  create: (data) => api.post('/tasks', data),
  
  // Update task
  update: (id, data) => api.patch(`/tasks/${id}`, data),
  
  // Delete task
  delete: (id) => api.delete(`/tasks/${id}`),
}

// ==================== Error Handling & Response Transformation ====================
api.interceptors.response.use(
  (response) => {
    // If response has the standard { success, message, data, ... } structure, extract the data
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      // Return response with the nested data as the main data property
      return {
        ...response,
        data: response.data.data,
        meta: response.data.meta || response.data.pagination,
        pagination: response.data.pagination,
        message: response.data.message,
      }
    }
    // For other response structures, return as-is
    return response
  },
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.startsWith('/auth/')) {
      clearAuthSession()
    }

    if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data)
    } else if (error.response?.status === 400) {
      console.error('Validation error:', error.response.data)
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }
    return Promise.reject(error)
  },
)

export default api
