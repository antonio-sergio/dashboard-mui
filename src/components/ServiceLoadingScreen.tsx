import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { motion } from 'framer-motion';

type Step = {
    label: string;
};

type Props = {
    steps: Step[];
    onComplete: () => void;
    delay?: number;
};

const iconVariants = {
    initial: { scale: 0, rotate: -90, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
};

const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
};

const ServiceLoadingScreen: React.FC<Props> = ({ steps, onComplete, delay = 1000 }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < steps.length) {
            const timer = setTimeout(() => setCurrentStep((prev) => prev + 1), delay);
            return () => clearTimeout(timer);
        } else {
            const finishTimer = setTimeout(onComplete, 600); // pausa no final
            return () => clearTimeout(finishTimer);
        }
    }, [currentStep, steps.length, delay, onComplete]);

    return (
        <Box

            height={"100vh"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Box
                sx={{p: 2, minWidth: 450, minHeight: 300}}
                border={"1px solid #fff"}
                borderRadius={2}
            >
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Inicializando Monitoramento
                </Typography>

                <Box mt={3}>
                    {steps.map((step, index) => {
                        const isDone = index < currentStep;
                        const isActive = index === currentStep;

                        return (
                            <Box
                                key={index}
                                display="flex"
                                alignItems="center"
                                mb={2}
                                component={motion.div}
                                variants={textVariants}
                                initial="initial"
                                animate={isDone || isActive ? 'animate' : 'initial'}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Box mr={2} component={motion.div} variants={iconVariants}>
                                    {isDone ? (
                                        <CheckCircleIcon color="success" />
                                    ) : isActive ? (
                                        <HourglassTopIcon color="warning" />
                                    ) : (
                                        <CircularProgress size={20} color="inherit" />
                                    )}
                                </Box>
                                <Typography variant="body1">
                                    {step.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default ServiceLoadingScreen;
