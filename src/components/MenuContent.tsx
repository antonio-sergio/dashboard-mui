import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { Link } from 'react-router-dom';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon /> },
  { text: 'Analítico', icon: <AnalyticsRoundedIcon /> },
  { text: 'Pacientes', icon: <PeopleRoundedIcon /> },
  { text: 'Tasks', icon: <AssignmentRoundedIcon /> },
];

const secondaryListItems = [
  { text: 'Configurações', icon: <SettingsRoundedIcon /> },
  { text: 'Followups', icon: <InfoRoundedIcon /> },
  { text: 'Manuais', icon: <HelpRoundedIcon /> },
];

const monitorRoutes = [
  { text: 'Monitor 1', icon: <HomeRoundedIcon />, path: '/monitor1' },
  { text: 'Monitor 2', icon: <AnalyticsRoundedIcon />, path: '/monitor2' },
  { text: 'Monitor 3', icon: <PeopleRoundedIcon />, path: '/monitor3' },
  { text: 'Monitor 4', icon: <AssignmentRoundedIcon />, path: '/monitor4' },
  { text: 'Monitor 5', icon: <SettingsRoundedIcon />, path: '/monitor5' },
  { text: 'Monitor 6', icon: <InfoRoundedIcon />, path: '/monitor6' },
  { text: 'RHC', icon: <InfoRoundedIcon />, path: '/rhc' },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      {/* <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
      <List dense>
        {monitorRoutes.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
