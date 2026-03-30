import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Group, Button, TextInput, Select, Paper, Table, Badge, ActionIcon, Pagination, Modal, Text, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch, IconPencil, IconTrash, IconEye } from '@tabler/icons-react';
import { useComuneros, useDeleteComunero } from '../hooks/useComuneros';
import { useTerritories } from '../hooks/useTerritories';
import { useAuth } from '../providers/AuthProvider';
import { Comunero } from '../types';

export default function Comuneros() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [territory, setTerritory] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<string | null>(null);
  const [sex, setSex] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Comunero | null>(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const deleteMutation = useDeleteComunero();

  const params: Record<string, string | number> = { page };
  if (search) params.search = search;
  if (territory) params.territory = territory;
  if (isActive) params.is_active = isActive;
  if (sex) params.sex = sex;

  const { data, isLoading } = useComuneros(params);
  const { data: territories } = useTerritories({ page_size: 100 });

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        notifications.show({ title: 'Eliminado', message: 'Comunero eliminado correctamente', color: 'green' });
        setDeleteTarget(null);
      },
      onError: () => notifications.show({ title: 'Error', message: 'No se pudo eliminar', color: 'red' }),
    });
  };

  const territoryOptions = territories?.results.map((t) => ({ value: String(t.id), label: t.name })) ?? [];

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Comuneros</Title>
        <Button leftSection={<IconPlus size={16} />} color="cric" onClick={() => navigate('/comuneros/new')}>
          Nuevo Comunero
        </Button>
      </Group>

      <Paper radius="md" withBorder mb="lg">
        <Group p="md" gap="sm" wrap="wrap">
          <TextInput
            placeholder="Buscar por nombre o documento..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ flex: 1, minWidth: 200 }}
          />
          <Select
            placeholder="Territorio"
            data={territoryOptions}
            value={territory}
            onChange={(v) => { setTerritory(v); setPage(1); }}
            clearable
            w={220}
          />
          <Select
            placeholder="Estado"
            data={[{ value: 'true', label: 'Activo' }, { value: 'false', label: 'Inactivo' }]}
            value={isActive}
            onChange={(v) => { setIsActive(v); setPage(1); }}
            clearable
            w={130}
          />
          <Select
            placeholder="Sexo"
            data={[{ value: 'MASCULINO', label: 'Masculino' }, { value: 'FEMENINO', label: 'Femenino' }]}
            value={sex}
            onChange={(v) => { setSex(v); setPage(1); }}
            clearable
            w={140}
          />
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Documento</Table.Th>
              <Table.Th>Nombre Completo</Table.Th>
              <Table.Th>Edad</Table.Th>
              <Table.Th>Sexo</Table.Th>
              <Table.Th>Territorio</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr><Table.Td colSpan={7} ta="center" py="xl">Cargando...</Table.Td></Table.Tr>
            ) : data?.results.length === 0 ? (
              <Table.Tr><Table.Td colSpan={7} ta="center" py="xl" c="dimmed">No se encontraron resultados</Table.Td></Table.Tr>
            ) : (
              data?.results.map((c) => (
                <Table.Tr key={c.id}>
                  <Table.Td>{c.document_type} - {c.document_number}</Table.Td>
                  <Table.Td>{c.full_name}</Table.Td>
                  <Table.Td>{c.age} a&ntilde;os</Table.Td>
                  <Table.Td>{c.sex}</Table.Td>
                  <Table.Td>{c.territory_detail?.name}</Table.Td>
                  <Table.Td>
                    <Badge color={c.is_active ? 'green' : 'red'} variant="light">
                      {c.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <ActionIcon variant="subtle" color="cric" onClick={() => navigate(`/comuneros/${c.id}/edit`)}>
                        {isAdmin ? <IconPencil size={16} /> : <IconEye size={16} />}
                      </ActionIcon>
                      {isAdmin && (
                        <ActionIcon variant="subtle" color="red" onClick={() => setDeleteTarget(c)}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      )}
                    </Group>
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

      <Modal opened={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Eliminar comunero" centered>
        <Stack>
          <Text size="sm">Esta seguro de eliminar a <strong>{deleteTarget?.full_name}</strong>? Esta accion no se puede deshacer.</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button color="red" onClick={handleDelete} loading={deleteMutation.isPending}>Eliminar</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
