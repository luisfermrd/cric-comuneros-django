import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as territoryService from '../services/territory.service';

export function useTerritories(params?: Record<string, string | number>) {
  return useQuery({ queryKey: ['territories', params], queryFn: () => territoryService.getTerritories(params) });
}

export function useTerritory(id: number) {
  return useQuery({ queryKey: ['territories', id], queryFn: () => territoryService.getTerritory(id), enabled: !!id });
}

export function useCreateTerritory() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: territoryService.createTerritory, onSuccess: () => qc.invalidateQueries({ queryKey: ['territories'] }) });
}

export function useUpdateTerritory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; name?: string; description?: string }) => territoryService.updateTerritory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['territories'] }),
  });
}

export function useDeleteTerritory() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: territoryService.deleteTerritory, onSuccess: () => qc.invalidateQueries({ queryKey: ['territories'] }) });
}
