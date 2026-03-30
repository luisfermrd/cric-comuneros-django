import { Title, LoadingOverlay } from '@mantine/core';
import { useStats } from '../hooks/useComuneros';
import StatsCards from '../components/StatsCards';

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) return <LoadingOverlay visible />;
  if (!stats) return null;

  return (
    <>
      <Title order={2} mb="lg">Dashboard</Title>
      <StatsCards stats={stats} />
    </>
  );
}
