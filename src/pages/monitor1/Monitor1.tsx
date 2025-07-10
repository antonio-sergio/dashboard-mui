import * as React from 'react';
import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Card,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import FollowupDetail from './components/FollowupDetail';
import {
  LineChart,
  BarChart,
} from '@mui/x-charts';

const mockFollowups = [
  { id: 1, patient: 'Maria Silva', openedAt: '2025-07-01', status: 'Ativo', professional: 'Ana Paula' },
  { id: 2, patient: 'João Oliveira', openedAt: '2025-07-05', status: 'Encerrado', professional: 'Carlos Mendes' },
  { id: 3, patient: 'Ana Santos', openedAt: '2025-07-07', status: 'Ativo', professional: 'Ana Paula' },
  { id: 4, patient: 'Ana Laura', openedAt: '2025-07-07', status: 'Ativo', professional: 'Paulo Henrique' },
  { id: 5, patient: 'Adão Santos', openedAt: '2025-07-07', status: 'Ativo', professional: 'Paulo Henrique' },
];

export default function Monitor1() {
  const [selected, setSelected] = React.useState<number | null>(null);

  const total = mockFollowups.length;
  const ativos = mockFollowups.filter(f => f.status === 'Ativo').length;
  const encerrados = total - ativos;
  const mediaDias = 3.2; // Simulação

  return (
    <Box width="100%" height="calc(100vh - 150px)" p={2} display={"flex"}>
      {!selected ? (
        <>

          {/* Indicadores e Gráficos */}
          <Box width={"100%"}  display={"flex"} flexDirection={"column"}>
            <Typography variant="h5" gutterBottom>
              Monitoramento de Follow-ups
            </Typography>
            <Box display={"flex"} >
              <Box width={"50%"} display={"flex"} justifyContent={"space-between"}  flexWrap={"wrap"}>
                <Box width={"50%"} px={1}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total de Follow-ups
                    </Typography>
                    <Typography variant="h4">{total}</Typography>
                  </Paper>
                </Box>
                <Box width={"50%"} px={1}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Ativos
                    </Typography>
                    <Typography variant="h4" color="success.main">{ativos}</Typography>
                  </Paper>
                </Box>
                <Box width={"50%"} px={1}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Encerrados
                    </Typography>
                    <Typography variant="h4" color="text.disabled">{encerrados}</Typography>
                  </Paper>
                </Box>
                <Box width={"50%"} px={1}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tempo médio de acompanhamento
                    </Typography>
                    <Typography variant="h4">{mediaDias.toFixed(1)} dias</Typography>
                  </Paper>
                </Box>
              </Box>

              <Box display={"flex"} width={"50%"}>
                {/* Gráfico de barras empilhadas */}
                <Box width={"50%"} px={2}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Follow-ups por status (últimos dias)
                    </Typography>
                    <BarChart
                      height={250}
                      xAxis={[{ data: ['01/07', '03/07', '05/07', '07/07'], scaleType: 'band' }]}
                      series={[
                        {
                          data: [10, 8, 9, 12],
                          label: 'Ativos',
                          color: '#4caf50',
                        },
                        {
                          data: [9, 5, 6, 8],
                          label: 'Encerrados',
                          color: '#9e9e9e',
                        },
                      ]}
                    />
                  </Paper>
                </Box>

                {/* Gráfico de barras por profissional */}
                <Box width={"50%"} px={2}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Follow-ups por profissional
                    </Typography>
                    <BarChart
                      height={250}
                      xAxis={[{ data: ['Ana Paula', 'Carlos Mendes', 'Paulo Henrique'], scaleType: 'band' }]}
                      series={[
                        {
                          data: [
                            mockFollowups.filter(f => f.professional === 'Ana Paula').length,
                            mockFollowups.filter(f => f.professional === 'Carlos Mendes').length,
                            mockFollowups.filter(f => f.professional === 'Paulo Henrique').length,
                          ],
                          label: 'Nº de Follow-ups',
                          color: '#1976d2',
                        },
                      ]}
                    />
                  </Paper>
                </Box>
              </Box>

            </Box>
            <Box display={"flex"} mt={2}>
              {/* Lista + Evolução de Aberturas */}
              <Box display={"flex"} width={"100%"}>
                <Box width={"50%"} px={2}>
                  <Paper sx={{ p: 2, maxHeight: '40vh', overflow: "auto" }}>
                    <Typography variant="h6" gutterBottom>
                      Follow-ups Ativos
                    </Typography>
                    <Card variant="outlined">
                      <List>
                        {mockFollowups.map((f) => (
                          <ListItemButton key={f.id} onClick={() => setSelected(f.id)}>
                            <ListItemText
                              primary={`Paciente: ${f.patient}`}
                              secondary={`Aberto em: ${f.openedAt}`}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Card>
                  </Paper>
                </Box>

                <Box width={"50%"} px={2}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Evolução diária de aberturas
                    </Typography>
                    <LineChart
                      height={250}
                      xAxis={[{ scaleType: 'point', data: ['01/07', '03/07', '05/07', '07/07'] }]}
                      series={[
                        {
                          data: [1, 1, 2, 3],
                          label: 'Follow-ups abertos',
                        },
                      ]}
                    />
                  </Paper>
                </Box>



              </Box>

            </Box>

          </Box>
        </>
      ) : (
        <FollowupDetail id={selected} onBack={() => setSelected(null)} />
      )}
    </Box>
  );
}
