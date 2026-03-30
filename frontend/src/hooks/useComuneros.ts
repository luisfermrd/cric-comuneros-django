import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as comuneroService from '../services/comunero.service';

export function useComuneros(params?: Record<string, string | number | boolean>) {
  return useQuery({ queryKey: ['comuneros', params], queryFn: () => comuneroService.getComuneros(params) });
}

export function useComunero(id: number) {
  return useQuery({ queryKey: ['comuneros', id], queryFn: () => comuneroService.getComunero(id), enabled: !!id });
}

export function useCreateComunero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: comuneroService.createComunero,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['comuneros'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
}

export function useUpdateComunero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Record<string, unknown>) => comuneroService.updateComunero(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['comuneros'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
}

export function useDeleteComunero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: comuneroService.deleteComunero,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['comuneros'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
}

export function useStats(territoryId?: number) {
  return useQuery({ queryKey: ['stats', territoryId], queryFn: () => comuneroService.getStats(territoryId) });
}
