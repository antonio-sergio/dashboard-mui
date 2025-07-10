import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { LineChart, BarChart } from '@mui/x-charts';

const setores = ['UTI', '2º Andar', '3º Andar', 'Pronto Socorro', 'Centro Cirúrgico'];

const mockMonitorData = {
  apisOnline: 6,
  apisOffline: 1,
  schedules: 12,
  dbConnections: 120,
  queueConsumption: [30, 22, 18, 45, 27],
  websocketConnections: 85,
  clientsBySector: [10, 18, 22, 30, 5],
};

export default function Monitor5() {
  return (
    <Box
      width="100%"
      height="calc(100vh - 150px)"
      maxHeight="calc(100vh - 150px)"
      p={2}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h5" gutterBottom>
        Monitoramento de Infraestrutura e Serviços
      </Typography>

      {/* Indicadores */}
      <Box display="flex" gap={2} flexWrap="wrap">
        {[ 
          { label: 'APIs Online', value: mockMonitorData.apisOnline },
          { label: 'APIs Offline', value: mockMonitorData.apisOffline },
          { label: 'Schedules Ativos', value: mockMonitorData.schedules },
          { label: 'Conexões com o Banco', value: mockMonitorData.dbConnections },
          { label: 'Clientes WebSocket', value: mockMonitorData.websocketConnections },
        ].map((item, i) => (
          <Paper key={i} sx={{ p: 2, flex: '1 1 180px', minWidth: 180 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="h4">{item.value}</Typography>
          </Paper>
        ))}
      </Box>

      <Divider />

      <Box display="flex" gap={2} flexWrap="wrap" flex={1}>
        {/* Consumo de filas */}
        <Paper sx={{ flex: '1 1 48%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Consumo de Filas por Setor
          </Typography>
          <BarChart
            xAxis={[{ scaleType: 'band', data: setores, categoryGapRatio: 0.7 }]}
            series={[{
              data: mockMonitorData.queueConsumption,
              label: 'Mensagens/minuto',
              color: '#0288d1'
            }]}
            height={220}
          />
        </Paper>

        {/* Celulares conectados */}
        <Paper sx={{ flex: '1 1 48%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Dispositivos Móveis por Setor
          </Typography>
          <BarChart
            xAxis={[{ scaleType: 'band', data: setores, categoryGapRatio: 0.7 }]}
            series={[{
              data: mockMonitorData.clientsBySector,
              label: 'Celulares',
              color: '#7b1fa2'
            }]}
            height={220}
          />
        </Paper>

        {/* Histórico WebSocket */}
        <Paper sx={{ flex: '1 1 100%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Conexões WebSocket (Ultimos 7 dias)
          </Typography>
          <LineChart
            xAxis={[{ scaleType: 'point', data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] }]}
            series={[{
              data: [60, 70, 65, 80, 85, 90, 87],
              label: 'Conexões Ativas',
              color: '#2e7d32'
            }]}
            height={150}
          />
        </Paper>
      </Box>
    </Box>
  );
}
