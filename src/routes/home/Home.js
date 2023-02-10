import { useMemo } from 'react';
import { use } from '../objects/use';
import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import { css3 } from '@toolz/css3/src/css3';

export const Home = () => {
   const imageForm = use.imageForm;

   const style = useMemo(() => {
      return {
         label: {
            fontWeight: css3.fontWeight.bold,
            marginRight: 8,
            textAlign: css3.textAlign.right
         },
         marginBottom8: {
            marginBottom: 8,
         }
      }
   }, []);

   return <>
      <Row style={style.marginBottom8}>
         <Column xs={2}>
            <div style={style.label}>
               Image File:
            </div>
         </Column>
         <Column xs={10}>
            <div>
               <input
                  accept={'image/*'}
                  id={'file'}
                  onChange={imageForm.handleFile}
                  type={'file'}
               />
            </div>
         </Column>
      </Row>
      <Row>
         <Column xs={2}>
            <div style={style.label}>
               Block Size:
            </div>
         </Column>
         <Column xs={10}>
            <div>
               <input
                  max={100}
                  min={1}
                  onChange={imageForm.handleBlockSize}
                  step={1}
                  type={'number'}
                  value={imageForm.blockSize}
               />
            </div>
         </Column>
      </Row>
   </>
};
