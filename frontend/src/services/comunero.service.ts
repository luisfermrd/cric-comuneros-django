import api from './api';
import { Comunero, PaginatedResponse, Stats } from '../types';

export async function getComuneros(params?: Record<string, string | number | boolean>) {
  const { data } = await api.get<PaginatedResponse<Comunero>>('/comuneros/', { params });
  return data;
}

export async function getComunero(id: number) {
  const { data } = await api.get<Comunero>(`/comuneros/${id}/`);
  return data;
}

export async function createComunero(input: Record<string, unknown>) {
  const { data } = await api.post<Comunero>('/comuneros/', input);
  return data;
}

export async function updateComunero(id: number, input: Record<string, unknown>) {
  const { data } = await api.put<Comunero>(`/comuneros/${id}/`, input);
  return data;
}

export async function deleteComunero(id: number) {
  await api.delete(`/comuneros/${id}/`);
}

export async function getStats(territoryId?: number) {
  const params = territoryId ? { territory: territoryId } : {};
  const { data } = await api.get<Stats>('/comuneros/stats/', { params });
  return data;
}
