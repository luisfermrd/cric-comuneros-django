import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Group, Button, TextInput, Paper, Table, ActionIcon, Pagination, Modal, Text, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch, IconPencil, IconTrash } from '@tabler/icons-react';
import { useTerritories, useDeleteTerritory } from '../hooks/useTerritories';
import { useAuth } from '../providers/AuthProvider';
import { Territory } from '../types';

export default function Territories() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Territory | null>(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const deleteMutation = useDeleteTerritory();

  const params: Record<string, string | number> = { page };
  if (search) params.search = search;

  const { data, isLoading } = useTerritories(params);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        notifications.show({ title: 'Eliminado', message: 'Territorio eliminado correctamente', color: 'green' });
        setDeleteTarget(null);
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { error?: string } } };
        notifications.show({ title: 'Error', message: error.response?.data?.error || 'No se pudo eliminar', color: 'red' });
        setDeleteTarget(null);
      },
    });
  };

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Territorios</Title>
        <Button leftSection={<IconPlus size={16} />} color="cric" onClick={() => navigate('/territories/new')}>
          Nuevo Territorio
        </Button>
      </Group>

      <Paper radius="md" withBorder>
        <Group p="md">
          <TextInput
            placeholder="Buscar por nombre..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            w={300}
          />
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Descripcion</Table.Th>
              <Table.Th>Creado</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr><Table.Td colSpan={4} ta="center" py="xl">Cargando...</Table.Td></Table.Tr>
            ) : data?.results.length === 0 ? (
              <Table.Tr><Table.Td colSpan={4} ta="center" py="xl" c="dimmed">No se encontraron resultados</Table.Td></Table.Tr>
            ) : (
              data?.results.map((t) => (
                <Table.Tr key={t.id}>
                  <Table.Td>{t.name}</Table.Td>
                  <Table.Td>{t.description}</Table.Td>
                  <Table.Td>{new Date(t.created_at).toLocaleDateString('es-CO')}</Table.Td>
                  <Table.Td>
                    {isAdmin && (
                      <Group gap={4}>
                        <ActionIcon variant="subtle" color="cric" onClick={() => navigate(`/territories/${t.id}/edit`)}>
                          <IconPencil size={16} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => setDeleteTarget(t)}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>

        {data && data.count > 10 && (
          <Group justify="center" p="md">
            <Pagination total={Math.ceil(data.count / 10)} value={page} onChange={setPage} color="cric" />
          </Group>
        )}
      </Paper>

      <Modal opened={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Eliminar territorio" centered>
        <Stack>
          <Text size="sm">Esta seguro de eliminar <strong>{deleteTarget?.name}</strong>? Esta accion no se puede deshacer.</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button color="red" onClick={handleDelete} loading={deleteMutation.isPending}>Eliminar</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
