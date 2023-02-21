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
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import './ui.css';
import './common/css/baseProperties.css';
import { About } from './routes/about/About';
import { IndexContainer } from './routes/index/components/IndexContainer';
import { Palettes } from './routes/palettes/Palettes';

const drawerWidth = 240;
const navItems = ['Home', 'Palettes', 'About'];

export const UI = props => {
   const {window} = props;
   const [mobileOpen, setMobileOpen] = useState(false);
   const navigate = useNavigate();

   const container = window !== undefined ? () => window().document.body : undefined;

   const getNavItemButtons = () => {
      return navItems.map(item => (
         <Button
            key={item}
            onClick={() => navigate('/' + item.toLowerCase())}
            sx={{color: '#fff'}}
         >
            {item}
         </Button>
      ));
   };

   const getNavItems = () => {
      return navItems.map((item) => (
         <ListItem
            disablePadding={true}
            key={item}
            onClick={() => navigate('/' + item.toLowerCase())}
         >
            <ListItemButton sx={{textAlign: 'center'}}>
               <ListItemText primary={item}/>
            </ListItemButton>
         </ListItem>
      ));
   };

   const handleDrawerToggle = () => setMobileOpen(prevState => !prevState);

   return <>
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
                  <span className={'marginLeft_24'}>
               Paint Map Studio
            </span>
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
         <Box component={'nav'}>
            <Drawer
               ModalProps={{keepMounted: true}}
               container={container}
               onClose={handleDrawerToggle}
               open={mobileOpen}
               sx={{
                  display: {xs: 'block', sm: 'none'},
                  '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
               }}
               variant={'temporary'}
            >
               <Box
                  onClick={handleDrawerToggle}
                  sx={{textAlign: 'center'}}
               >
                  <Typography
                     sx={{my: 2}}
                     variant={'h6'}
                  >
                     Paint Map Studio
                  </Typography>
                  <Divider/>
                  <List>
                     {getNavItems()}
                  </List>
               </Box>
            </Drawer>
         </Box>
         <Box
            component={'main'}
            sx={{p: 3}}
         >
            <Toolbar/>
         </Box>
      </Box>
      <Row className={'row'}>
         <Column xs={1}/>
         <Column xs={10}>
            <Routes>
               <Route
                  element={
                     <About/>}
                  path={'/about'}
               />
               <Route
                  element={
                     <IndexContainer/>
                  }
                  index={true}
                  path={'/'}
               />
               <Route
                  element={
                     <IndexContainer/>}
                  path={'*'}
               />
               <Route
                  element={
                     <Palettes/>}
                  path={'/palettes'}
               />
            </Routes>
            <div className={'marginTop_20'}>
               <canvas id={'canvas'}></canvas>
            </div>
         </Column>
         <Column xs={1}/>
      </Row>
   </>;
};

UI.propTypes = {
   /**
    * Injected by the documentation to work in an iframe.
    * You won't need it on your project.
    */
   window: PropTypes.func,
};
