import * as React from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  List,
  CircularProgress, // Para loading states
  Paper, // Reintroduzindo Paper para elevação e estilo
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip, // Para tags de status
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Ícone para Accordion
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction'; // Ícones para KPIs
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StorageIcon from '@mui/icons-material/Storage';
import PowerIcon from '@mui/icons-material/Power';
import { green, red, amber, blue } from '@mui/material/colors'; // Cores para status

import ReactECharts from 'echarts-for-react';

// Definindo as interfaces para os dados (inalteradas)
interface PacienteData {
  nome: string;
  condicao: string;
  detalhes: string;
}

interface SetorData {
  name: string;
  mensagens: number;
  celulares: number;
  pacientes: PacienteData[];
}

interface EstabelecimentoData {
  id: string;
  name: string;
  setores: SetorData[];
  totalMensagens: number;
  totalCelulares: number;
}

// Dados de exemplo com a nova hierarquia (inalterados)
const estabelecimentosData: EstabelecimentoData[] = [
  {
    id: 'hospital-a',
    name: 'Hospital Geral',
    setores: [
      { name: 'UTI', mensagens: 30, celulares: 10, pacientes: [{ nome: 'Maria', condicao: 'Estável', detalhes: 'Monitoramento contínuo.' }, { nome: 'João', condicao: 'Crítico', detalhes: 'Pneumonia severa.' }] },
      { name: '2º Andar', mensagens: 22, celulares: 18, pacientes: [{ nome: 'Ana', condicao: 'Melhorando', detalhes: 'Pós-cirúrgico de apendicite.' }, { nome: 'Carlos', condicao: 'Estável', detalhes: 'Recuperação de fratura.' }] },
      { name: 'Pronto Socorro', mensagens: 45, celulares: 30, pacientes: [{ nome: 'Rita', condicao: 'Urgente', detalhes: 'Suspeita de AVC.' }, { nome: 'Luís', condicao: 'Emergência', detalhes: 'Acidente de trânsito.' }] },
    ],
    totalMensagens: 97,
    totalCelulares: 58,
  },
  {
    id: 'clinica-b',
    name: 'Clínica Saúde Plena',
    setores: [
      { name: 'Consultórios', mensagens: 15, celulares: 8, pacientes: [{ nome: 'Sofia', condicao: 'Agendado', detalhes: 'Consulta de rotina.' }] },
      { name: 'Laboratório', mensagens: 10, celulares: 5, pacientes: [] },
    ],
    totalMensagens: 25,
    totalCelulares: 13,
  },
  {
    id: 'maternidade-c',
    name: 'Maternidade Luz',
    setores: [
      { name: 'Berçário', mensagens: 12, celulares: 15, pacientes: [{ nome: 'Bebê 1', condicao: 'Nascido', detalhes: 'Aguardando alta.' }] },
      { name: 'Pós-Parto', mensagens: 8, celulares: 10, pacientes: [{ nome: 'Paula', condicao: 'Recuperação', detalhes: 'Pós-parto normal.' }] },
    ],
    totalMensagens: 20,
    totalCelulares: 25,
  },
];

const conexoesWebsocketData = [
  { dia: 'Seg', conexoes: 60 },
  { dia: 'Ter', conexoes: 70 },
  { dia: 'Qua', conexoes: 65 },
  { dia: 'Qui', conexoes: 80 },
  { dia: 'Sex', conexoes: 85 },
  { dia: 'Sáb', conexoes: 90 },
  { dia: 'Dom', conexoes: 87 },
];

// Novos dados de exemplo para tendências de mensagens e celulares
const tendenciaMensagensData = [
  { mes: 'Jan', count: 150 }, { mes: 'Fev', count: 160 }, { mes: 'Mar', count: 145 },
  { mes: 'Abr', count: 170 }, { mes: 'Mai', count: 180 }, { mes: 'Jun', count: 175 },
];

