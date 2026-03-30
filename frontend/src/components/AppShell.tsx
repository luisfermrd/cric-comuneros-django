import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppShell as MantineAppShell, NavLink, Group, Text, Avatar, Badge, ActionIcon,
  useMantineColorScheme, Divider, Stack,
} from '@mantine/core';
import { IconDashboard, IconUsers, IconMapPin, IconLogout, IconSun, IconMoon } from '@tabler/icons-react';
import { useAuth } from '../providers/AuthProvider';

const navItems = [
  { path: '/', label: 'Dashboard', icon: IconDashboard },
  { path: '/comuneros', label: 'Comuneros', icon: IconUsers },
  { path: '/territories', label: 'Territorios', icon: IconMapPin },
];

export default function AppShellLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened] = useState(true);

  return (
    <MantineAppShell
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="lg"
    >
      <MantineAppShell.Navbar p="md">
        <Stack justify="space-between" h="100%">
          <div>
            <Group mb="md" p="xs">
              <img src="/logo-cric.png" alt="CRIC" width={36} height={36} />
              <div>
                <Text size="sm" fw={700}>CRIC - SUIIN</Text>
                <Text size="xs" c="dimmed">Comuneros</Text>
              </div>
            </Group>
            <Divider mb="md" />
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                label={item.label}
                leftSection={<item.icon size={18} />}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                mb={4}
                style={{ borderRadius: 8 }}
              />
            ))}
          </div>

          <div>
            <Divider mb="md" />
            <Group justify="space-between" mb="sm" px="xs">
              <div>
                <Text size="sm" fw={500}>{user?.full_name}</Text>
                <Badge size="xs" variant="light" color="cric">{user?.role}</Badge>
              </div>
              <Avatar color="cric" radius="xl" size="sm">
                {user?.full_name?.charAt(0)}
              </Avatar>
            </Group>
            <Group gap="xs">
              <ActionIcon variant="subtle" onClick={toggleColorScheme} size="lg" radius="md" style={{ flex: 1 }}>
                {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
              </ActionIcon>
              <ActionIcon variant="subtle" color="red" onClick={logout} size="lg" radius="md" style={{ flex: 1 }}>
                <IconLogout size={16} />
              </ActionIcon>
            </Group>
          </div>
        </Stack>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
