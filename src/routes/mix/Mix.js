import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import { useState, useRef, useMemo } from 'react';
import '../../common/css/baseProperties.css';
import { FormControl, InputLabel, Select, OutlinedInput, MenuItem, Card, CardContent, Button } from '@mui/material';
import { palettes } from '../../common/arrays/palettes';
import './css/mix.css';
import { allow } from '@toolz/allow-react';
import { is } from '../../common/objects/is';
import { css3 } from '@toolz/css3/src/css3';
import { useImage } from '../../common/hooks/useImage';

export const Mix = () => {
   const [paints, setPaints] = useState([]);
   const palette = useRef(palettes.basePaints);
   const image = useImage();
   let mixed;

   useMemo(() => {
      const compare = (a, b) => {
         const aName = a.name.toLowerCase();
         const bName = b.name.toLowerCase();
         if (aName > bName)
            return -1;
         else if (bName < aName)
            return 1;
         else
            return 0;
      };

      palette.current = [...palettes.basePaints];
      palette.current.sort(compare).reverse();
   }, []);

   const decreaseUnits = (paintName = '') => {
      allow.aString(paintName, is.not.empty);
      const updatedPaints = [...paints];
      const index = updatedPaints.findIndex(paint => paint.name === paintName);
      updatedPaints[index].units--;
      if (updatedPaints[index].units === 0)
         updatedPaints.splice(index, 1);
      setPaints(updatedPaints);
   }

   const loadMixedColor = () => {
      const paintsToBeMixed = [];
      paints.forEach(paint => {
         const {red, green, blue} = paint;
         for (let i = 0; i < paint.units; i++) {
            paintsToBeMixed.push({
               red,
               green,
               blue,
               name: '',
            })
         }
      })
      const {red, green, blue} = image.mixRgbColorsSubtractively(paintsToBeMixed);
      mixed = {
         red,
         green,
         blue,
      }
   }

   const getPaintCards = () => {
      return paints.map(paint => {
         return (
            <Card
               className={'paintCard'}
               key={`paintCard-${paint.name}`}
               variant={'outlined'}
            >
               <CardContent>
                  <div
                     className={'paintCardColorSwatch'}
                     style={{backgroundColor: `rgb(${paint.red}, ${paint.green}, ${paint.blue}`}}
                  />
                  <div className={'paintCardDescription'}>
                     {paint.name}
                     <br/>
                     (R: {paint.red}, G: {paint.green}, B: {paint.blue})
                  </div>
                  <div className={'textAlignCenter'}>
                     <Button
                        onClick={() => decreaseUnits(paint.name)}
                        size={'small'}
                        style={{fontSize: '2.5em', lineHeight: 1.2, marginLeft: 24, marginRight: 24, padding: 0}}
                        variant={'outlined'}
                     >
                        -
                     </Button>
                     <span style={{fontSize: '2em', position: 'relative', top: 6}}>
                        {paint.units}
                     </span>
                     <Button
                        className={'adjustIncrementButton'}
                        onClick={() => increaseUnits(paint.name)}
                        size={'small'}
                        style={{fontSize: '2.5em', lineHeight: 1.2, marginLeft: 24, marginRight: 24, padding: 0}}
                        variant={'outlined'}
                     >
                        +
                     </Button>
                  </div>
               </CardContent>
            </Card>
         );
      });
   };

   const getPaintOptions = () => {
      const options = [];
      palette.current.forEach(paint => {
         if (paints.some(chosenPaint => chosenPaint.name === paint.name))
            return;
         options.push(
            <MenuItem
               key={`option-${paint.name}`}
               value={paint.name}
            >
               <div
                  className={'paintOptionSwatch'}
                  style={{backgroundColor: `rgb(${paint.red}, ${paint.green}, ${paint.blue}`}}
               />
               {paint.name}
            </MenuItem>,
         );
      });
      return options;
   };

   const handleAddPaint = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value: paintName} = event.target;
      const paint = palette.current.find(paint => paint.name === paintName);
      paint.units = 1;
      setPaints(paints => [paint, ...paints]);
   };

   const increaseUnits = (paintName = '') => {
      allow.aString(paintName, is.not.empty);
      const updatedPaints = [...paints];
      const index = updatedPaints.findIndex(paint => paint.name === paintName);
      updatedPaints[index].units++;
      setPaints(updatedPaints);
   }

   loadMixedColor();

   return <>
      <h4 className={'marginBottom_48'}>Paint Mixing</h4>
      <Row
         className={'marginBottom_48'}
         style={{visibility: paints.length ? css3.visibility.visible : css3.visibility.hidden}}
      >
         <Column>
            <Card
               className={'width_350'}
               variant={'outlined'}
            >
               <CardContent>
                  <h4 className={'marginTop_0'}>Result:</h4>
                  <div
                     className={'paintCardColorSwatch'}
                     style={{backgroundColor: `rgb(${mixed.red}, ${mixed.green}, ${mixed.blue})`}}
                  />
                  <div className={'paintCardDescription'}>
                     (R: {mixed.red}, G: {mixed.green}, B: {mixed.blue})
                  </div>
               </CardContent>
            </Card>
         </Column>
      </Row>
      <Row className={'marginBottom_48'}>
         <Column>
            <FormControl sx={{m: 1, width: 300}}>
               <InputLabel
                  id={'block-size-label'}
                  size={'small'}
               >
                  Add Paints
               </InputLabel>
               <Select
                  input={
                     <OutlinedInput label={'Add Paints'}/>}
                  labelId={'add-paints-label'}
                  onChange={handleAddPaint}
                  size={'small'}
                  value={''}
               >
                  {getPaintOptions()}
               </Select>
            </FormControl>
         </Column>
      </Row>
      <Row style={{display: paints.length ? css3.dislay.inherit : css3.dislay.none}}>
         <Column>
            {getPaintCards()}
         </Column>
      </Row>
   </>;
};