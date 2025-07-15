import * as React from 'react';
import {
    Box,
    Typography,
    Divider,
    Button,
    CircularProgress,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    // Chip, // Não utilizado neste snippet, mas pode manter se usar em outro lugar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TransgenderIcon from '@mui/icons-material/Transgender';
import CakeIcon from '@mui/icons-material/Cake';

import { green, red, amber, blue, grey, purple } from '@mui/material/colors';

import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts'; // Importe echarts diretamente para usar registerMap

// --- Interfaces de Dados (manter as suas existentes) ---
interface PacienteOncologicoData {
    id: string;
    nome: string;
    topo: string;
    estadiamento: 'I' | 'II' | 'III' | 'IV' | 'Não Estadiado';
    statusAtual: 'Vivo, com Câncer' | 'Vivo, SOE' | 'Óbito por Câncer' | 'Óbito por Outras Causas';
    tipoTratamentoPrincipal: 'Cirurgia' | 'Quimioterapia' | 'Radioterapia' | 'Hormonioterapia' | 'Outro' | 'Não Tratado';
    dtDiagnostico: Date;
    dtUltimaInfo: Date;
    teveRecidiva: boolean;
    idade: number;
    genero: 'Masculino' | 'Feminino' | 'Outros';
}

interface AggregatedMetrics {
    totalPacientesAtivos: number;
    novosDiagnosticosAno: number;
    obitosPorCancerAno: number;
    remissaoInferidaAno: number;
    mediaIdade: number;
    distribuicaoPorGenero: { Masculino: number; Feminino: number; Outros?: number };
    distribuicaoPorTopografia: { name: string; value: number }[];
    distribuicaoPorEstadiamento: { name: string; value: number }[];
    distribuicaoPorFaixaEtaria: { name: string; value: number }[];
    distribuicaoPorTratamentoPrincipal: { name: string; value: number }[];
    tendenciaNovosDiagnosticosMensal: { mes: string; count: number }[];
    tendenciaObitosMensal: { mes: string; count: number }[];
}

// --- Funções de Ajuda para Geração e Agregação de Dados Mock (manter as suas existentes) ---
const generateMockPatients = (count: number): PacienteOncologicoData[] => {
    const patients: PacienteOncologicoData[] = [];
    const topographies = ['C50.9 - Mama', 'C61.9 - Próstata', 'C34.9 - Pulmão', 'C18.9 - Cólon', 'C44.9 - Pele', 'C16.9 - Estômago', 'C91-C95 - Leucemia', 'C25.9 - Pâncreas'];
    const estadiamentos = ['I', 'II', 'III', 'IV', 'Não Estadiado'];
    const statusList = ['Vivo, com Câncer', 'Vivo, SOE', 'Óbito por Câncer', 'Óbito por Outras Causas'];
    const treatments = ['Cirurgia', 'Quimioterapia', 'Radioterapia', 'Hormonioterapia', 'Outro', 'Não Tratado'];
    const genders = ['Masculino', 'Feminino'];

    for (let i = 0; i < count; i++) {
        const age = Math.floor(Math.random() * 80) + 20; // 20-99
        const currentYear = new Date().getFullYear();
        const monthDiagnosed = Math.floor(Math.random() * (new Date().getMonth() + 1)); // Até o mês atual
        const dayDiagnosed = Math.floor(Math.random() * 28) + 1;
        const dtDiagnostico = new Date(currentYear, monthDiagnosed, dayDiagnosed);

        const dtUltimaInfo = new Date(dtDiagnostico.getTime() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000); // Até 1 ano depois

        patients.push({
            id: `p${String(i + 1).padStart(4, '0')}`,
            nome: `Paciente ${i + 1}`,
            topo: topographies[Math.floor(Math.random() * topographies.length)],
            estadiamento: estadiamentos[Math.floor(Math.random() * estadiamentos.length)],
            statusAtual: statusList[Math.floor(Math.random() * statusList.length)],
            tipoTratamentoPrincipal: treatments[Math.floor(Math.random() * treatments.length)],
            dtDiagnostico: dtDiagnostico,
            dtUltimaInfo: dtUltimaInfo,
            teveRecidiva: Math.random() > 0.8,
            idade: age,
            genero: genders[Math.floor(Math.random() * genders.length)],
        });
    }
    return patients;
};

const aggregateData = (patients: PacienteOncologicoData[], filterYear: number = new Date().getFullYear()): AggregatedMetrics => {
    const currentYearPatients = patients.filter(p => p.dtDiagnostico.getFullYear() === filterYear);
    const activePatients = patients.filter(p => p.statusAtual.startsWith('Vivo'));
    const obitosCancer = patients.filter(p => p.statusAtual === 'Óbito por Câncer' && p.dtUltimaInfo.getFullYear() === filterYear);
    const remissao = patients.filter(p => p.statusAtual === 'Vivo, SOE' && !p.teveRecidiva && p.dtUltimaInfo.getFullYear() === filterYear);

    const topografiaCounts = patients.reduce((acc, p) => {
        acc[p.topo] = (acc[p.topo] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const estadiamentoCounts = patients.reduce((acc, p) => {
        acc[p.estadiamento] = (acc[p.estadiamento] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const faixaEtariaCounts: Record<string, number> = {
        '0-19 anos': 0, '20-39 anos': 0, '40-59 anos': 0, '60-79 anos': 0, '80+ anos': 0
    };
    patients.forEach(p => {
        if (p.idade < 20) faixaEtariaCounts['0-19 anos']++;
        else if (p.idade < 40) faixaEtariaCounts['20-39 anos']++;
        else if (p.idade < 60) faixaEtariaCounts['40-59 anos']++;
        else if (p.idade < 80) faixaEtariaCounts['60-79 anos']++;
        else faixaEtariaCounts['80+ anos']++;
    });

    const tratamentoCounts = patients.reduce((acc, p) => {
        acc[p.tipoTratamentoPrincipal] = (acc[p.tipoTratamentoPrincipal] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const generoCounts = patients.reduce((acc, p) => {
        acc[p.genero] = (acc[p.genero] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const currentMonth = new Date().getMonth();
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const tendenciaDiagnosticosMensal = Array(12).fill(0).map((_, i) => ({ mes: months[i], count: 0 }));
    const tendenciaObitosMensal = Array(12).fill(0).map((_, i) => ({ mes: months[i], count: 0 }));

    patients.forEach(p => {
        if (p.dtDiagnostico.getFullYear() === filterYear) {
            tendenciaDiagnosticosMensal[p.dtDiagnostico.getMonth()].count++;
        }
        if (p.statusAtual.includes('Óbito') && p.dtUltimaInfo.getFullYear() === filterYear) {
            tendenciaObitosMensal[p.dtUltimaInfo.getMonth()].count++;
        }
    });

    return {
        totalPacientesAtivos: activePatients.length,
        novosDiagnosticosAno: currentYearPatients.length,
        obitosPorCancerAno: obitosCancer.length,
        remissaoInferidaAno: remissao.length,
        mediaIdade: patients.length > 0 ? parseFloat((patients.reduce((sum, p) => sum + p.idade, 0) / patients.length).toFixed(1)) : 0,
        distribuicaoPorGenero: generoCounts as { Masculino: number; Feminino: number; Outros?: number },
        distribuicaoPorTopografia: Object.entries(topografiaCounts).map(([name, value]) => ({ name, value })),
        distribuicaoPorEstadiamento: Object.entries(estadiamentoCounts).map(([name, value]) => ({ name, value })),
        distribuicaoPorFaixaEtaria: Object.entries(faixaEtariaCounts).map(([name, value]) => ({ name, value })),
        distribuicaoPorTratamentoPrincipal: Object.entries(tratamentoCounts).map(([name, value]) => ({ name, value })),
        tendenciaNovosDiagnosticosMensal: tendenciaDiagnosticosMensal.slice(0, currentMonth + 1),
        tendenciaObitosMensal: tendenciaObitosMensal.slice(0, currentMonth + 1),
    };
};

// Exemplo de como ficaria, com nomes hipotéticos da macrorregião de Franca
const simulatedSPCitiesMapData = [
    { name: 'Franca', value: 150 },
    { name: 'Batatais', value: 70 },
    { name: 'Ituverava', value: 45 },
    { name: 'Orlândia', value: 30 },
    { name: 'São Joaquim da Barra', value: 40 },
    { name: 'Pedregulho', value: 20 },
    { name: 'Igarapava', value: 25 },
    { name: 'Patrocínio Paulista', value: 35 },
    { name: 'Cristais Paulista', value: 15 },
    { name: 'Restinga', value: 10 },
    // Adicione todas as cidades da macrorregião aqui, com valores mockados
    // CERTIFIQUE-SE DE QUE OS 'name' AQUI CORRESPONDAM AOS NOMES DOS MUNICÍPIOS NO SEU geojs-35-mun.json
];


const getSPCitiesMapOptions = (mapData) => ({
  title: {
    text: 'Distribuição de Casos de Câncer por Município (DRS Franca)', // Título ajustado
    left: 'center',
    textStyle: {
      color: '#E0E0E0'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}<br/>Casos: {c}',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textStyle: {
      color: '#fff'
    }
  },
  visualMap: {
    min: 0,
    max: 1000, // Ajuste este valor conforme a faixa de casos na DRS Franca
    left: 'left',
    top: 'bottom',
    text: ['Alto', 'Baixo'],
    calculable: true,
    inRange: {
      color: ['#1A2B42', '#346590']
    },
    textStyle: {
      color: '#E0E0E0'
    }
  },
  series: [
    {
      name: 'Casos por Município',
      type: 'map',
      map: 'Estado de São Paulo', // O nome que você registrou o GeoJSON do estado
      roam: true, // Ainda permite zoom e pan do usuário

      // --- AJUSTES AQUI ---
      // Removendo 'center' e 'zoom' para que o mapa não tenha foco inicial
      // e mostre a visualização padrão do GeoJSON carregado
      // center: [-47.4, -20.5], // REMOVIDO
      // zoom: 7, // REMOVIDO

      label: {
        show: true, // AGORA: Mostra todos os rótulos por padrão
        color: '#D0D0D0',
        fontSize: 9, // Ajuste o tamanho da fonte se necessário
        formatter: '{b}' // Mostra o nome do município incondicionalmente
      },
      emphasis: { // Estilo ao passar o mouse ainda é útil para destacar
        label: {
          show: true,
          color: '#FFF',
          fontSize: 12
        },
        itemStyle: {
          areaColor: '#607D8B'
        }
      },
      itemStyle: {
        borderColor: '#555',
        borderWidth: 0.8,
        areaColor: '#2C3E50'
      },
      data: mapData,
    }
  ]
});

// --- Componente Dashboard ---
export default function DashboardCancerInterativo() {
    const [loading, setLoading] = React.useState(true);
    const [timeRange, setTimeRange] = React.useState('6months');
    const [mapRegistered, setMapRegistered] = React.useState(false); // Novo estado para o registro do mapa

    const [allPatients, setAllPatients] = React.useState<PacienteOncologicoData[]>([]);
    const [aggregatedData, setAggregatedData] = React.useState<AggregatedMetrics | null>(null);

    const [selectedTopic, setSelectedTopic] = React.useState<'overview' | 'newDiagnoses' | 'topography' | 'estadiamento' | 'ageGroup' | 'treatment' | 'mortality' | 'remission'>('overview');
    const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Simula o carregamento e geração dos dados dos pacientes
        const patientDataTimer = setTimeout(() => {
            const patients = generateMockPatients(1550);
            setAllPatients(patients);
            setAggregatedData(aggregateData(patients));
            setLoading(false);
        }, 1500);

        // Carrega o GeoJSON e registra o mapa de Franca
        // ATENÇÃO: Substitua '/caminho/para/seu/franca.geojson' pelo caminho real do seu arquivo.
        // Este arquivo deve ser um GeoJSON válido para a cidade de Franca, SP.
        fetch('public/assets/geojs-35-mun.json') // Ex: '/franca.geojson' se estiver na pasta public
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(geoJson => {
                echarts.registerMap('Estado de São Paulo', geoJson);
                console.log('GeoJSON de Franca registrado com sucesso!');
                setMapRegistered(true);
            })
            .catch(error => {
                console.error('Erro ao carregar ou registrar GeoJSON de Franca:', error);
                // Você pode querer lidar com este erro na UI, por exemplo, não mostrar o mapa
                // ou exibir uma mensagem de erro. Por simplicidade, continuaremos sem o mapa.
            });

        return () => clearTimeout(patientDataTimer);
    }, []);

    const handleGoBack = () => {
        if (selectedCategory) {
            setSelectedCategory(null);
        } else {
            setSelectedTopic('overview');
        }
    };

    const getFilteredPatients = () => {
        let filtered = [...allPatients];
        const currentYear = new Date().getFullYear();

        if (selectedTopic === 'newDiagnoses') {
            filtered = filtered.filter(p => p.dtDiagnostico.getFullYear() === currentYear);
        } else if (selectedTopic === 'mortality') {
            filtered = filtered.filter(p => p.statusAtual.includes('Óbito') && p.dtUltimaInfo.getFullYear() === currentYear);
        } else if (selectedTopic === 'remission') {
            filtered = filtered.filter(p => p.statusAtual === 'Vivo, SOE' && !p.teveRecidiva && p.dtUltimaInfo.getFullYear() === currentYear);
        }

        if (selectedCategory) {
            if (selectedTopic === 'topography' || selectedTopic === 'overview' || selectedTopic === 'newDiagnoses' || selectedTopic === 'mortality' || selectedTopic === 'remission') {
                filtered = filtered.filter(p => p.topo === selectedCategory);
            } else if (selectedTopic === 'estadiamento') {
                filtered = filtered.filter(p => p.estadiamento === selectedCategory);
            } else if (selectedTopic === 'ageGroup') {
                filtered = filtered.filter(p => {
                    if (selectedCategory === '0-19 anos') return p.idade < 20;
                    if (selectedCategory === '20-39 anos') return p.idade >= 20 && p.idade < 40;
                    if (selectedCategory === '40-59 anos') return p.idade >= 40 && p.idade < 60;
                    if (selectedCategory === '60-79 anos') return p.idade >= 60 && p.idade < 80;
                    if (selectedCategory === '80+ anos') return p.idade >= 80;
                    return false;
                });
            } else if (selectedTopic === 'treatment') {
                filtered = filtered.filter(p => p.tipoTratamentoPrincipal === selectedCategory);
            }
        }
        return filtered;
    };

    const currentAggregatedData = React.useMemo(() => {
        if (!allPatients.length) return null;
        return aggregateData(getFilteredPatients());
    }, [allPatients, selectedTopic, selectedCategory]);

    // --- ECharts Options (Dinâmicas com base na seleção) ---
    const getChartTitleSuffix = () => {
        let suffix = '';
        if (selectedTopic === 'newDiagnoses') {
            suffix += ' (Novos Diagnósticos)';
        } else if (selectedTopic === 'mortality') {
            suffix += ' (Óbitos)';
        } else if (selectedTopic === 'remission') {
            suffix += ' (Remissão)';
        }
        if (selectedCategory) {
            suffix += ` de ${selectedCategory}`;
        } else if (selectedTopic === 'topography') {
            suffix += ` (Geral)`;
        }
        return suffix;
    };

    const getTopografiaOptions = () => ({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
            name: 'Casos por Topografia',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
            label: { show: false, position: 'center' },
            emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
            labelLine: { show: false },
            data: currentAggregatedData?.distribuicaoPorTopografia || [],
        }],
    });

    const getEstadiamentoOptions = () => ({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
            name: 'Estadiamento à Admissão',
            type: 'pie',
            radius: '50%',
            data: currentAggregatedData?.distribuicaoPorEstadiamento || [],
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
    });

    const getFaixaEtariaOptions = () => ({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
            type: 'category',
            data: currentAggregatedData?.distribuicaoPorFaixaEtaria.map(d => d.name) || [],
            axisLabel: { rotate: 30, interval: 0 }
        },
        yAxis: { type: 'value' },
        series: [{
            name: 'Número de Pacientes',
            type: 'bar',
            data: currentAggregatedData?.distribuicaoPorFaixaEtaria.map(d => d.value) || [],
            itemStyle: { color: purple[400] }
        }]
    });

    const getTratamentoPrincipalOptions = () => ({
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
            name: 'Tipo de Tratamento Principal',
            type: 'pie',
            radius: '50%',
            data: currentAggregatedData?.distribuicaoPorTratamentoPrincipal || [],
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
    });

    const getTendenciaDiagnosticosOptions = () => ({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: currentAggregatedData?.tendenciaNovosDiagnosticosMensal.map(d => d.mes) || [] },
        yAxis: { type: 'value' },
        series: [{
            name: 'Novos Diagnósticos',
            type: 'line',
            data: currentAggregatedData?.tendenciaNovosDiagnosticosMensal.map(d => d.count) || [],
            itemStyle: { color: green[600] },
            smooth: true,
        }],
    });

    const getTendenciaObitosOptions = () => ({
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: currentAggregatedData?.tendenciaObitosMensal.map(d => d.mes) || [] },
        yAxis: { type: 'value' },
        series: [{
            name: 'Óbitos',
            type: 'line',
            data: currentAggregatedData?.tendenciaObitosMensal.map(d => d.count) || [],
            itemStyle: { color: red[600] },
            smooth: true,
        }],
    });

    // --- Click Handlers para Interação ---
    const handleKpiClick = (topic: typeof selectedTopic) => {
        setSelectedTopic(topic);
        setSelectedCategory(null);
    };

    const handleChartSliceClick = (params: any, topic: typeof selectedTopic) => {
        if (params.name) {
            setSelectedTopic(topic);
            setSelectedCategory(params.name);
        }
    };

    // --- KPIs Principais (Visão Global) ---
    const kpiData = aggregatedData ? [
        { label: 'Total Pacientes Ativos', value: aggregatedData.totalPacientesAtivos, icon: <PeopleAltIcon sx={{ color: blue[500] }} />, status: 'info', onClick: () => handleKpiClick('overview'), },
        { label: 'Novos Diagnósticos (Ano)', value: aggregatedData.novosDiagnosticosAno, icon: <PersonAddIcon sx={{ color: green[500] }} />, status: 'online', onClick: () => handleKpiClick('newDiagnoses'), },
        { label: 'Óbitos por Câncer (Ano)', value: aggregatedData.obitosPorCancerAno, icon: <SentimentDissatisfiedIcon sx={{ color: red[500] }} />, status: 'offline', onClick: () => handleKpiClick('mortality'), },
        { label: 'Remissão Inferida (Ano)', value: aggregatedData.remissaoInferidaAno, icon: <FavoriteBorderIcon sx={{ color: purple[500] }} />, status: 'success', onClick: () => handleKpiClick('remission'), },
        { label: 'Média de Idade', value: aggregatedData.mediaIdade.toFixed(1), icon: <CakeIcon sx={{ color: amber[700] }} />, status: 'warning', onClick: () => handleKpiClick('ageGroup'), },
        { label: 'Masc. / Fem.', value: `${aggregatedData.distribuicaoPorGenero.Masculino} / ${aggregatedData.distribuicaoPorGenero.Feminino}`, icon: <TransgenderIcon sx={{ color: grey[700] }} />, status: 'info', onClick: () => handleKpiClick('overview'), },
    ] : [];

    return (
        <Box
            width="100%"
            minHeight="calc(100vh - 150px)"
            p={2}
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{ borderRadius: 2 }}
        >
            <Typography variant="h4" gutterBottom sx={{ color: '#333', fontWeight: 600 }} display={"flex"}>
                Dashboard Oncológico -{' '}
                {selectedCategory
                    ? selectedCategory
                    : selectedTopic === 'overview'
                        ? 'Visão Global'
                        : selectedTopic === 'newDiagnoses'
                            ? 'Novos Diagnósticos'
                            : selectedTopic === 'mortality'
                                ? 'Dados de Mortalidade'
                                : selectedTopic === 'remission'
                                    ? 'Dados de Remissão'
                                    : selectedTopic === 'ageGroup'
                                        ? 'Distribuição por Idade'
                                        : `Detalhes por ${selectedTopic}`}
                {(selectedTopic !== 'overview' || selectedCategory) && (
                    <Box ml={2}>
                        <Button
                            variant="contained"
                            color='secondary'
                            onClick={handleGoBack}
                            startIcon={<ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} />}
                            sx={{ backgroundColor: blue[700], '&:hover': { backgroundColor: blue[800] } }}
                        >
                            Voltar
                        </Button>
                    </Box>
                )}
            </Typography>

            {/* Adicionando a condição mapRegistered ao carregamento */}
            {loading || !currentAggregatedData || !mapRegistered ? (
                <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                    <CircularProgress size={60} sx={{ color: blue[500] }} />
                    <Typography variant="h6" sx={{ ml: 2, color: '#555' }}>Carregando dados e mapa de câncer...</Typography>
                </Box>
            ) : (
                <Box display="flex" flexDirection="column" gap={2} flex={1}>
                    {/* Indicadores de Status (KPIs) */}
                    <Box display="flex" flexWrap="wrap" gap={2} justifyContent="space-around">
                        {kpiData.map((item, i) => (
                            <Paper
                                key={i}
                                elevation={3}
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
                                    '&:hover': { transform: 'translateY(-5px)', cursor: 'pointer' },
                                    borderLeft: `5px solid ${item.status === 'online' ? green[600] :
                                        item.status === 'offline' ? red[600] :
                                            item.status === 'warning' ? amber[600] :
                                                item.status === 'success' ? purple[600] :
                                                    blue[600]
                                        }`,
                                }}
                                onClick={item.onClick}
                            >
                                {item.icon}
                                <Typography variant="subtitle2" color="text.secondary" mt={1} textAlign="center">
                                    {item.label}
                                </Typography>
                                <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 'bold', color: '#333' }}>
                                    {item.value}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Seção de Gráficos */}
                    <Box display="flex" flexWrap="wrap" gap={2} flex={1}>
                        {/* Gráfico de Distribuição por Topografia */}
                        {['overview', 'newDiagnoses', 'mortality', 'remission', 'ageGroup', 'estadiamento', 'treatment', 'topography'].includes(selectedTopic) && (
                            <Paper elevation={3} sx={{ flex: '1 1 48%', p: 2, borderRadius: 2, minHeight: '400px' }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#444' }}>
                                    Distribuição de Casos por Topografia {getChartTitleSuffix()}
                                </Typography>
                                <ReactECharts
                                    option={getTopografiaOptions()}
                                    onEvents={{ 'click': (params) => handleChartSliceClick(params, 'topography') }}
                                    style={{ height: '350px', width: '100%' }}
                                />
                            </Paper>
                        )}

                        {/* Gráfico de Distribuição por Estadiamento */}
                        {['overview', 'newDiagnoses', 'mortality', 'remission', 'ageGroup', 'topography', 'estadiamento', 'treatment'].includes(selectedTopic) && (
                            <Paper elevation={3} sx={{ flex: '1 1 48%', p: 2, borderRadius: 2, minHeight: '400px' }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#444' }}>
                                    Estadiamento à Admissão {getChartTitleSuffix()}
                                </Typography>
                                <ReactECharts
                                    option={getEstadiamentoOptions()}
                                    onEvents={{ 'click': (params) => handleChartSliceClick(params, 'estadiamento') }}
                                    style={{ height: '350px', width: '100%' }}
                                />
                            </Paper>
                        )}

                        {/* Gráfico de Distribuição por Faixa Etária */}
                        {['overview', 'newDiagnoses', 'mortality', 'remission', 'topography', 'estadiamento', 'treatment', 'ageGroup'].includes(selectedTopic) && (
                            <Paper elevation={3} sx={{ flex: '1 1 48%', p: 2, borderRadius: 2, minHeight: '400px' }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#444' }}>
                                    Distribuição por Faixa Etária {getChartTitleSuffix()}
                                </Typography>
                                <ReactECharts
                                    option={getFaixaEtariaOptions()}
                                    onEvents={{ 'click': (params) => handleChartSliceClick(params, 'ageGroup') }}
                                    style={{ height: '350px', width: '100%' }}
                                />
                            </Paper>
                        )}

                        {/* Gráfico de Distribuição por Tipo de Tratamento Principal */}
                        {['overview', 'newDiagnoses', 'mortality', 'remission', 'topography', 'estadiamento', 'ageGroup', 'treatment'].includes(selectedTopic) && (
                            <Paper elevation={3} sx={{ flex: '1 1 48%', p: 2, borderRadius: 2, minHeight: '400px' }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#444' }}>
                                    Tipos de Tratamento Principais {getChartTitleSuffix()}
                                </Typography>
                                <ReactECharts
                                    option={getTratamentoPrincipalOptions()}
                                    onEvents={{ 'click': (params) => handleChartSliceClick(params, 'treatment') }}
                                    style={{ height: '350px', width: '100%' }}
                                />
                            </Paper>
                        )}

                        {/* Novo Gráfico de Mapa de Franca */}
                        {mapRegistered && ( // Renderiza o mapa apenas se o GeoJSON foi registrado com sucesso
                            <Paper elevation={3} sx={{ flex: '1 1 100%', p: 2, borderRadius: 2, minHeight: '500px' }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#444' }}>
                                    Mapa de Casos por Região em Franca (Simulado)
                                </Typography>
                                <ReactECharts
                                    option={getSPCitiesMapOptions(simulatedSPCitiesMapData)}
                                    style={{ height: '450px', width: '100%' }}
                                />
                            </Paper>
                        )}

                        {/* Gráficos de Tendência com Filtro */}
                        <Paper elevation={3} sx={{ flex: '1 1 100%', p: 2, borderRadius: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 0, color: '#444' }}>
                                    Tendências Mensais {getChartTitleSuffix()}
                                </Typography>
                                <FormControl variant="standard" sx={{ width: 150 }}>
                                    <InputLabel id="time-range-select-label">Período</InputLabel>
                                    <Select
                                        labelId="time-range-select-label"
                                        id="time-range-select"
                                        value={timeRange}
                                        label="Período"
                                        variant="standard"
                                        sx={{ mt: 1 }}
                                        onChange={(e) => setTimeRange(e.target.value as string)}
                                    >
                                        <MenuItem value="6months">Últimos 6 Meses</MenuItem>
                                        <MenuItem value="12months">Últimos 12 Meses</MenuItem>
                                        <MenuItem value="24months">Últimos 24 Meses</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Box display="flex" flexWrap="wrap" gap={2}>
                                {/* Condicional para "Novos Diagnósticos por Mês" */}
                                {(selectedTopic === 'overview' || selectedTopic === 'newDiagnoses' || selectedTopic === 'topography' || selectedTopic === 'estadiamento' || selectedTopic === 'ageGroup' || selectedTopic === 'treatment' || selectedTopic === 'remission') && (
                                    <Box sx={{ flex: '1 1 48%', minHeight: '250px' }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ color: '#666' }}>
                                            Novos Diagnósticos por Mês {getChartTitleSuffix()}
                                        </Typography>
                                        <ReactECharts
                                            option={getTendenciaDiagnosticosOptions()}
                                            style={{ height: '250px', width: '100%' }}
                                        />
                                    </Box>
                                )}
                                {/* Condicional para "Óbitos por Mês" */}
                                {(selectedTopic === 'overview' || selectedTopic === 'mortality' || selectedTopic === 'topography' || selectedTopic === 'estadiamento' || selectedTopic === 'ageGroup' || selectedTopic === 'treatment' || selectedTopic === 'remission') && (
                                    <Box sx={{ flex: '1 1 48%', minHeight: '250px' }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ color: '#666' }}>
                                            Óbitos por Mês {getChartTitleSuffix()}
                                        </Typography>
                                        <ReactECharts
                                            option={getTendenciaObitosOptions()}
                                            style={{ height: '250px', width: '100%' }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            )}
        </Box>
    );
}