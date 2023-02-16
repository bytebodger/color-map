import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './routes/home/Home';
import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import './ui.css';
import './routes/css/baseProperties.css';

const drawerWidth = 240;
const navItems = ['Home', 'About'];

export const UI = props => {
   const {window} = props;
   const [mobileOpen, setMobileOpen] = useState(false);

   const handleDrawerToggle = () => {
      setMobileOpen(prevState => !prevState);
   };

   const getNavItemButtons = () => {
      return navItems.map(item => (
         <Button
            key={item}
            sx={{color: '#fff'}}
         >
            {item}
         </Button>
      ));
   }

   const getNavItems = () => {
      return navItems.map((item) => (
         <ListItem
            disablePadding={true}
            key={item}
         >
            <ListItemButton sx={{textAlign: 'center'}}>
               <ListItemText primary={item}/>
            </ListItemButton>
         </ListItem>
      ));
   }

   const drawer = (
      <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
         <Typography variant='h6' sx={{my: 2}}>
            Paint Map Studio
         </Typography>
         <Divider/>
         <List>
            {getNavItems()}
         </List>
      </Box>
   );

   const container = window !== undefined ? () => window().document.body : undefined;

   return (
      <Box sx={{display: 'flex'}}>
         <CssBaseline/>
         <AppBar component={'nav'}>
            <Toolbar>
               <IconButton
                  aria-label={'open drawer'}
                  color={'inherit'}
                  edge={'start'}
                  onClick={handleDrawerToggle}
                  sx={{mr: 2, display: {sm: 'none'}}}
               >
                  <MenuIcon/>
               </IconButton>
               <Typography
                  component={'div'}
                  sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                  variant={'h6'}
               >
                  Paint Map Studio
               </Typography>
               <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                  {getNavItemButtons()}
               </Box>
            </Toolbar>
         </AppBar>
         <Box component='nav'>
            <Drawer
               container={container}
               variant={'temporary'}
               open={mobileOpen}
               onClose={handleDrawerToggle}
               ModalProps={{keepMounted: true}}
               sx={{
                  display: {xs: 'block', sm: 'none'},
                  '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
               }}
            >
               {drawer}
            </Drawer>
         </Box>
         <Box
            component={'main'}
            sx={{p: 3}}
         >
            <Toolbar/>
         </Box>
         <Row className={'row'}>
            <Column>
               <Routes>
                  <Route
                     element={
                        <Home/>}
                     index={true}
                     path={'/'}
                  />
                  <Route
                     element={
                        <Home/>}
                     path={'*'}
                  />
               </Routes>
               <div className={'marginTop_20'}>
                  <canvas id={'canvas'}></canvas>
               </div>
            </Column>
         </Row>
      </Box>
   );
};

UI.propTypes = {
   /**
    * Injected by the documentation to work in an iframe.
    * You won't need it on your project.
    */
   window: PropTypes.func,
};
