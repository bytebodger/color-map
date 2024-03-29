import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import { css3 } from '@toolz/css3/src/css3';
import './css/home.css';
import '../../common/css/baseProperties.css';
import { inputType } from '../../common/objects/inputType';
import { Button, Select, MenuItem, Checkbox, OutlinedInput, ListItemText, InputLabel, FormControl, FormGroup, FormControlLabel, Modal, CircularProgress, Backdrop } from '@mui/material';
import { useRef, useState, useContext, useEffect } from 'react';
import { HelpTwoTone } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IndexState, getPaletteArray } from './components/IndexContainer';
import { allow } from '@toolz/allow-react';
import { is } from '../../common/objects/is';
import { local } from '@toolz/local-storage';
import { useFile } from '../../common/hooks/useFile';
import { algorithm as algorithms } from '../../common/objects/algorithm';
import { getPaletteList } from './components/IndexContainer';
import { UIState } from '../../UI';
import { useNavigate } from 'react-router-dom';
import { logGooglePageHit } from '../../common/functions/logGooglePageHit';

const style = {
   bgcolor: 'background.paper',
   boxShadow: 24,
   left: '50%',
   p: 4,
   position: 'absolute',
   top: '50%',
   transform: 'translate(-50%, -50%)',
   width: '50%',
};

