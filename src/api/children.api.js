/**
 * src/api/children.api.js
 * Child profiles CRUD
 */
import api from './client';

export const getChildren       = ()           => api.get('/children');
export const getChild          = (id)         => api.get(`/children/${id}`);
export const createChild       = (data)       => api.post('/children', data);
export const updateChild       = (id, data)   => api.put(`/children/${id}`, data);
export const deleteChild       = (id)         => api.delete(`/children/${id}`);
