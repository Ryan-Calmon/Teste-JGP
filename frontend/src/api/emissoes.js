import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
} );

export const getEmissoes = async (params = {}) => {
  const response = await api.get('/emissoes', { params });
  return response.data;
};

export const getEmissaoById = async (id) => {
  const response = await api.get(`/emissoes/${id}`);
  return response.data;
};

export const updateEmissao = async (id, data) => {
  const response = await api.put(`/emissoes/${id}`, data);
  return response.data;
};

export const getTipos = async () => {
  const response = await api.get('/emissoes/tipos');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getHistorico = async (id) => {
  const response = await api.get(`/emissoes/${id}/historico`);
  return response.data;
};
export const getEvolucaoMensal = async () => {
  const response = await api.get('/stats/evolucao-mensal');
  return response.data;
};
export default api;
