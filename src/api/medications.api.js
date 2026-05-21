/**
 * src/api/medications.api.js
 */
import api from './client';

export const getMedications    = (childId)           => api.get(`/children/${childId}/medications`);
export const addMedication     = (childId, data)     => api.post(`/children/${childId}/medications`, data);
export const updateMedication  = (childId, id, data) => api.put(`/children/${childId}/medications/${id}`, data);
export const deleteMedication  = (childId, id)       => api.delete(`/children/${childId}/medications/${id}`);
