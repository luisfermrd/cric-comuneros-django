import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextInput, Select, Checkbox, Button, Paper, Title, Group, Alert, SimpleGrid, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useComunero, useCreateComunero, useUpdateComunero } from '../hooks/useComuneros';
import { useTerritories } from '../hooks/useTerritories';
import { useAuth } from '../providers/AuthProvider';

const onlyLetters = /^[A-Za-z\u00C0-\u00FF\u00D1\u00F1\s]+$/;
const onlyDigits = /^\d+$/;
const phoneRegex = /^3\d{9}$/;

const schema = z.object({
  document_type: z.string().min(1, 'Requerido'),
  document_number: z.string().min(3, 'Minimo 3 caracteres').max(20).regex(onlyDigits, 'Solo digitos'),
  first_name: z.string().min(2, 'Minimo 2 caracteres').max(50).regex(onlyLetters, 'Solo letras'),
  second_name: z.string().max(50).regex(onlyLetters, 'Solo letras').optional().or(z.literal('')),
  first_last_name: z.string().min(2, 'Minimo 2 caracteres').max(50).regex(onlyLetters, 'Solo letras'),
  second_last_name: z.string().max(50).regex(onlyLetters, 'Solo letras').optional().or(z.literal('')),
  birth_date: z.date({ required_error: 'Requerido' }).refine((d) => d <= new Date(), { message: 'No puede ser futura' }),
  sex: z.string().min(1, 'Requerido'),
  phone: z.string().regex(phoneRegex, '10 digitos, inicia en 3').optional().or(z.literal('')),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
  is_active: z.boolean(),
  territory: z.string().min(1, 'Seleccione un territorio'),
});

const documentTypes = ['CEDULA CIUDADANIA', 'TARJETA IDENTIDAD', 'REGISTRO CIVIL', 'CEDULA EXTRANJERIA', 'PASAPORTE'];

export default function ComuneroForm() {
  const { id } = useParams();
  const numericId = id ? parseInt(id) : 0;
  const isEdit = !!id;
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [serverError, setServerError] = useState('');

  const { data: comunero } = useComunero(numericId);
  const { data: territories } = useTerritories({ page_size: 100 });
  const createMutation = useCreateComunero();
  const updateMutation = useUpdateComunero();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      document_type: 'CEDULA CIUDADANIA',
      document_number: '',
      first_name: '',
      second_name: '',
      first_last_name: '',
      second_last_name: '',
      birth_date: null as Date | null,
      sex: '',
      phone: '',
      email: '',
      is_active: true,
      territory: '',
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (comunero && isEdit) {
      form.setValues({
        document_type: comunero.document_type,
        document_number: comunero.document_number,
        first_name: comunero.first_name,
        second_name: comunero.second_name || '',
        first_last_name: comunero.first_last_name,
        second_last_name: comunero.second_last_name || '',
        birth_date: new Date(comunero.birth_date),
        sex: comunero.sex,
        phone: comunero.phone || '',
        email: comunero.email || '',
        is_active: comunero.is_active,
        territory: String(comunero.territory),
      });
    }
  }, [comunero, isEdit]);

  const handleSubmit = async (values: typeof form.values) => {
    setServerError('');
    const payload = {
      ...values,
      birth_date: values.birth_date?.toISOString().split('T')[0],
      territory: parseInt(values.territory),
    };
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: numericId, ...payload });
        notifications.show({ title: 'Actualizado', message: 'Comunero actualizado correctamente', color: 'green' });
      } else {
        await createMutation.mutateAsync(payload);
        notifications.show({ title: 'Creado', message: 'Comunero creado correctamente', color: 'green' });
      }
      navigate('/comuneros');
    } catch (err: unknown) {
      const error = err as { response?: { data?: Record<string, string[]> } };
      const firstError = error.response?.data ? Object.values(error.response.data).flat()[0] : 'Error al guardar';
      setServerError(firstError || 'Error al guardar');
    }
  };

  const readOnly = isEdit && !isAdmin;
  const territoryOptions = territories?.results.map((t) => ({ value: String(t.id), label: t.name })) ?? [];

  return (
    <>
      <Title order={2} mb="lg">
        {isEdit ? (readOnly ? 'Ver Comunero' : 'Editar Comunero') : 'Nuevo Comunero'}
      </Title>

      <Paper radius="md" withBorder p="lg" maw={700}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {serverError && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">{serverError}</Alert>
            )}

            <SimpleGrid cols={2}>
              <Select label="Tipo Documento" data={documentTypes} disabled={readOnly} key={form.key('document_type')} {...form.getInputProps('document_type')} />
              <TextInput label="Numero de Documento" disabled={readOnly} maxLength={20} key={form.key('document_number')} {...form.getInputProps('document_number')} />
            </SimpleGrid>

            <SimpleGrid cols={2}>
              <TextInput label="Primer Nombre *" disabled={readOnly} maxLength={50} key={form.key('first_name')} {...form.getInputProps('first_name')} />
              <TextInput label="Segundo Nombre" disabled={readOnly} maxLength={50} key={form.key('second_name')} {...form.getInputProps('second_name')} />
            </SimpleGrid>

            <SimpleGrid cols={2}>
              <TextInput label="Primer Apellido *" disabled={readOnly} maxLength={50} key={form.key('first_last_name')} {...form.getInputProps('first_last_name')} />
              <TextInput label="Segundo Apellido" disabled={readOnly} maxLength={50} key={form.key('second_last_name')} {...form.getInputProps('second_last_name')} />
            </SimpleGrid>

            <SimpleGrid cols={2}>
              <DateInput label="Fecha de Nacimiento *" disabled={readOnly} maxDate={new Date()} key={form.key('birth_date')} {...form.getInputProps('birth_date')} />
              <Select label="Sexo *" data={[{ value: 'MASCULINO', label: 'Masculino' }, { value: 'FEMENINO', label: 'Femenino' }]} disabled={readOnly} key={form.key('sex')} {...form.getInputProps('sex')} />
            </SimpleGrid>

            <SimpleGrid cols={2}>
              <TextInput label="Telefono" disabled={readOnly} maxLength={10} key={form.key('phone')} {...form.getInputProps('phone')} />
              <TextInput label="Correo" type="email" disabled={readOnly} key={form.key('email')} {...form.getInputProps('email')} />
            </SimpleGrid>

            <Select label="Territorio *" data={territoryOptions} disabled={readOnly} searchable key={form.key('territory')} {...form.getInputProps('territory')} />

            <Checkbox label="Activo" disabled={readOnly} key={form.key('is_active')} {...form.getInputProps('is_active', { type: 'checkbox' })} />

            <Group>
              {!readOnly && (
                <Button type="submit" color="cric" leftSection={<IconDeviceFloppy size={16} />} loading={createMutation.isPending || updateMutation.isPending}>
                  {isEdit ? 'Actualizar' : 'Crear'}
                </Button>
              )}
              <Button variant="default" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/comuneros')}>
                {readOnly ? 'Volver' : 'Cancelar'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
