import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

// Request interceptor — attach demo auth token
api.interceptors.request.use(async (config) => {
    const savedUser = localStorage.getItem('demo_user');
    if (savedUser) {
        config.headers.Authorization = 'Bearer demo-token';
    }
    return config;
});


// Response interceptor — normalize errors
api.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const message = err.response?.data?.message || 'Network error. Please try again.';
        const errors = err.response?.data?.errors || [];
        return Promise.reject({ message, errors, status: err.response?.status });
    }
);

export const submitApplication = (data) => api.post('/applications', data);
export const getApplications = (params = {}) => api.get('/applications', { params });
export const getApplicationById = (id) => api.get(`/applications/${id}`);
export const updateStatus = (id, status) => api.patch(`/applications/${id}/status`, { status });

// Attendance
export const toggleAttendance = (id) => api.post(`/attendance/toggle/${id}`);
export const getAttendanceLogs = (id, params = {}) => api.get(`/attendance/${id}/logs`, { params });
export const getAttendanceStatus = (id) => api.get(`/attendance/${id}/status`);