const tendenciaCelularesData = [
  { mes: 'Jan', count: 80 }, { mes: 'Fev', count: 85 }, { mes: 'Mar', count: 78 },
  { mes: 'Abr', count: 90 }, { mes: 'Mai', count: 95 }, { mes: 'Jun', count: 92 },
];

export default function Monitor5() {
  const [selectedEstabelecimento, setSelectedEstabelecimento] = React.useState<EstabelecimentoData | null>(null);
  const [selectedSector, setSelectedSector] = React.useState<SetorData | null>(null);
  const [loading, setLoading] = React.useState(true); // Estado para simular carregamento
  const [timeRange, setTimeRange] = React.useState('7days'); // Estado para filtro de tempo

  // Simula um carregamento de dados
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Carrega após 1.5 segundos
    return () => clearTimeout(timer);
  }, []);

  const currentSetoresData = selectedEstabelecimento ? selectedEstabelecimento.setores : [];

  const handleGoBack = () => {
    if (selectedSector) {
      setSelectedSector(null);
    } else if (selectedEstabelecimento) {
      setSelectedEstabelecimento(null);
    }
  };

  // --- ECharts Options ---

  const getEstabelecimentoOptions = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['Total Mensagens', 'Total Celulares'] },
    xAxis: {
      type: 'category',
      data: estabelecimentosData.map(d => d.name),
      axisLabel: {
        rotate: 15,
        interval: 0,
      }
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Total Mensagens',
        type: 'bar',
        data: estabelecimentosData.map(d => ({ value: d.totalMensagens, name: d.name, originalData: d })),
        itemStyle: { color: '#1976d2' },
      },
      {
        name: 'Total Celulares',
        type: 'bar',
        data: estabelecimentosData.map(d => ({ value: d.totalCelulares, name: d.name, originalData: d })),
        itemStyle: { color: '#ab47bc' },
      },
    ],
  });

  const getMensagensSetorOptions = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: currentSetoresData.map(d => d.name),
      axisLabel: {
        rotate: 15,
        interval: 0,
      }
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Mensagens por Minuto',
        type: 'bar',
        data: currentSetoresData.map(d => ({ value: d.mensagens, name: d.name, originalData: d })),
        itemStyle: { color: '#0288d1' },
      },
    ],
  });

  const getCelularesSetorOptions = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: currentSetoresData.map(d => d.name),
      axisLabel: {
        rotate: 15,
        interval: 0,
      }
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Celulares Conectados',
        type: 'bar',
        data: currentSetoresData.map(d => ({ value: d.celulares, name: d.name, originalData: d })),
        itemStyle: { color: '#7b1fa2' },
      },
    ],
  });

  const getConexoesWebSocketOptions = () => ({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: conexoesWebsocketData.map(d => d.dia) },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Conexões',
        type: 'line',
        data: conexoesWebsocketData.map(d => d.conexoes),
        itemStyle: { color: '#2e7d32' },
        smooth: true, // Adiciona suavidade à linha
      },
    ],
  });

  const getTendenciaMensagensOptions = () => ({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: tendenciaMensagensData.map(d => d.mes) },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Mensagens/Mês',
        type: 'line',
        data: tendenciaMensagensData.map(d => d.count),
        itemStyle: { color: '#ff9800' }, // Laranja
        smooth: true,
      },
    ],
  });

  const getTendenciaCelularesOptions = () => ({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: tendenciaCelularesData.map(d => d.mes) },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Celulares/Mês',
        type: 'line',
        data: tendenciaCelularesData.map(d => d.count),
        itemStyle: { color: '#4caf50' }, // Verde
        smooth: true,
      },
    ],
  });

  // --- ECharts Events ---

  const onEstabelecimentoChartClick = (params: any) => {
    if (params.data && params.data.originalData) {
      setSelectedEstabelecimento(params.data.originalData);
      setSelectedSector(null);
    }
  };

  const onSetorChartClick = (params: any) => {
    if (params.data && params.data.originalData) {
      setSelectedSector(params.data.originalData);
    }
  };

  const kpiData = [
    { label: 'APIs Online', value: 6, icon: <OnlinePredictionIcon sx={{ color: green[500] }} />, status: 'online' },
    { label: 'APIs Offline', value: 1, icon: <OfflineBoltIcon sx={{ color: red[500] }} />, status: 'offline' },
    { label: 'Schedules Ativos', value: 12, icon: <ScheduleIcon sx={{ color: blue[500] }} />, status: 'info' },
    { label: 'Conexões DB', value: 120, icon: <StorageIcon sx={{ color: amber[700] }} />, status: 'warning' },
    { label: 'Clientes WebSocket', value: 85, icon: <PowerIcon sx={{ color: green[500] }} />, status: 'online' },
  ];

  return (
    <Box
      width="100%"
      height="calc(100vh - 150px)"
      p={2}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{ borderRadius: 2 }} // Fundo mais suave
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 600 }}>
        Dashboard de Monitoramento de Infraestrutura
      </Typography>

      {/* Indicadores de Status (KPIs) */}
      <Box display="flex" gap={2} flexWrap="wrap" justifyContent="space-around">
        {kpiData.map((item, i) => (
          <Paper
            key={i}
            elevation={3} // Adiciona elevação para um visual mais profissional
            sx={{
              p: 2,
              flex: '1 1 180px',
              minWidth: 180,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' }, // Efeito hover
              borderLeft: `5px solid ${
                item.status === 'online' ? green[600] :
                item.status === 'offline' ? red[600] :
                item.status === 'warning' ? amber[600] :
                blue[600]
              }`,
            }}
          >
            {item.icon}
            <Typography variant="subtitle2" color="text.secondary" mt={1}>
              {item.label}
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 'bold', color: '#333' }}>
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Divider sx={{ my: 1 }} /> {/* Espaçamento maior para divisores */}

      {/* Botão de Voltar */}
      {(selectedEstabelecimento || selectedSector) && (
        <Box  mb={1}>
          <Button
            variant="contained" // Botão mais proeminente
            onClick={handleGoBack}
            startIcon={<ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} />} // Ícone de seta para trás
            sx={{ backgroundColor: blue[700], '&:hover': { backgroundColor: blue[800] } }}
          >
            {selectedSector ? `Voltar para ${selectedEstabelecimento?.name}` : 'Voltar para Visão Geral'}
          </Button>
        </Box>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
          <CircularProgress size={60} sx={{ color: blue[500] }} />
          <Typography variant="h6" sx={{ ml: 2, color: '#555' }}>Carregando dados...</Typography>
        </Box>
      ) : (
        <Box display="flex" gap={2} flexWrap="wrap" flex={1}>
          {/* Gráfico de Estabelecimentos - Visão Geral */}
          {!selectedEstabelecimento && !selectedSector && (
            <Paper elevation={3} sx={{ flex: '1 1 100%', p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#444' }}>
                Resumo por Estabelecimento (Clique para Detalhes)
              </Typography>
              <ReactECharts
                option={getEstabelecimentoOptions()}
                onEvents={{ 'click': onEstabelecimentoChartClick }}
                style={{ height: '350px', width: '100%' }} // Altura ajustada
              />
            </Paper>
          )}

          {/* Gráficos de Setores - Exibidos quando um Estabelecimento é selecionado */}
          {selectedEstabelecimento && !selectedSector && (
            <>
              <Paper elevation={3} sx={{ flex: '1 1 48%', p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#444' }}>
                  Consumo de Filas por Setor em {selectedEstabelecimento.name} (Clique para Detalhes)
                </Typography>
                <ReactECharts
                  option={getMensagensSetorOptions()}
                  onEvents={{ 'click': onSetorChartClick }}
                  style={{ height: '300px', width: '100%' }} // Altura ajustada
                />
              </Paper>

              <Paper elevation={3} sx={{ flex: '1 1 48%', p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#444' }}>
                  Dispositivos Móveis por Setor em {selectedEstabelecimento.name} (Clique para Detalhes)
                </Typography>
                <ReactECharts
                  option={getCelularesSetorOptions()}
                  onEvents={{ 'click': onSetorChartClick }}
                  style={{ height: '300px', width: '100%' }} // Altura ajustada
                />
              </Paper>
            </>
          )}

          {/* Detalhes do Setor ou Lista de Pacientes - Exibidos quando um Setor é selecionado */}
          {selectedSector && (
            <Paper elevation={3} sx={{ flex: '1 1 100%', p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#444' }}>
                Detalhes do Setor: {selectedSector.name} ({selectedEstabelecimento?.name})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                **Mensagens por minuto:** <Chip label={selectedSector.mensagens} color="primary" size="small" />
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                **Celulares conectados:** <Chip label={selectedSector.celulares} color="secondary" size="small" />
              </Typography>

              <Typography variant="body2" mt={3} fontWeight="bold" color="#555">
                Pacientes ({selectedSector.pacientes.length}):
              </Typography>
              {selectedSector.pacientes.length > 0 ? (
                <List dense sx={{ mt: 1 }}>
                  {selectedSector.pacientes.map((paciente, index) => (
                    <Accordion key={index} elevation={1} sx={{ mb: 1, borderRadius: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {paciente.nome}
                        </Typography>
                        <Chip
                          label={paciente.condicao}
                          size="small"
                          color={
                            paciente.condicao === 'Estável' || paciente.condicao === 'Melhorando' || paciente.condicao === 'Agendado' ? 'success' :
                            paciente.condicao === 'Crítico' || paciente.condicao === 'Urgente' || paciente.condicao === 'Emergência' ? 'error' : 'info'
                          }
                          sx={{ ml: 2 }}
                        />
                      </AccordionSummary>
                      <AccordionDetails >
                        <Typography variant="body2" color="text.secondary">
                          {paciente.detalhes}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" sx={{ ml: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                  Nenhum paciente registrado neste setor.
                </Typography>
              )}
              <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.disabled' }}>
                Última verificação: Hoje às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Paper>
          )}

          {/* Filtro de tempo para gráficos de tendência */}
          <Paper elevation={3} sx={{ flex: '1 1 100%', p: 2, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" gutterBottom sx={{ mb: 0, color: '#444' }}>
                Tendências de Monitoramento
              </Typography>
              <FormControl  variant="standard" sx={{  width: 150 }}>
                <InputLabel  id="time-range-select-label">Período</InputLabel>
                <Select
                  labelId="time-range-select-label"
                  id="time-range-select"
                  value={timeRange}
                  label="Período"
                  variant="standard"
                  sx={{mt: 1}}
                  onChange={(e) => setTimeRange(e.target.value as string)}
                >
                  <MenuItem value="7days">Últimos 7 Dias</MenuItem>
                  <MenuItem value="30days">Últimos 30 Dias</MenuItem>
                  <MenuItem value="6months">Últimos 6 Meses</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" gap={2} flexWrap="wrap">
              {/* Gráfico de Conexões WebSocket - Mais alto */}
              <Box sx={{ flex: '1 1 48%' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: '#666' }}>
                  Conexões WebSocket ({timeRange === '7days' ? 'Últimos 7 dias' : 'Período Selecionado'})
                </Typography>
                <ReactECharts
                  option={getConexoesWebSocketOptions()}
                  style={{ height: '250px', width: '100%' }}
                />
              </Box>
              {/* Novo Gráfico de Tendência de Mensagens */}
              <Box sx={{ flex: '1 1 48%' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: '#666' }}>
                  Tendência de Mensagens (Últimos 6 Meses)
                </Typography>
                <ReactECharts
                  option={getTendenciaMensagensOptions()}
                  style={{ height: '250px', width: '100%' }}
                />
              </Box>
              {/* Novo Gráfico de Tendência de Celulares */}
              <Box sx={{ flex: '1 1 48%' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: '#666' }}>
                  Tendência de Celulares Conectados (Últimos 6 Meses)
                </Typography>
                <ReactECharts
                  option={getTendenciaCelularesOptions()}
                  style={{ height: '250px', width: '100%' }}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}