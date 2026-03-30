import { SimpleGrid, Paper, Text, Group, ThemeIcon, Progress, Stack, Badge, Divider } from '@mantine/core';
import { IconUsers, IconUserCheck, IconUserX, IconMapPin, IconGenderMale, IconGenderFemale } from '@tabler/icons-react';
import { Stats } from '../types';

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const mPct = stats.total_comuneros > 0 ? (stats.by_gender.MASCULINO / stats.total_comuneros) * 100 : 0;
  const fPct = stats.total_comuneros > 0 ? (stats.by_gender.FEMENINO / stats.total_comuneros) * 100 : 0;
  const activePct = stats.total_comuneros > 0 ? (stats.active_comuneros / stats.total_comuneros) * 100 : 0;

  return (
    <Stack gap="lg">
      <Paper p="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon size="xl" radius="md" variant="gradient" gradient={{ from: 'cric.5', to: 'cric.3' }}>
              <IconUsers size={24} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Comuneros</Text>
              <Text size="2rem" fw={800} lh={1}>{stats.total_comuneros}</Text>
            </div>
          </Group>
          <SimpleGrid cols={2} spacing="xl">
            <div style={{ textAlign: 'center' }}>
              <Group gap={4} justify="center">
                <IconUserCheck size={14} color="var(--mantine-color-green-5)" />
                <Text size="xs" c="dimmed">Activos</Text>
              </Group>
              <Text size="xl" fw={700} c="green">{stats.active_comuneros}</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Group gap={4} justify="center">
                <IconUserX size={14} color="var(--mantine-color-red-5)" />
                <Text size="xs" c="dimmed">Inactivos</Text>
              </Group>
              <Text size="xl" fw={700} c="red">{stats.inactive_comuneros}</Text>
            </div>
          </SimpleGrid>
        </Group>
        <Progress.Root size="lg" radius="md">
          <Progress.Section value={activePct} color="green">
            <Progress.Label>{activePct.toFixed(0)}%</Progress.Label>
          </Progress.Section>
          <Progress.Section value={100 - activePct} color="red">
            <Progress.Label>{(100 - activePct).toFixed(0)}%</Progress.Label>
          </Progress.Section>
        </Progress.Root>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Paper p="lg" radius="md" withBorder>
          <Text fw={600} mb="lg">Distribucion por Genero</Text>
          <Group justify="space-around" mb="md">
            <Stack align="center" gap={4}>
              <ThemeIcon size={48} radius="xl" variant="light" color="cric">
                <IconGenderMale size={28} />
              </ThemeIcon>
              <Text size="2rem" fw={800}>{stats.by_gender.MASCULINO}</Text>
              <Text size="xs" c="dimmed">Masculino</Text>
            </Stack>
            <Stack align="center" gap={4}>
              <ThemeIcon size={48} radius="xl" variant="light" color="pink">
                <IconGenderFemale size={28} />
              </ThemeIcon>
              <Text size="2rem" fw={800}>{stats.by_gender.FEMENINO}</Text>
              <Text size="xs" c="dimmed">Femenino</Text>
            </Stack>
          </Group>
          <Progress.Root size="xl" radius="md">
            <Progress.Section value={mPct} color="cric">
              <Progress.Label>{mPct.toFixed(0)}%</Progress.Label>
            </Progress.Section>
            <Progress.Section value={fPct} color="pink">
              <Progress.Label>{fPct.toFixed(0)}%</Progress.Label>
            </Progress.Section>
          </Progress.Root>
        </Paper>

        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="lg">
            <Text fw={600}>Comuneros por Territorio</Text>
            <Badge variant="light" color="cric" size="lg">{stats.by_territory.length} territorios</Badge>
          </Group>
          <Stack gap="sm">
            {stats.by_territory.map((t, i) => {
              const pct = stats.total_comuneros > 0 ? (t.count / stats.total_comuneros) * 100 : 0;
              return (
                <div key={t.territory_id}>
                  <Group justify="space-between" mb={4}>
                    <Group gap="xs">
                      <IconMapPin size={14} color="var(--mantine-color-cric-5)" />
                      <Text size="sm" truncate style={{ maxWidth: 180 }}>{t.territory_name}</Text>
                    </Group>
                    <Text size="sm" fw={600}>{t.count}</Text>
                  </Group>
                  <Progress value={pct} color="cric" size="sm" radius="xl" />
                  {i < stats.by_territory.length - 1 && <Divider mt="sm" />}
                </div>
              );
            })}
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
