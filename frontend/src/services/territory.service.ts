import api from './api';
import { Territory, PaginatedResponse } from '../types';

export async function getTerritories(params?: Record<string, string | number>) {
  const { data } = await api.get<PaginatedResponse<Territory>>('/territories/', { params });
  return data;
}

export async function getTerritory(id: number) {
  const { data } = await api.get<Territory>(`/territories/${id}/`);
  return data;
}

export async function createTerritory(input: { name: string; description?: string }) {
  const { data } = await api.post<Territory>('/territories/', input);
  return data;
}

export async function updateTerritory(id: number, input: { name?: string; description?: string }) {
  const { data } = await api.put<Territory>(`/territories/${id}/`, input);
  return data;
}

export async function deleteTerritory(id: number) {
  await api.delete(`/territories/${id}/`);
}
