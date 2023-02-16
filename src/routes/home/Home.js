import { use } from '../objects/use';
import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import { css3 } from '@toolz/css3/src/css3';
import './css/home.css';
import '../css/baseProperties.css';

export const Home = () => {
   const imageForm = use.imageForm;

   return <>
      <Row className={'marginBottom_8'}>
         <Column xs={2}>
            <div className={'label'}>
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
      <Row className={'marginBottom_8'}>
         <Column xs={2}>
            <div className={'label'}>
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
      <Row className={'marginBottom_8'}>
         <Column xs={2}>
            <div className={'label'}>
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
      <Row
         className={'marginBottom_8'}
         style={{visibility: imageForm.matchToPalette ? css3.visibility.visible : css3.visibility.hidden}}
      >
         <Column xs={2}>
            <div className={'label'}>
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
                     RGB
                  </option>
                  <option value={3}>
                     CMYK
                  </option>
                  <option value={2}>
                     XYZ
                  </option>
                  <option value={6}>
                     Delta-E
                  </option>
               </select>
            </div>
         </Column>
      </Row>
      <Row
         className={'marginBottom_8'}
         style={{visibility: imageForm.matchToPalette ? css3.visibility.visible : css3.visibility.hidden}}
      >
         <Column xs={2}>
            <div className={'label'}>
               Color or Greyscale:
            </div>
         </Column>
         <Column xs={10}>
            <div>
               <select
                  onChange={imageForm.handleColorOrGreyscale}
                  value={imageForm.colorOrGreyscale}
               >
                  <option value={'color'}>
                     Color
                  </option>
                  <option value={'greyscale'}>
                     Greyscale
                  </option>
               </select>
            </div>
         </Column>
      </Row>
      <Row
         className={'marginBottom_8'}
         style={{visibility: imageForm.matchToPalette ? css3.visibility.visible : css3.visibility.hidden}}
      >
         <Column xs={2}>
            <div className={'label'}>
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
            <div>
               <input
                  checked={imageForm.palettes.thirdWhites}
                  name={'thirdWhites'}
                  onChange={imageForm.handlePalettes}
                  type={'checkbox'}
               />
               Third-Whites
            </div>
            <div>
               <input
                  checked={imageForm.palettes.quarterWhites}
                  name={'quarterWhites'}
                  onChange={imageForm.handlePalettes}
                  type={'checkbox'}
               />
               Quarter-Whites
            </div>
         </Column>
      </Row>
   </>;
};
