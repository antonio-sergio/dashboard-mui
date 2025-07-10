import * as React from 'react';
import { Box, Typography, useTheme, Divider, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface AdmissionInfoProps {
  bed: string;
  entryDate: string;
  doctor: string;
  initialDiagnosis: string;
  ward: string;
}

export default function PatientAdmissionInfo({
  bed,
  entryDate,
  doctor,
  initialDiagnosis,
  ward,
}: AdmissionInfoProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        borderRadius: 2,
        p: 2,
        boxShadow: theme.shadows[1],
        mb: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Informações da Internação
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        divider={<Divider orientation="vertical" flexItem />}
        useFlexGap
        flexWrap="wrap"
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            Leito
          </Typography>
          <Typography fontWeight={600}>{bed}</Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Data de Entrada
          </Typography>
          <Typography fontWeight={600}>{entryDate}</Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Médico Responsável
          </Typography>
          <Typography fontWeight={600}>{doctor}</Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Setor
          </Typography>
          <Typography fontWeight={600}>{ward}</Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Diagnóstico Inicial
          </Typography>
          <Typography fontWeight={600}>{initialDiagnosis}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
