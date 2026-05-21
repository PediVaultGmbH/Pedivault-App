/**
 * src/api/appointments.api.js
 */
import api from './client';

export const getAppointments   = (childId)         => api.get(`/children/${childId}/appointments`);
export const bookAppointment   = (childId, data)   => api.post(`/children/${childId}/appointments`, data);
export const updateAppointment = (childId, id, data) => api.put(`/children/${childId}/appointments/${id}`, data);
export const cancelAppointment = (childId, id)     => api.delete(`/children/${childId}/appointments/${id}`);
