import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

export default function CriticalAlertsBarChart() {
  const theme = useTheme();
  const colorPalette = [
    theme.palette.error.dark,
    theme.palette.error.main,
    theme.palette.error.light,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Alertas Críticos por Setor
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              3.245
            </Typography>
            <Chip size="small" color="error" label="+12%" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Total de alertas críticos nos últimos 6 meses
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: 'uti',
              label: 'UTI',
              data: [320, 400, 450, 500, 520, 600],
              stack: 'total',
            },
            {
              id: 'emergencia',
              label: 'Emergência',
              data: [290, 310, 330, 400, 410, 450],
              stack: 'total',
            },
            {
              id: 'enfermaria',
              label: 'Enfermaria',
              data: [200, 220, 240, 280, 290, 300],
              stack: 'total',
            },
          ]}
          height={250}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          hideLegend
        />
      </CardContent>
    </Card>
  );
}