export const Index = () => {
   const selectImageInputRef = useRef(null);
   const [algorithmModalOpen, setAlgorithmModalOpen] = useState(false);
   const [blockSizeModalOpen, setBlockSizeModalOpen] = useState(false);
   const [colorDepthModalOpen, setColorDepthModalOpen] = useState(false);
   const [colorOrGreyscaleModalOpen, setColorOrGreyscaleModalOpen] = useState(false);
   const [ditherModalOpen, setDitherModalOpen] = useState(false);
   const [introModalOpen, setIntroModalOpen] = useState(!local.getItem('hasSeenIntroModal', false));
   const [matchToPaletteModalOpen, setMatchToPaletteModalOpen] = useState(false);
   const [minimumTresholdModalOpen, setMinimumThresholdModalOpen] = useState(false);
   const [palettesModalOpen, setPalettesModalOpen] = useState(false);
   const [selectImageModalOpen, setSelectImageModalOpen] = useState(false);
   const indexState = useContext(IndexState);
   const uiState = useContext(UIState);
   const file = useFile();
   const navigateTo = useNavigate();
   const hasViewedMapOrStats = local.getItem('hasViewedMapOrStats', false);
   const { algorithm, blockSize, colorOrGreyscale, dither, matchToPalette, maximumColors, minimumThreshold, palettes, progress } = indexState;

   useEffect(() => {
      if (!uiState.showCanvas)
         uiState.setShowCanvas(true);
   });

   useEffect(() => logGooglePageHit('index'), []);

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
      for (let i = 2; i <= 50; i++) {
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
      for (let i = 250; i >= 20; i -= 5) {
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
      for (let i = 1; i <= 10; i++) {
         options.push(
            <MenuItem
               key={`minimumThreshold-${i}`}
               value={i}
            >
               {i}
            </MenuItem>,
         );
      }
      for (let i = 15; i <= 200; i += 5) {
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

   const handleAlgorithm = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      local.setItem('algorithm', value);
      indexState.setAlgorithm(value);
      file.reload();
   };

   const handleAlgorithmModalClosed = () => setAlgorithmModalOpen(false);

   const handleAlgorithmModalOpen = () => setAlgorithmModalOpen(true);

   const handleBasePaintsMenuCheckbox = () => handlePalettes('basePaints', !palettes().basePaints);

   const handleBlockSize = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      const size = parseInt(value, 10);
      local.setItem('blockSize', size);
      indexState.setBlockSize(size);
      file.reload();
   };

   const handleBlockSizeModalClosed = () => setBlockSizeModalOpen(false);

   const handleBlockSizeModalOpen = () => setBlockSizeModalOpen(true);

   const handleColorDepthModalClosed = () => setColorDepthModalOpen(false);

   const handleColorDepthModalOpen = () => setColorDepthModalOpen(true);

   const handleColorOrGreyscale = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      local.setItem('colorOrGreyscale', value);
      indexState.setColorOrGreyscale(value);
      file.reload();
   };

   const handleColorOrGreyscaleModalClosed = () => setColorOrGreyscaleModalOpen(false);

   const handleColorOrGreyscaleModalOpen = () => setColorOrGreyscaleModalOpen(true);

   const handleDither = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {checked} = event.target;
      local.setItem('dither', checked);
      indexState.setDither(checked);
      file.reload();
   };

   const handleDitherModalClosed = () => setDitherModalOpen(false);

   const handleDitherModalOpen = () => setDitherModalOpen(true);

   const handleFile = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const [source] = event.target.files;
      file.read(source);
   };

   const handleHalfWhitesMenuCheckbox = () => handlePalettes('halfWhites', !palettes().halfWhites);

   const handleIntroModalClosed = () => {
      local.setItem('hasSeenIntroModal', true);
      setIntroModalOpen(false);
   }

   const handleMatchToPalette = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {checked} = event.target;
      local.setItem('matchToPalette', checked);
      indexState.setMatchToPalette(checked);
      file.reload();
   };

   const handleMatchToPaletteModalClosed = () => setMatchToPaletteModalOpen(false);

   const handleMatchToPaletteModalOpen = () => setMatchToPaletteModalOpen(true);

   const handleMaximumColors = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      const maximum = parseInt(value, 10);
      local.setItem('maximumColors', maximum);
      indexState.setMaximumColors(maximum);
      file.reload();
   };

   const handleMinimumThreshold = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      const minimum = parseInt(value, 10);
      local.setItem('minimumThreshold', minimum);
      indexState.setMinimumThreshold(minimum);
      file.reload();
   }

   const handleMinimumThresholdModalClosed = () => setMinimumThresholdModalOpen(false);

   const handleMinimumThresholdModalOpen = () => setMinimumThresholdModalOpen(true);

   const handlePalettes = (key = '', value = false) => {
      allow.aString(key, is.not.empty).aBoolean(value);
      const newPalettes = {...palettes()};
      newPalettes[key] = value;
      local.setItem('palettes', newPalettes);
      indexState.setPaletteArray(getPaletteArray());
      indexState.setPaletteList(getPaletteList());
      indexState.setPalettes(newPalettes);
      file.reload();
   };

   const handlePalettesModalClosed = () => setPalettesModalOpen(false);

   const handlePalettesModalOpen = () => setPalettesModalOpen(true);

   const handleQuarterWhitesMenuCheckbox = () => handlePalettes('quarterWhites', !palettes().quarterWhites);

   const handleSelectImageModalClosed = () => setSelectImageModalOpen(false);

   const handleSelectImageModalOpen = () => setSelectImageModalOpen(true);

   const handleThirdWhitesMenuCheckbox = () => handlePalettes('thirdWhites', !palettes().thirdWhites);

   const handleThreeQuarterWhitesMenuCheckbox = () => handlePalettes('threeQuarterWhites', !palettes().threeQuarterWhites);

   const handleTwoThirdWhitesMenuCheckbox = () => handlePalettes('twoThirdWhites', !palettes().twoThirdWhites);

   const handleImageButton = () => selectImageInputRef.current && selectImageInputRef.current.click();

   const navigateToMap = () => navigateTo('/map');

   const navigateToStats = () => navigateTo('/stats');

   return <>
      <Backdrop
         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
         open={indexState.showProcessing}
      >
         <div className={'textAlignCenter'}>
            <Box sx={{
               display: 'inline-flex',
               position: 'relative',
            }}>
               <CircularProgress
                  color={'success'}
                  value={progress}
                  variant={'determinate'}
               />
               <Box sx={{
                  alignItems: 'center',
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  left: 0,
                  position: 'absolute',
                  right: 0,
                  top: 0,
               }}>
                  <Typography
                     color={'white'}
                     component={'div'}
                     variant={'caption'}
                  >
                     {`${progress}%`}
                  </Typography>
               </Box>
            </Box>
            <br/>
            Image Processing...
         </div>
      </Backdrop>
      <Modal
         aria-describedby={'introModalDescription'}
         aria-labelledby={'introModalTitle'}
         onClose={handleIntroModalClosed}
         open={introModalOpen}
      >
         <Box sx={style}>
            <Typography
               component={'h2'}
               id={'introModalTitle'}
               variant={'h6'}
            >
               Welcome to Paint Map Studio!
            </Typography>
            <Typography
               id={'introModalDescription'}
               sx={{ mt: 2, textAlign: 'justify' }}
            >
               This is a tool for translating colors from digital images into paints.  You can click around on the links in the
               nav bar, or update the values in the form, but you won't see anything updating onscreen until you select a valid
               image file from your system with the SELECT IMAGE button.
            </Typography>
         </Box>
      </Modal>
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
               Thereafter, every time you change one of the settings, the image will be automatically reloaded with the new settings applied.
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
               will be sorted by frequency and any color that occurs fewer times than the Minimum Threshold will be replaced with its closest match from the
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
               <b>RGB:</b> Calculates the Root-Mean-Square (RMS) between the {`{`}red, green, blue{`}`} values of the source color versus each color
               in the chosen palettes.
               <br/><br/>
               <b>HSL:</b> Calculates the RMS between the {`{`}hue, saturation, lightness{`}`} values of the source color versus each color
               in the chosen palettes.
               <br/><br/>
               <b>CMYK:</b> Calculates the RMS between the {`{`}cyan, magenta, yellow, key{`}`} values of the source color versus each color
               in the chosen palettes.
               <br/><br/>
               <b>XYZ:</b> Calculates the RMS between the {`{`}x, y, z{`}`} values of the source color versus each color
               in the chosen palettes (based on the CIE 1931 color space).
               <br/><br/>
               <b>Delta-E 2000:</b> This is a formula, first developed in the 1970s, based on the L*a*b* colorspace.  Like the approaches detailed
               above, it's designed to represent the "difference" between two colors with a single numeric value.  However, this formula is
               considered to be more accurate with fewer oddities where two "close" colors look very different to the human eye.
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
               reason, you also have the option to select 1/4 White, 1/3 White, 1/2 White, 2/3 White, and 3/4 White palettes.
               <br/><br/>
               The 1/4 White palette consists of 3 parts of the original color and 1 part of pure white.  1/3 White consists of 2 parts 
               of the original color and 1 part of pure white.  1/2 White consists of 1 part of the original color and 1 part of pure 
               white.  2/3 White consists of 1 part of the original color and 2 parts of pure white.  3/4 White consists of 1 part of 
               the original color and 3 parts of pure white.
               <br/><br/>
               Expanding the number of available palettes will make the resulting image more closely resemble the source file - but it will
               also mean that you need to mix more paints to bring that image to a canvas.  However, this problem can me mitigated by using the
               Color Depth and Minimum Threshold features.
            </Typography>
         </Box>
      </Modal>
      <Modal
         aria-describedby={'ditherModalDescription'}
         aria-labelledby={'ditherModalTitle'}
         onClose={handleDitherModalClosed}
         open={ditherModalOpen}
      >
         <Box sx={style}>
            <Typography
               component={'h2'}
               id={'ditherModalTitle'}
               variant={'h6'}
            >
               Dither
            </Typography>
            <Typography
               id={'ditherModalDescription'}
               sx={{ mt: 2, textAlign: 'justify' }}
            >
               Dithering will be applied to the processed image when this box is checked.  Dithering is a process of uniformly distributing
               "noise" in an image.  The purpose of this distribution is to keep blocks, or bands, of identical colors from forming.  At times,
               it can make the image look noisy.  But it can also make the image look more uniform.
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
                     onChange={handleFile}
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
               <Column className={'whiteSpaceNoWrap'}>
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
                        onChange={handleBlockSize}
                        size={'small'}
                        value={blockSize()}
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
               <Column className={'whiteSpaceNoWrap'}>
                  <FormGroup sx={{float: 'left', marginLeft: 1}}>
                     <FormControlLabel
                        control={<Checkbox checked={matchToPalette()} onChange={handleMatchToPalette}/>}
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
               style={{visibility: matchToPalette() ? css3.visibility.visible : css3.visibility.hidden}}
            >
               <Column className={'whiteSpaceNoWrap'}>
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
                        onChange={handleMaximumColors}
                        size={'small'}
                        value={maximumColors()}
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
               style={{visibility: matchToPalette() ? css3.visibility.visible : css3.visibility.hidden}}
            >
               <Column className={'whiteSpaceNoWrap'}>
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
                        onChange={handleMinimumThreshold}
                        size={'small'}
                        value={minimumThreshold()}
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
               style={{visibility: matchToPalette() ? css3.visibility.visible : css3.visibility.hidden}}
            >
               <Column className={'whiteSpaceNoWrap'}>
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
                        onChange={handleAlgorithm}
                        size={'small'}
                        value={algorithm()}
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
               style={{visibility: matchToPalette() ? css3.visibility.visible : css3.visibility.hidden}}
            >
               <Column className={'whiteSpaceNoWrap'}>
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
                        onChange={handleColorOrGreyscale}
                        size={'small'}
                        value={colorOrGreyscale()}
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
            <Row style={{visibility: matchToPalette() ? css3.visibility.visible : css3.visibility.hidden}}>
               <Column className={'whiteSpaceNoWrap'}>
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
                        value={indexState.paletteArray}
                     >
                        <MenuItem onClick={handleBasePaintsMenuCheckbox}>
                           <Checkbox checked={palettes().basePaints}/>
                           <ListItemText primary={'Heavy Body Acrylics'}/>
                        </MenuItem>
                        <MenuItem onClick={handleQuarterWhitesMenuCheckbox}>
                           <Checkbox checked={palettes().quarterWhites}/>
                           <ListItemText primary={'1/4 Whites'}/>
                        </MenuItem>
                        <MenuItem onClick={handleThirdWhitesMenuCheckbox}>
                           <Checkbox checked={palettes().thirdWhites}/>
                           <ListItemText primary={'1/3 Whites'}/>
                        </MenuItem>
                        <MenuItem onClick={handleHalfWhitesMenuCheckbox}>
                           <Checkbox checked={palettes().halfWhites}/>
                           <ListItemText primary={'1/2 Whites'}/>
                        </MenuItem>
                        <MenuItem onClick={handleTwoThirdWhitesMenuCheckbox}>
                           <Checkbox checked={palettes().twoThirdWhites}/>
                           <ListItemText primary={'2/3 Whites'}/>
                        </MenuItem>
                        <MenuItem onClick={handleThreeQuarterWhitesMenuCheckbox}>
                           <Checkbox checked={palettes().threeQuarterWhites}/>
                           <ListItemText primary={'3/4 Whites'}/>
                        </MenuItem>
                     </Select>
                  </FormControl>
                  <HelpTwoTone
                     className={'questionMarkIcon2'}
                     onClick={handlePalettesModalOpen}
                  />
               </Column>
            </Row>
            <Row>
               <Column className={'whiteSpaceNoWrap'} style={{visibility: matchToPalette() ? css3.visibility.visible : css3.visibility.hidden}}>
                  <FormGroup sx={{float: 'left', marginLeft: 1}}>
                     <FormControlLabel
                        control={<Checkbox checked={dither()} onChange={handleDither}/>}
                        label={'Dither'}
                     />
                  </FormGroup>
                  <HelpTwoTone
                     className={'questionMarkIcon'}
                     onClick={handleDitherModalOpen}
                  />
               </Column>
            </Row>
         </Column>
         <Column>
            <div
               className={'linkHelperPrompt'}
               style={{display: uiState.showPostImageLinks && !hasViewedMapOrStats ? css3.dislay.inherit : css3.dislay.none}}
            >
               Use the{' '}
               <span
                  className={'spanLink'}
                  onClick={navigateToMap}
               >
                  MAP
               </span>{` `}
               and{` `}
               <span
                  className={'spanLink'}
                  onClick={navigateToStats}
               >
                  STATS
               </span>{` `}
               links in the top nav to get more info about the generated image.
            </div>
         </Column>
      </Row>
   </>;
};
