/**
 * src/api/vaccines.api.js
 */
import api from './client';

export const getVaccineRecords  = (childId)         => api.get(`/children/${childId}/vaccines`);
export const logVaccine         = (childId, data)   => api.post(`/children/${childId}/vaccines`, data);
export const updateVaccineRecord = (childId, id, data) => api.put(`/children/${childId}/vaccines/${id}`, data);
export const deleteVaccineRecord = (childId, id)    => api.delete(`/children/${childId}/vaccines/${id}`);
