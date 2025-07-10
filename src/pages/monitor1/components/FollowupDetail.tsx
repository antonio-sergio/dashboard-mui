import * as React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Chip,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { alpha } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts';
import PatientAdmissionInfo from './AdmissionInProps';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';


// Simulando os dados mock
const mockFollowups = [
  {
    id: 1,
    patient: 'Maria Silva',
    openedAt: '2025-07-01',
    responsible: 'Ana Paula',
    status: 'Ativo',
    diagnosis: 'Infecção urinária',
    role: 'Enfermeiro (a)'
  },
  {
    id: 2,
    patient: 'João Oliveira',
    openedAt: '2025-07-05',
    responsible: 'Carlos Mendes',
    status: 'Encerrado',
    diagnosis: 'Dengue',
    role: 'Técnico Enfermagem'
  },
  {
    id: 3,
    patient: 'Ana Santos',
    openedAt: '2025-07-07',
    responsible: 'Luiz Fernando',
    status: 'Ativo',
    diagnosis: 'Pneumonia',
    role: 'Enfermeiro (a)'
  },
];

const mockFollowupEvents = [
  {
    id: 1,
    type: 'Sinais Vitais',
    description: 'PA 120x80, FC 72 bpm',
    time: '08:00',
  },
  {
    id: 2,
    type: 'Medicação',
    description: 'Dipirona 1g EV administrada',
    time: '08:30',
  },
  {
    id: 3,
    type: 'Anotação Médica',
    description: 'Paciente com dor abdominal leve.',
    time: '09:00',
  },
  {
    id: 4,
    type: 'Exame',
    description: 'Solicitado hemograma completo.',
    time: '10:00',
  },
  {
    id: 5,
    type: 'Protocolo',
    description: 'Início de protocolo de sepse.',
    time: '11:00',
  },
  {
    id: 6,
    type: 'Sinais Vitais',
    description: 'PA 120x80, FC 72 bpm, FR 20',
    time: '11:30',
  },
];

interface FollowupDetailProps {
  id: number;
  onBack: () => void;
}


export default function FollowupDetail({ id, onBack }: FollowupDetailProps) {
  const theme = useTheme();

  const followup = mockFollowups.find(f => f.id === id);

  if (!followup) {
    return <Typography>Follow-up não encontrado</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 150px)',
        justifyContent: "space-between",
        width: "100%"
      }}
    >
      {/* Timeline */}
      <Box
        height={"70vh"}
        overflow={"visible"}
        maxWidth={500}
        minWidth={300}
        mt={-3}
      >
        <Timeline position="right">
          {mockFollowupEvents.map((event, index) => (
            <TimelineItem key={event.id}>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index < mockFollowupEvents.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                    borderRadius: 2,
                    boxShadow: theme.shadows[1],
                    width: 300
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    {event.time}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600} color="primary">
                    {event.type}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {event.description}
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>

      <Box display={"flex"} flexDirection={"column"} >


        <Box
          sx={{
            flex: 1,
            px: 3,
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
          }}
        >
          {/* Gráfico do Score NEWS */}
          <Box
            sx={{
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              p: 2,
              boxShadow: theme.shadows[1],
              width: "60%"
            }}
          >
            <Typography variant="h6" gutterBottom>
              Evolução do Score NEWS
            </Typography>

            <Box height={240}>
              <LineChart
                height={240}
                xAxis={[{ scaleType: 'point', data: ['07:00', '08:00', '09:00', '10:00', '11:00'] }]}
                series={[
                  {
                    data: [6, 7, 8, 9, 7],
                    label: 'Score NEWS',
                    color: theme.palette.primary.main,
                  },
                ]}
              />

            </Box>
          </Box>
          {/* Gestão do Follow-up */}
          <Box
            sx={{
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              p: 2,
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography variant="h6" gutterBottom>
              Gestão do Follow-up
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Aberto em:</strong> {followup.openedAt} às 07:45
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Gatilho:</strong> NEWS  7
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Responsável Técnico:</strong> {followup.responsible}
            </Typography>

            <Box
              mt={2}
              sx={{
                display: 'inline-block',
                color: theme.palette.error.contrastText,
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.9),
                },
              }}
            >
              Encerrar Acompanhamento
            </Box>
          </Box>


        </Box>

        {/* Comentários ou Ações */}
        <Box
          sx={{
            flex: 1,
            px: 3,
            mt: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Comentários sobre o paciente
          </Typography>

          <Box
            sx={{
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              p: 2,
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Utilize este campo para registrar observações, mensagens para a equipe ou planos de conduta.
            </Typography>

            <Box mt={1} display="flex" flexDirection="column" gap={2}>
              <textarea
                placeholder="Escreva uma anotação..."
                style={{
                  padding: '10px',
                  borderRadius: 6,
                  border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                  color: theme.palette.text.primary,
                  resize: 'vertical',
                  minHeight: 100,
                  fontFamily: 'inherit',
                }}
              />

              <Box display="flex" justifyContent="flex-end">
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    color: theme.palette.primary.contrastText,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.9),
                    },
                  }}
                >
                  Enviar Comentário
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box px={3} mt={3}>
          <PatientAdmissionInfo
            bed="Leito 302-B"
            entryDate="30/07/2025"
            doctor="Dra. Mariana Rocha"
            initialDiagnosis="Pneumonia"
            ward="3º Andar"
          />

        </Box>

      </Box>



      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          boxShadow: theme.shadows[1],
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Informações do Paciente
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" gutterBottom>
            <strong>Paciente:</strong> {followup.patient}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>ID do Follow-up:</strong> #{followup.id}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Aberto em:</strong> {followup.openedAt}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Responsável:</strong> {followup.responsible}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Status:</strong>{' '}
            <Chip
              label={followup.status}
              color={followup.status === 'Ativo' ? 'success' : 'default'}
              size="small"
            />
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
            <strong>Diagnóstico:</strong> {followup.diagnosis}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Total de eventos: {mockFollowupEvents.length}
          </Typography>

          <Box mt={2}>
            <Typography
              variant="body2"
              sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
              onClick={onBack}
            >
              ← Voltar
            </Typography>
          </Box>
        </Box>

        {/* Contato e Ações */}
        <Box mt={3}>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="caption" fontWeight={600}>
            Contato do Setor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (11) 2345-6789
          </Typography>

          <Typography variant="caption" fontWeight={600} mt={1}>
            Hospital
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Santa Casa de Franca
          </Typography>

          <Typography variant="caption" fontWeight={600} mt={1}>
            Médico Responsável
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dr. Carlos Mendes – CRM 123456
          </Typography>

          <Stack direction="row" spacing={1} mt={2}>
            <IconButton
              size="small"
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
            >
             <WhatsAppIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="primary"
              size="small"
              onClick={() => window.open('mailto:contato@hospital.com')}
            >
              <EmailIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Box>

    </Box>
  );
}
