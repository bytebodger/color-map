import { use } from '../objects/use';
import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import { css3 } from '@toolz/css3/src/css3';
import './css/home.css';
import '../css/baseProperties.css';
import { inputType } from '../objects/inputType';
import { algorithm as algorithms } from '../objects/algorithm';
import { Button, Select, MenuItem, Checkbox, OutlinedInput, ListItemText, InputLabel, FormControl, FormGroup, FormControlLabel, Modal } from '@mui/material';
import { useRef, useState } from 'react';
import { HelpTwoTone } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const style = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: '50%',
   bgcolor: 'background.paper',
   border: '2px solid #000',
   boxShadow: 24,
   p: 4,
};

export const Home = () => {
   const imageForm = use.imageForm;
   const selectImageInputRef = useRef(null);
   const [algorithmModalOpen, setAlgorithmModalOpen] = useState(false);
   const [blockSizeModalOpen, setBlockSizeModalOpen] = useState(false);
   const [colorDepthModalOpen, setColorDepthModalOpen] = useState(false);
   const [colorOrGreyscaleModalOpen, setColorOrGreyscaleModalOpen] = useState(false);
   const [matchToPaletteModalOpen, setMatchToPaletteModalOpen] = useState(false);
   const [minimumTresholdModalOpen, setMinimumThresholdModalOpen] = useState(false);
   const [palettesModalOpen, setPalettesModalOpen] = useState(false);
   const [selectImageModalOpen, setSelectImageModalOpen] = useState(false);

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

   const handleAlgorithmModalClosed = () => setAlgorithmModalOpen(false);

   const handleAlgorithmModalOpen = () => setAlgorithmModalOpen(true);

   const handleBasePaintsMenuCheckbox = () => imageForm.handlePalettes('basePaints', !imageForm.palettes.basePaints);

   const handleBlockSizeModalClosed = () => setBlockSizeModalOpen(false);

   const handleBlockSizeModalOpen = () => setBlockSizeModalOpen(true);

   const handleColorDepthModalClosed = () => setColorDepthModalOpen(false);

   const handleColorDepthModalOpen = () => setColorDepthModalOpen(true);

   const handleColorOrGreyscaleModalClosed = () => setColorOrGreyscaleModalOpen(false);

   const handleColorOrGreyscaleModalOpen = () => setColorOrGreyscaleModalOpen(true);

   const handleHalfWhitesMenuCheckbox = () => imageForm.handlePalettes('halfWhites', !imageForm.palettes.halfWhites);

   const handleMatchToPaletteModalClosed = () => setMatchToPaletteModalOpen(false);

   const handleMatchToPaletteModalOpen = () => setMatchToPaletteModalOpen(true);

   const handleMinimumThresholdModalClosed = () => setMinimumThresholdModalOpen(false);

   const handleMinimumThresholdModalOpen = () => setMinimumThresholdModalOpen(true);

   const handlePalettesModalClosed = () => setPalettesModalOpen(false);

   const handlePalettesModalOpen = () => setPalettesModalOpen(true);

   const handleQuarterWhitesMenuCheckbox = () => imageForm.handlePalettes('quarterWhites', !imageForm.palettes.quarterWhites);

   const handleSelectImageModalClosed = () => setSelectImageModalOpen(false);

   const handleSelectImageModalOpen = () => setSelectImageModalOpen(true);

   const handleThirdWhitesMenuCheckbox = () => imageForm.handlePalettes('thirdWhites', !imageForm.palettes.thirdWhites);

   const handleImageButton = () => selectImageInputRef.current && selectImageInputRef.current.click();

   return <>
      <Modal
         aria-describedby={'selectImageModalDescription'}
         aria-labelledby={'selectImageModalTitle'}
         onClose={handleSelectImageModalClosed}
         open={selectImageModalOpen}
      >
         <Box sx={style}>
            <Typography
               component={'h2'}
               id={'selectImageModalTitle'}
               variant={'h6'}
            >
               Select Image
            </Typography>
            <Typography
               id={'selectImageModalDescription'}
               sx={{ mt: 2, textAlign: 'justify' }}
            >
               You must select a valid image file from your local system.  Once a valid image has been loaded, you will see it displayed below this form.
               Thereafter, every time you change one of the settings, the image will be automatically reloaded with those settings applied.
            </Typography>
         </Box>
      </Modal>
      <Modal
         aria-describedby={'blockSizeModalDescription'}
         aria-labelledby={'blockSizeModalTitle'}
         onClose={handleBlockSizeModalClosed}
         open={blockSizeModalOpen}
      >
         <Box sx={style}>
            <Typography
               component={'h2'}
               id={'blockSizeModalTitle'}
               variant={'h6'}
            >
               Block Size
            </Typography>
            <Typography
               id={'blockSizeModalDescription'}
               sx={{ mt: 2, textAlign: 'justify' }}
            >
               The image you select will "pixelated".  The size of each pixel is determined by the value in Block Size.  If you don't want the image to be
               pixelated at all, you can select a Block Size of "1".  But be warned that this will slow down the image processing significantly.
            </Typography>
         </Box>
      </Modal>
      <Modal
         aria-describedby={'matchToPaletteModalDescription'}
         aria-labelledby={'matchToPaletteModalTitle'}
         onClose={handleMatchToPaletteModalClosed}
         open={matchToPaletteModalOpen}
      >
         <Box sx={style}>
            <Typography
               component={'h2'}
               id={'matchToPaletteModalTitle'}
               variant={'h6'}
            >
               Match to Palette
            </Typography>
            <Typography
               id={'matchToPaletteModalDescription'}
               sx={{ mt: 2, textAlign: 'justify' }}
            >
               If this box is unchecked, an image can be loaded and it will be displayed in a pixelated manner (with each "pixel" being the size
               set with Block Size), but the image's colors will not be swapped out against any reference set of colors.
               <br/><br/>
               When the box is checked, the loaded image will be scanned and its colors will be replaced with the closest colors that can be found
               in the chosen palette(s).
            </Typography>
         </Box>
      </Modal>
      <Modal
         aria-describedby={'colorDepthModalDescription'}
         aria-labelledby={'colorDepthModalTitle'}
         onClose={handleColorDepthModalClosed}
         open={colorDepthModalOpen}
      >
         <Box sx={style}>
            <Typography
               component={'h2'}
               id={'colorDepthModalTitle'}
               variant={'h6'}
            >
               Color Depth
            </Typography>
            <Typography
               id={'colorDepthModalDescription'}
               sx={{ mt: 2, textAlign: 'justify' }}
            >
               This controls the maximum number of colors that can exist in the processed image.  For example, if the Color Depth is set to "200" and
               the processed image contains 219 unique colors, its colors will be sorted by frequency and the bottom 19 will be replaced with
               their closest match in the top list of 200 colors.
            </Typography>
         </Box>
      </Modal>
      <Modal
         aria-describedby={'minimumThresholdModalDescription'}
         aria-labelledby={'minimumThresholdModalTitle'}
         onClose={handleMinimumThresholdModalClosed}
         open={minimumTresholdModalOpen}
      >
         <Box sx={style}>
            <Typography
               component={'h2'}
               id={'minimumThresholdModalTitle'}
               variant={'h6'}
            >
               Minimum Threshold
            </Typography>
            <Typography
               id={'minimumThresholdModalDescription'}
               sx={{ mt: 2, textAlign: 'justify' }}
            >
               Minimum Threshold is another way to limit the number of colors that exist in the processed image.  Once the image is processed, its colors
               will be sorted by frequency and color that occurs fewer times than the Minimum Threshold will be replaced with its closest match from the
               rest of the colors.
            </Typography>
         </Box>
      </Modal>
      <Modal
         aria-describedby={'algorithmModalDescription'}
         aria-labelledby={'algorithmModalTitle'}
         onClose={handleAlgorithmModalClosed}
         open={algorithmModalOpen}
      >
         <Box sx={style}>
            <Typography
               component={'h2'}
               id={'algorithmModalTitle'}
               variant={'h6'}
            >
               Algorithm
            </Typography>
            <Typography
               id={'algorithmModalDescription'}
               sx={{ mt: 2, textAlign: 'justify' }}
            >
               There are numerous ways to try to measure how close two different colors are to each other.  The options given here are as follows:
               <br/><br/>
               <b>RGB:</b> For any two colors, the difference between Red 1 and Red 2 is added to the difference between Green 1 and Green 2, which is
               then added to the difference between Blue 1 and Blue 2.
               <br/><br/>
               <b>XYZ:</b> For any two colors, they are plotted on a three-dimensional color matrix.  Then the difference between X 1 and X 2 is
               added to the difference between Y 1 and Y 2, which is then added to the difference between Z 1 and Z 2.
               <br/><br/>
               <b>CMYK:</b> For any two colors, they are converted to CMYK values.  (CMYK is the color coding scheme used in printed media.)  Then
               the difference between Cyan 1 and Cyan 2 is added to the difference between Magenta 1 and Magenta 2, which is then added to the
               difference between Yellow 1 and Yellow 2, which is then added to the difference between Key 1 and Key 2.
               <br/><br/>
               <b>Delta-E 2000:</b> This is a formula, first developed in the 1970s, based on the L*a*b* colorspace.  Like the approaches detailed
               above, it's designed to represent the "difference" between two colors with a single numeric value.  However, this formula is
               considered to be more accurate and fewer oddities where two "close" colors look very different to the human eye.
            </Typography>
         </Box>
      </Modal>
      <Modal
         aria-describedby={'colorOrGreyscaleModalDescription'}
         aria-labelledby={'colorOrGreyscaleModalTitle'}
         onClose={handleColorOrGreyscaleModalClosed}
         open={colorOrGreyscaleModalOpen}
      >
         <Box sx={style}>
            <Typography
               component={'h2'}
               id={'colorOrGreyscaleModalTitle'}
               variant={'h6'}
            >
               Color/Greyscale
            </Typography>
            <Typography
               id={'colorOrGreyscaleModalDescription'}
               sx={{ mt: 2, textAlign: 'justify' }}
            >
               When Greyscale is chosen, the source file will be "flattened" into shades of grey before color matching is performed.
               <br/><br/>
               <b>NOTE:</b> This does not mean that the resulting image will consist of nothing but perfect shades of black/white/grey.
               There will still be times when an existing paint <i>color</i> is closer to the given shade than any of the other paints
               that are pure shades of grey.
            </Typography>
         </Box>
      </Modal>
      <Modal
         aria-describedby={'palettesModalDescription'}
         aria-labelledby={'palettesModalTitle'}
         onClose={handlePalettesModalClosed}
         open={palettesModalOpen}
      >
         <Box sx={style}>
            <Typography
               component={'h2'}
               id={'palettesModalTitle'}
               variant={'h6'}
            >
               Palettes
            </Typography>
            <Typography
               id={'palettesModalDescription'}
               sx={{ mt: 2, textAlign: 'justify' }}
            >
               Palettes determines the array of potential paint colors that can be used to match against the colors in the original image.
               The more palettes you've chosen, the more potential colors that can be matched to the original, which means that the
               processed image will be closer to the original file.
               <br/><br/>
               The "original" palette - Heavy Body Acrylics - was generated by scanning the colors created by each of Golden's and Liquitex's
               inventory of heavy body acrylic paints.  There are more than 200 of these paint colors in the Heavy Body Acrylics palette.
               <br/><br/>
               However, the "base" heavy body acrylic paints are quite dark.  And if you <i>only</i> select the Heavy Body Acrylics palette,
               you may find that the algorithm has a hard time finding a suitable match for the lighter colors in your source image.  For this
               reason, you also have the option to select Half-White, Third-White, and Quarter-White palettes.
               <br/><br/>
               The Half-White palette consists of all the original colors in Heavy Body Acrylics mixed half-and-half with white.  Third-White
               represents two parts of each original Heavy Body Acrylics color mixed with one part of white.  And finally, Quarter-White represents
               three parts of each original Heavy Body Acrylics color mixed with one part of white.
               <br/><br/>
               Expanding the number of available palettes will make the resuling image more closely resemble the source file - but it will
               also mean that you need to mix more paints to bring that image to a canvas.  However, this problem can me mitigated by using the
               Color Depth and Minimum Threshold features.
            </Typography>
         </Box>
      </Modal>
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
                  <HelpTwoTone
                     className={'questionMarkIcon'}
                     onClick={handleSelectImageModalOpen}
                  />
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
                  <HelpTwoTone
                     className={'questionMarkIcon2'}
                     onClick={handleBlockSizeModalOpen}
                  />
               </Column>
            </Row>
            <Row className={'marginBottom_8'}>
               <Column>
                  <FormGroup sx={{float: 'left', marginLeft: 1}}>
                     <FormControlLabel
                        control={<Checkbox checked={imageForm.matchToPalette} onChange={imageForm.handleMatchToPalette}/>}
                        label={'Match to Palette'}
                     />
                  </FormGroup>
                  <HelpTwoTone
                     className={'questionMarkIcon'}
                     onClick={handleMatchToPaletteModalOpen}
                  />
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
                  <HelpTwoTone
                     className={'questionMarkIcon2'}
                     onClick={handleColorDepthModalOpen}
                  />
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
                  <HelpTwoTone
                     className={'questionMarkIcon2'}
                     onClick={handleMinimumThresholdModalOpen}
                  />
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
                  <HelpTwoTone
                     className={'questionMarkIcon2'}
                     onClick={handleAlgorithmModalOpen}
                  />
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
                  <HelpTwoTone
                     className={'questionMarkIcon2'}
                     onClick={handleColorOrGreyscaleModalOpen}
                  />
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
                  <HelpTwoTone
                     className={'questionMarkIcon2'}
                     onClick={handlePalettesModalOpen}
                  />
               </Column>
            </Row>
         </Column>
      </Row>
   </>;
};
