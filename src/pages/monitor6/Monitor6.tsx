import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { BarChart } from '@mui/x-charts';

const hospitais = [
  {
    nome: 'Santa Casa de Franca',
    setores: ['UTI', 'Pronto Socorro', '3º Andar', 'Centro Cirúrgico'],
  },
  {
    nome: 'Hospital do Coração',
    setores: ['Enfermaria', 'Emergência', 'Pediatria'],
  },
 
];

const regras = [
  { regra: 'NEWS ≥ 7', ação: 'Criar Alerta Vermelho' },
  { regra: 'Temperatura > 39°C', ação: 'Gerar Ocorrência Crítica' },
];

const schedules = [
  { nome: 'Importação de exames', cron: '*/10 * * * *', status: 'OK' },
  { nome: 'Verificação de leitos', cron: '*/5 * * * *', status: 'OK' },
  { nome: 'Atualização de pacientes', cron: '*/15 * * * *', status: 'OK' },
];

export default function Monitor6() {
  const totalSetores = hospitais.reduce((acc, h) => acc + h.setores.length, 0);

  return (
    <Box
      p={3}
      height="calc(100vh - 150px)"
      display="flex"
      flexDirection="column"
      gap={3}
      width={"100%"}
    >
      <Typography variant="h5" gutterBottom>
        Gestão e Configurações
      </Typography>

      {/* Painel de resumo */}
      <Box display="flex" gap={2} flexWrap="wrap">
        <Paper sx={{ p: 2, flex: '1 1 200px' }}>
          <Typography variant="subtitle2">Hospitais Cadastrados</Typography>
          <Typography variant="h4">{hospitais.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: '1 1 200px' }}>
          <Typography variant="subtitle2">Setores Ativos</Typography>
          <Typography variant="h4">{totalSetores}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: '1 1 200px' }}>
          <Typography variant="subtitle2">Regras Aplicadas</Typography>
          <Typography variant="h4">{regras.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: '1 1 200px' }}>
          <Typography variant="subtitle2">Schedules Ativos</Typography>
          <Typography variant="h4">{schedules.length}</Typography>
        </Paper>
      </Box>


      <Box display={"flex"} gap={2} justifyContent={"space-between"}>

        {/* Hospitais e setores */}
        <Paper sx={{ p: 2,flex: '1 1 50%', width: "49%" }}>
          <Typography variant="h6">Hospitais e Setores</Typography>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" gap={2} flexWrap="wrap">
            {hospitais.map((h, index) => (
              <Paper key={index} sx={{ p: 2, flex: '1 1 320px' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">{h.nome}</Typography>
                  <Box>
                    <IconButton><EditIcon /></IconButton>
                    <IconButton><DeleteIcon /></IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Setores: {h.setores.join(', ')}
                </Typography>
              </Paper>
            ))}
          </Box>
          <Button startIcon={<AddIcon />} sx={{ mt: 2 }}>
            Adicionar Hospital
          </Button>
        </Paper>

        {/* Regras */}
        <Paper sx={{ p: 2,flex: '1 1 50%', width: "49%" }}>
          <Typography variant="h6">Regras de Alerta e Conteúdo</Typography>
          <Divider sx={{ my: 1 }} />
          <List dense>
            {regras.map((r, i) => (
              <ListItem key={i}
                secondaryAction={<IconButton><EditIcon /></IconButton>}
              >
                <ListItemText primary={`Se ${r.regra}, então ${r.ação}`} />
              </ListItem>
            ))}
          </List>
          <Button startIcon={<AddIcon />}>Nova Regra</Button>
        </Paper>

      </Box>


      {/* Schedules */}
      <Box display="flex" gap={2}>
        <Paper sx={{ p: 2, flex: '1 1 50%', height: 280 }}>
          <Typography variant="h6">Schedules e Integrações</Typography>
          <Divider sx={{ my: 1 }} />
          <List dense>
            {schedules.map((s, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={s.nome}
                  secondary={`Frequência: ${s.cron} | Status: ${s.status}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Gráfico de setores por hospital */}
        <Paper sx={{ p: 2, flex: '1 1 50%', height: 280 }}>
          <Typography variant="h6" gutterBottom>
            Setores por Hospital
          </Typography>
          <BarChart
            height={200}
            xAxis={[{ scaleType: 'band', data: hospitais.map(h => h.nome), categoryGapRatio: 0.7  }]}
            series={[
              {
                label: 'Setores',
                data: hospitais.map(h => h.setores.length),
                color: '#1976d2',
              },
            ]}
          />
        </Paper>
      </Box>
    </Box>
  );
}
