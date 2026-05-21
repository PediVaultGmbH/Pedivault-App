/**
 * src/api/growth.api.js
 */
import api from './client';

export const getGrowthEntries = (childId)       => api.get(`/children/${childId}/growth`);
export const addGrowthEntry   = (childId, data) => api.post(`/children/${childId}/growth`, data);
export const deleteGrowthEntry = (childId, id)  => api.delete(`/children/${childId}/growth/${id}`);
