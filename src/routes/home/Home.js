import { useMemo } from 'react';
import { use } from '../objects/use';
import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import { css3 } from '@toolz/css3/src/css3';

export const Home = () => {
   const imageForm = use.imageForm;

   const style = useMemo(() => {
      return {
         hiddenRows: {
            marginBottom: 8,
            visibility: imageForm.matchToPalette ? css3.visibility.visible : css3.visibility.hidden,
         },
         label: {
            fontWeight: css3.fontWeight.bold,
            marginRight: 8,
            textAlign: css3.textAlign.right
         },
         marginBottom8: {
            marginBottom: 8,
         }
      }
   }, [imageForm.matchToPalette]);

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
      <Row style={style.marginBottom8}>
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
      <Row style={style.marginBottom8}>
         <Column xs={2}>
            <div style={style.label}>
               Match to Palette:
            </div>
         </Column>
         <Column xs={10}>
            <div>
               <input
                  checked={imageForm.matchToPalette}
                  onChange={imageForm.handleMatchToPalette}
                  type={'checkbox'}
               />
            </div>
         </Column>
      </Row>
      <Row style={style.hiddenRows}>
         <Column xs={2}>
            <div style={style.label}>
               Algorithm:
            </div>
         </Column>
         <Column xs={10}>
            <div>
               <select
                  onChange={imageForm.handleAlgorithm}
                  value={imageForm.algorithm}
               >
                  <option value={1}>
                     RGB: Simple
                  </option>
                  <option value={2}>
                     RGB: Squared
                  </option>
                  <option value={3}>
                     RGB+: Simple
                  </option>
                  <option value={4}>
                     RGB+: Squared
                  </option>
                  <option value={5}>
                     RGB: Color Weighted
                  </option>
                  <option value={0}>
                     HSV: 3D
                  </option>
                  <option value={6}>
                     Delta-E
                  </option>
               </select>
            </div>
         </Column>
      </Row>
      <Row style={style.hiddenRows}>
         <Column xs={2}>
            <div style={style.label}>
               Palettes:
            </div>
         </Column>
         <Column xs={10}>
            <div>
               <input
                  checked={imageForm.palettes.basePaints}
                  name={'basePaints'}
                  onChange={imageForm.handlePalettes}
                  type={'checkbox'}
               />
               Base heavy body acrylics
            </div>
            <div>
               <input
                  checked={imageForm.palettes.halfWhites}
                  name={'halfWhites'}
                  onChange={imageForm.handlePalettes}
                  type={'checkbox'}
               />
               Half-Whites
            </div>
         </Column>
      </Row>
   </>
};
