import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';

const setores = ['UTI', '2º Andar', '3º Andar', 'PS', 'Centro Cirúrgico'];

const mockData = {
  totalLeitos: [20, 40, 35, 15, 10],
  ocupados: [18, 35, 28, 12, 8],
  aguardando: [2, 3, 4, 2, 1],
  previsaoAlta: [1, 5, 3, 0, 2],
  historicoOcupacao: [75, 78, 80, 76, 79, 82, 85],
};

export default function Monitor4() {
  const totalDisponiveis = mockData.totalLeitos.map(
    (t, i) => t - mockData.ocupados[i]
  );

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
        Ocupação de Leitos e Gestão de Vagas
      </Typography>

      {/* Indicadores Rápidos */}
      <Box display="flex" gap={2} flexWrap="wrap">
        {[
          {
            label: 'Total de Leitos Ocupados',
            value: mockData.ocupados.reduce((a, b) => a + b, 0),
          },
          {
            label: 'Pacientes Aguardando Leito',
            value: mockData.aguardando.reduce((a, b) => a + b, 0),
          },
          {
            label: 'Previsão de Altas Hoje',
            value: mockData.previsaoAlta.reduce((a, b) => a + b, 0),
          },
        ].map((item, index) => (
          <Paper key={index} sx={{ p: 2, flex: '1 1 220px', minWidth: 220 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="h4">{item.value}</Typography>
          </Paper>
        ))}
      </Box>

      <Divider />

      {/* Gráficos */}
      <Box display="flex" flex="1" gap={2}>
        {/* Coluna 1 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column'}}>
          <Paper sx={{height: "30vh", p: 1.5}}>
            <Typography variant="subtitle1" gutterBottom>
              Ocupação Atual por Setor
            </Typography>
            <BarChart
              height={150}
              xAxis={[{ scaleType: 'band', data: setores }]}
              series={[
                { data: mockData.ocupados, label: 'Ocupados', color: '#d32f2f' },
                { data: totalDisponiveis, label: 'Disponíveis', color: '#388e3c' },
              ]}
            />
          </Paper>

          <Paper sx={{height: "40vh", p: 1.5, mt: 2,}}>
            <Typography variant="subtitle1" gutterBottom>
              Distribuição de Pacientes Aguardando
            </Typography>
            <PieChart
              height={180}
              series={[
                {
                  innerRadius: 40,
                  outerRadius: 80,
                  data: setores.map((s, i) => ({
                    id: i,
                    value: mockData.aguardando[i],
                    label: s,
                  })),
                },
              ]}
            />
          </Paper>
        </Box>

        {/* Coluna 2 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{height: "30vh", p: 1.5}}>
            <Typography variant="subtitle1" gutterBottom>
              Previsão de Alta por Setor
            </Typography>
            <BarChart
              height={180}
              layout="horizontal"
              yAxis={[{ scaleType: 'band', data: setores, width: 100 }]}
              series={[
                {
                  data: mockData.previsaoAlta,
                  label: 'Prev. Alta',
                  color: '#0288d1',
                },
              ]}
            />
          </Paper>

          <Paper sx={{height: "40vh", p: 1.5, mt: 2,}}>
            <Typography variant="subtitle1" gutterBottom>
              Histórico de Ocupação Total (%)
            </Typography>
            <LineChart
              height={160}
              xAxis={[{ scaleType: 'point', data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] }]}
              series={[
                {
                  data: mockData.historicoOcupacao,
                  label: 'Ocup. Total %',
                  color: '#f57c00',
                },
              ]}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
