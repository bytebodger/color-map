import { useMemo } from 'react';
import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import { Home } from './routes/home/Home';
import { Route, Routes } from 'react-router-dom';

export const UI = () => {

   const style = useMemo(() => {
      return {
         marginTop20: {
            marginTop: 20,
         },
         row: {
            marginTop: 20,
            minWidth: 350,
         },
      }
   }, []);

   return <>
      <Row style={style.row}>
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
            <div style={style.marginTop20}>
               <canvas id={'canvas'}></canvas>
            </div>
         </Column>
         <Column xs={1}/>
      </Row>
   </>
};
