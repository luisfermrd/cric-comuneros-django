import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, TextInput, PasswordInput, Button, Title, Text, Alert, Stack, Center, Image } from '@mantine/core';
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../providers/AuthProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Credenciales invalidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center h="100vh" bg="var(--mantine-color-cric-5)">
      <Paper radius="lg" p="xl" w={420} shadow="xl">
        <Stack align="center" mb="lg">
          <Image src="/logo-cric.png" alt="CRIC" w={100} h={100} fit="contain" />
          <Title order={3} c="cric">CRIC - SUIIN</Title>
          <Text size="sm" c="dimmed">Sistema de Gestion de Comuneros</Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack>
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                {error}
              </Alert>
            )}
            <TextInput
              label="Correo electronico"
              placeholder="admin@cric-colombia.org"
              leftSection={<IconMail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              label="Contrasena"
              leftSection={<IconLock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" fullWidth loading={loading} color="cric">
              Iniciar sesion
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
