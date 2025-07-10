import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';
import LiveAlerts from './CustomizedDataGrid';

const data: StatCardProps[] = [
  {
    title: 'Pacientes internados',
    value: '128',
    interval: 'Últimas 24h',
    trend: 'up',
    data: [100, 105, 110, 120, 125, 128, 130, 128, 126, 124, 122, 120, 118, 115, 113, 110, 108, 106, 104, 102, 100, 98, 95, 92, 90, 88, 86, 84, 82, 80],
  },
  {
    title: 'Alertas clínicos',
    value: '32',
    interval: 'Últimas 24h',
    trend: 'neutral',
    data: [10, 12, 15, 17, 18, 20, 22, 24, 26, 28, 29, 30, 30, 31, 32, 32, 32, 32, 32, 32, 30, 28, 25, 20, 18, 16, 14, 12, 10, 9],
  },
  {
    title: 'Taxa de ocupação',
    value: '98%',
    interval: 'Última semana',
    trend: 'down',
    data: [85, 86, 88, 89, 90, 92, 91, 90, 89, 91, 92, 92, 92, 91, 90, 89, 90, 91, 92, 92, 91, 92, 93, 94, 92, 91, 90, 91, 92, 98],
  },
];


export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>

          <HighlightedCard />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>

      </Grid>
     
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Stack gap={2} direction={{ xs: 'row', sm: 'row', lg: 'row' }}>
            {/* <CustomizedTreeView /> */}
            {/* <ChartUserByCountry /> */}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, lg: 9 }}>
          <LiveAlerts />
        </Grid>
      </Grid>
      <Copyright  />
    </Box>
  );
}
