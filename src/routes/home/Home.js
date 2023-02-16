import { use } from '../objects/use';
import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import { css3 } from '@toolz/css3/src/css3';
import './css/home.css';
import '../css/baseProperties.css';
import { inputType } from '../objects/inputType';
import { algorithm as algorithms } from '../objects/algorithm';
import { Button, Select, MenuItem, Checkbox, OutlinedInput, ListItemText, InputLabel, FormControl, FormGroup, FormControlLabel } from '@mui/material';
import { useRef } from 'react';

export const Home = () => {
   const imageForm = use.imageForm;
   const selectImageInputRef = useRef(null);

   const getAlgorithmOptions = () => {
      const options = [];
      Object.keys(algorithms).forEach(key => {
         options.push(
            <MenuItem
               key={`algorithms-${key}`}
               value={algorithms[key]}
            >
               {algorithms[key]}
            </MenuItem>,
         );
      });
      return options;
   };

   const getBlockSizeOptions = () => {
      const options = [];
      for (let i = 5; i <= 50; i++) {
         options.push(
            <MenuItem
               key={`blockSize-${i}`}
               value={i}
            >
               {i}
            </MenuItem>,
         );
      }
      return options;
   };

   const getMaximumColorsOptions = () => {
      const options = [];
      options.push(
         <MenuItem
            key={'maximumColors-0'}
            value={0}
         >
            Unlimited
         </MenuItem>,
      );
      for (let i = 250; i >= 20; i--) {
         options.push(
            <MenuItem
               key={`maximumColors-${i}`}
               value={i}
            >
               {i}
            </MenuItem>,
         );
      }
      return options;
   };

   const getMinimumThresholdOptions = () => {
      const options = [];
      for (let i = 1; i <= 20; i++) {
         options.push(
            <MenuItem
               key={`minimumThreshold-${i}`}
               value={i}
            >
               {i}
            </MenuItem>,
         );
      }
      return options;
   };

   const getPaletteList = () => imageForm.paletteList;

   const handleBasePaintsMenuCheckbox = () => imageForm.handlePalettes('basePaints', !imageForm.palettes.basePaints);

   const handleHalfWhitesMenuCheckbox = () => imageForm.handlePalettes('halfWhites', !imageForm.palettes.halfWhites);

   const handleQuarterWhitesMenuCheckbox = () => imageForm.handlePalettes('quarterWhites', !imageForm.palettes.quarterWhites);

   const handleThirdWhitesMenuCheckbox = () => imageForm.handlePalettes('thirdWhites', !imageForm.palettes.thirdWhites);

   const handleImageButton = () => selectImageInputRef.current && selectImageInputRef.current.click();

   return <>
      <Row>
         <Column>
            <Row className={'marginBottom_8'}>
               <Column className={'imageColumn'}>
                  <input
                     accept={'image/*'}
                     className={'displayNone'}
                     onChange={imageForm.handleFile}
                     ref={selectImageInputRef}
                     type={inputType.file}
                  />
                  <Button
                     onClick={handleImageButton}
                     size={'small'}
                     variant={'contained'}
                  >
                     Select Image
                  </Button>
               </Column>
            </Row>
            <Row>
               <Column>
                  <FormControl sx={{m: 1, width: 300}}>
                     <InputLabel
                        id={'block-size-label'}
                        size={'small'}
                     >
                        Block Size
                     </InputLabel>
                     <Select
                        input={
                           <OutlinedInput label={'Block Size'}/>}
                        labelId={'block-size-label'}
                        onChange={imageForm.handleBlockSize}
                        size={'small'}
                        value={imageForm.blockSize}
                     >
                        {getBlockSizeOptions()}
                     </Select>
                  </FormControl>
               </Column>
            </Row>
            <Row className={'marginBottom_8'}>
               <Column>
                  <FormGroup sx={{marginLeft: 1}}>
                     <FormControlLabel
                        control={<Checkbox checked={imageForm.matchToPalette} onChange={imageForm.handleMatchToPalette}/>}
                        label={'Match to Palette'}
                     />
                  </FormGroup>
               </Column>
            </Row>
         </Column>
         <Column>
            <Row
               className={'marginBottom_8'}
               style={{visibility: imageForm.matchToPalette ? css3.visibility.visible : css3.visibility.hidden}}
            >
               <Column>
                  <FormControl sx={{m: 1, width: 300}}>
                     <InputLabel
                        id={'color-depth-label'}
                        size={'small'}
                     >
                        Color Depth
                     </InputLabel>
                     <Select
                        input={
                           <OutlinedInput label={'Color Depth'}/>}
                        labelId={'color-depth-label'}
                        onChange={imageForm.handleMaximumColors}
                        size={'small'}
                        value={imageForm.maximumColors}
                     >
                        {getMaximumColorsOptions()}
                     </Select>
                  </FormControl>
               </Column>
            </Row>
            <Row
               className={'marginBottom_8'}
               style={{visibility: imageForm.matchToPalette ? css3.visibility.visible : css3.visibility.hidden}}
            >
               <Column>
                  <FormControl sx={{m: 1, width: 300}}>
                     <InputLabel
                        id={'minimum-threshold-label'}
                        size={'small'}
                     >
                        Minimum Threshold
                     </InputLabel>
                     <Select
                        input={
                           <OutlinedInput label={'Minimum Threshold'}/>}
                        labelId={'minimum-threshold-label'}
                        onChange={imageForm.handleMinimumThreshold}
                        size={'small'}
                        value={imageForm.minimumThreshold}
                     >
                        {getMinimumThresholdOptions()}
                     </Select>
                  </FormControl>
               </Column>
            </Row>
            <Row
               className={'marginBottom_8'}
               style={{visibility: imageForm.matchToPalette ? css3.visibility.visible : css3.visibility.hidden}}
            >
               <Column>
                  <FormControl sx={{m: 1, width: 300}}>
                     <InputLabel
                        id={'algorithm-label'}
                        size={'small'}
                     >
                        Algorithm
                     </InputLabel>
                     <Select
                        input={
                           <OutlinedInput label={'Algorithm'}/>}
                        labelId={'algorithm-label'}
                        onChange={imageForm.handleAlgorithm}
                        size={'small'}
                        value={imageForm.algorithm}
                     >
                        {getAlgorithmOptions()}
                     </Select>
                  </FormControl>
               </Column>
            </Row>
            <Row
               className={'marginBottom_8'}
               style={{visibility: imageForm.matchToPalette ? css3.visibility.visible : css3.visibility.hidden}}
            >
               <Column>
                  <FormControl sx={{m: 1, width: 300}}>
                     <InputLabel
                        id={'color/greyscale-label'}
                        size={'small'}
                     >
                        Color/Greyscale
                     </InputLabel>
                     <Select
                        input={
                           <OutlinedInput label={'Color/Greyscale'}/>}
                        labelId={'color/greyscale-label'}
                        onChange={imageForm.handleColorOrGreyscale}
                        size={'small'}
                        value={imageForm.colorOrGreyscale}
                     >
                        <MenuItem value={'color'}>Color</MenuItem>
                        <MenuItem value={'greyscale'}>Greyscale</MenuItem>
                     </Select>
                  </FormControl>
               </Column>
            </Row>
            <Row style={{visibility: imageForm.matchToPalette ? css3.visibility.visible : css3.visibility.hidden}}>
               <Column>
                  <FormControl sx={{m: 1, width: 300}}>
                     <InputLabel
                        id={'palettes-label'}
                        size={'small'}
                     >
                        Palettes
                     </InputLabel>
                     <Select
                        input={
                           <OutlinedInput label={'Palettes'}/>}
                        labelId={'palettes-label'}
                        multiple={true}
                        renderValue={getPaletteList}
                        size={'small'}
                        value={imageForm.paletteArray}
                     >
                        <MenuItem onClick={handleBasePaintsMenuCheckbox}>
                           <Checkbox checked={imageForm.palettes.basePaints}/>
                           <ListItemText primary={'Heavy Body Acrylics'}/>
                        </MenuItem>
                        <MenuItem onClick={handleHalfWhitesMenuCheckbox}>
                           <Checkbox checked={imageForm.palettes.halfWhites}/>
                           <ListItemText primary={'Half-Whites'}/>
                        </MenuItem>
                        <MenuItem onClick={handleThirdWhitesMenuCheckbox}>
                           <Checkbox checked={imageForm.palettes.thirdWhites}/>
                           <ListItemText primary={'Third-Whites'}/>
                        </MenuItem>
                        <MenuItem onClick={handleQuarterWhitesMenuCheckbox}>
                           <Checkbox checked={imageForm.palettes.quarterWhites}/>
                           <ListItemText primary={'Quarter-Whites'}/>
                        </MenuItem>
                     </Select>
                  </FormControl>
               </Column>
            </Row>
         </Column>
      </Row>
   </>;
};
