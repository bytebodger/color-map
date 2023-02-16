import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import { Home } from './routes/home/Home';
import { Route, Routes } from 'react-router-dom';
import './routes/css/baseProperties.css';
import './ui.css';

export const UI = () => {
   return <>
      <Row className={'row'}>
         <Column xs={1}/>
         <Column xs={10}>
            <Routes>
               <Route
                  element={<Home/>}
                  index={true}
                  path={'/'}
               />
               <Route
                  element={<Home/>}
                  path={'*'}
               />
            </Routes>
            <div className={'marginTop_20'}>
               <canvas id={'canvas'}></canvas>
            </div>
         </Column>
         <Column xs={1}/>
      </Row>
   </>
};
