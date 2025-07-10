import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

const days = Array.from({ length: 30 }, (_, i) => `Jul ${i + 1}`);

const dataCríticos = [
  2, 4, 6, 8, 10, 12, 9, 11, 13, 15,
  14, 13, 12, 10, 11, 14, 16, 18, 17, 15,
  13, 14, 12, 10, 9, 8, 6, 4, 3, 2,
];

export default function CriticalPatientsChart() {
  const theme = useTheme();
  const gradientId = 'gradient-critical';

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Pacientes Críticos
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="h4" component="p">
              {dataCríticos[dataCríticos.length - 1]}
            </Typography>
            <Chip size="small" color="info" label="+15%" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Evolução de pacientes em estado crítico nos últimos 30 dias
          </Typography>
        </Stack>

        <LineChart
          xAxis={[
            {
              scaleType: 'point',
              data: days,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: 'critical',
              label: 'Pacientes Críticos',
              data: dataCríticos,
              area: true,
              showMark: false,
              curve: 'monotoneX',
            },
          ]}
          colors={[theme.palette.info.main]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-critical': {
              fill: `url(#${gradientId})`,
            },
          }}
          hideLegend
        >
          <AreaGradient color={theme.palette.info.main} id={gradientId} />
        </LineChart>
      </CardContent>
    </Card>
  );
}
