import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';

const setores = ['UTI', '2º Andar', '3º Andar', 'Pronto Socorro', 'Centro Cirúrgico'];

const mockData = {
  sinaisVitais: [120, 90, 150, 140, 20],
  anotacoesMedicas: [60, 40, 30, 45, 20],
  anotacoesEnfermagem: [100, 85, 70, 60, 20],
  medicamentos: [200, 180, 220, 40, 30],
};

export default function Monitor3() {
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
        Indicadores por Setor
      </Typography>

      {/* Indicadores rápidos */}
      <Box display="flex" gap={2} flexWrap="wrap">
        {[
          { label: 'Total de Coletas de Sinais', value: mockData.sinaisVitais },
          { label: 'Anotações Médicas', value: mockData.anotacoesMedicas },
          { label: 'Anotações de Enfermagem', value: mockData.anotacoesEnfermagem },
          { label: 'Medicamentos Administrados', value: mockData.medicamentos },
        ].map((item, index) => (
          <Paper
            key={index}
            sx={{
              p: 1.5,
              flex: '1 1 220px',
              minWidth: 220,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="h4">
              {item.value.reduce((a, b) => a + b, 0)}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Divider />

      {/* Gráficos comparativos */}
      <Box display="flex" flex="1" flexWrap="wrap" gap={2} overflow="hidden">
        {/* Coluna 1 */}
        <Box sx={{ flex: '1 1 48%' }}>
          <Paper sx={{ p: 1.5, height: "30vh" }}>
            <Typography variant="subtitle1" gutterBottom>
              Coleta de Sinais por Setor
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: setores, categoryGapRatio: 0.7 }]}
              series={[
                { data: mockData.sinaisVitais, label: 'Sinais Vitais', color: '#1976d2' },
              ]}
              height={120}
            />


          </Paper>

          <Paper sx={{ p: 1.5, mt: 2, height: "40vh" }}>
            <Typography variant="subtitle1" mt={2} gutterBottom>
              Medicamentos por Setor
            </Typography>
            <BarChart
              layout="horizontal"
              yAxis={[{ data: setores, scaleType: 'band', width: 100 }]}
              series={[
                { data: mockData.medicamentos, label: 'Medicamentos', color: '#6a1b9a' },
              ]}
              height={180}
            />

          </Paper>

        </Box>

        {/* Coluna 2 */}
        <Box sx={{  flex: '1 1 48%' }}>
          <Paper sx={{ p: 1.5, height: "30vh" }}>
            <Typography variant="subtitle1" gutterBottom>
              Anotações por Tipo
            </Typography>
            <LineChart
              xAxis={[{ scaleType: 'point', data: setores }]}
              series={[
                { data: mockData.anotacoesMedicas, label: 'Médicas', color: '#0288d1' },
                { data: mockData.anotacoesEnfermagem, label: 'Enfermagem', color: '#43a047' },
              ]}
              height={180}
            />


          </Paper>

          <Paper sx={{ p: 1.5, mt: 2, height: "40vh"  }} >
            <Typography variant="subtitle1" mt={2} gutterBottom>
              Total de Eventos por Setor
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: setores, categoryGapRatio: 0.7 }]}
              series={[
                {
                  data: setores.map((_, i) =>
                    mockData.sinaisVitais[i] +
                    mockData.anotacoesMedicas[i] +
                    mockData.anotacoesEnfermagem[i] +
                    mockData.medicamentos[i]
                  ),
                  label: 'Total de Eventos',
                  color: '#f57c00',
                },
              ]}
              height={150}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
