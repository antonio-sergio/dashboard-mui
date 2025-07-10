import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

type Alert = {
  id: number;
  type: 'Crítico' | 'Aviso' | 'Info';
  fullMessage: string;
  timestamp: string;
  patientName: string;
  unit: string;
};

let alertId = 1;

function generateFakeAlert(): Alert {
  const types = ['Crítico', 'Aviso', 'Info'] as const;
  const longMessages = [
    'Paciente apresentou quadro de hipertensão severa nas últimas horas. Recomenda-se monitoramento contínuo e ajuste da medicação imediatamente.',
    'Sinais de hipoglicemia foram identificados após o jejum prolongado. Avaliar a necessidade de administração intravenosa de glicose.',
    'Temperatura corporal aumentou progressivamente nas últimas 3 horas, indicando possível processo infeccioso em evolução.',
    'Frequência cardíaca apresenta irregularidades consistentes, possivelmente associadas a arritmia. ECG solicitado.',
    'Paciente com histórico de quedas relatou novo episódio durante a madrugada. Avaliação neurológica necessária.',
  ];
  const names = ['Maria Silva', 'João Oliveira', 'Ana Santos', 'Pedro Lima', 'Lucas Souza'];
  const units = ['UTI', 'Pronto Socorro', '3º Andar', '4° Andar', 'Pediatria'];

  return {
    id: alertId++,
    type: types[Math.floor(Math.random() * types.length)],
    fullMessage: longMessages[Math.floor(Math.random() * longMessages.length)],
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    patientName: names[Math.floor(Math.random() * names.length)],
    unit: units[Math.floor(Math.random() * units.length)],
  };
}

export default function LiveAlerts() {
  const [currentAlert, setCurrentAlert] = React.useState<Alert | null>(null);
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');

  const ALERT_DURATION = 10000; // 15s

  React.useEffect(() => {
    const generateAndSetAlert = () => {
      const newAlert = generateFakeAlert();
      setCurrentAlert(newAlert);
    };

    generateAndSetAlert();

    const interval = setInterval(() => {
      generateAndSetAlert();
    }, ALERT_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 25,
        zIndex: 1300,
        width: '100%',
        maxWidth: 500,
      }}
    >
      <AnimatePresence mode="wait">
        {currentAlert && (
          <motion.div
            key={currentAlert.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Card
              variant="outlined"
              sx={{
                borderLeft: '8px solid',
                borderColor:
                  currentAlert.type === 'Crítico'
                    ? 'error.main'
                    : currentAlert.type === 'Aviso'
                      ? 'warning.main'
                      : 'info.main',
                backgroundColor: isDark ? '#1e1e1e' : '#fff',
                color: isDark ? '#fff' : 'text.primary',
                boxShadow: 6,
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color={
                    currentAlert.type === 'Crítico'
                      ? 'error.main'
                      : currentAlert.type === 'Aviso'
                        ? 'warning.main'
                        : 'info.main'
                  }
                  height={15}
                >
                  {currentAlert.type}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentAlert.timestamp}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 1 }} />

              <Box display={"flex"} justifyContent={"space-between"}>

                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  Paciente: {currentAlert.patientName}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Setor: {currentAlert.unit}
                </Typography>
              </Box>


              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {currentAlert.fullMessage}
              </Typography>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
