/**
 * src/api/records.api.js
 */
import api from './client';

export const getRecords    = (childId)         => api.get(`/children/${childId}/records`);
export const uploadRecord  = (childId, data)   => api.post(`/children/${childId}/records`, data);
export const deleteRecord  = (childId, id)     => api.delete(`/children/${childId}/records/${id}`);

// ─── Multipart file upload ─────────────────────────────────────────────────
export const uploadRecordFile = async (childId, file, meta) => {
  const form = new FormData();
  form.append('file', file);
  form.append('meta', JSON.stringify(meta));
  const { getToken } = await import('./client');
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/children/${childId}/records/upload`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form,
    }
  );
  if (!res.ok) throw await res.json();
  return res.json();
};
