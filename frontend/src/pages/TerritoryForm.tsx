import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextInput, Textarea, Button, Paper, Title, Group, Alert, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useTerritory, useCreateTerritory, useUpdateTerritory } from '../hooks/useTerritories';

const schema = z.object({
  name: z.string().min(2, 'Minimo 2 caracteres').max(100),
  description: z.string().max(500).optional().default(''),
});

export default function TerritoryForm() {
  const { id } = useParams();
  const numericId = id ? parseInt(id) : 0;
  const isEdit = !!id;
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { data: territory } = useTerritory(numericId);
  const createMutation = useCreateTerritory();
  const updateMutation = useUpdateTerritory();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '', description: '' },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (territory && isEdit) {
      form.setValues({ name: territory.name, description: territory.description });
    }
  }, [territory, isEdit]);

  const handleSubmit = async (values: typeof form.values) => {
    setServerError('');
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: numericId, ...values });
        notifications.show({ title: 'Actualizado', message: 'Territorio actualizado correctamente', color: 'green' });
      } else {
        await createMutation.mutateAsync(values);
        notifications.show({ title: 'Creado', message: 'Territorio creado correctamente', color: 'green' });
      }
      navigate('/territories');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { name?: string[] } } };
      setServerError(error.response?.data?.name?.[0] || 'Error al guardar');
    }
  };

  return (
    <>
      <Title order={2} mb="lg">{isEdit ? 'Editar Territorio' : 'Nuevo Territorio'}</Title>

      <Paper radius="md" withBorder p="lg" maw={500}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {serverError && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">{serverError}</Alert>
            )}
            <TextInput label="Nombre *" key={form.key('name')} {...form.getInputProps('name')} />
            <Textarea label="Descripcion" rows={3} key={form.key('description')} {...form.getInputProps('description')} />
            <Group>
              <Button type="submit" color="cric" leftSection={<IconDeviceFloppy size={16} />} loading={createMutation.isPending || updateMutation.isPending}>
                {isEdit ? 'Actualizar' : 'Crear'}
              </Button>
              <Button variant="default" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/territories')}>
                Cancelar
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
