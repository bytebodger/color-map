import Typography from '@mui/material/Typography';
import '../../common/css/baseProperties.css';
import { palettes } from '../../common/arrays/palettes';
import { allow } from '@toolz/allow-react';
import { is } from '../../common/objects/is';
import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { rgbModel } from '../../common/objects/models/rgbModel';
import { useImage } from '../../common/hooks/useImage';
import { useContext, useEffect } from 'react';
import { UIState } from '../../UI';
import { logGooglePageHit } from '../../common/functions/logGooglePageHit';

export const Palettes = () => {
   const uiState = useContext(UIState);
   const image = useImage();

   useEffect(() => {
      if (uiState.showCanvas)
         uiState.setShowCanvas(false);
   });

   useEffect(() => logGooglePageHit('palettes'), []);

   const paletteNames = [
      '',
      '1/4 white',
      '1/3 white',
      '1/2 white',
      '2/3 white',
      '3/4 white',
   ]

   const getColor = (color = rgbModel, paletteName = '') => {
      allow.anInstanceOf(color, rgbModel).oneOf(paletteName, paletteNames);
      const white = {
         red: 255,
         green: 255,
         blue: 255,
         name: '',
      }
      let mixedColor;
      switch (paletteName) {
         case '1/4 white':
            mixedColor = image.mixRgbColorsSubtractively([color, color, color, white]);
            break;
         case '1/3 white':
            mixedColor = image.mixRgbColorsSubtractively([color, color, white]);
            break;
         case '1/2 white':
            mixedColor = image.mixRgbColorsSubtractively([color, white]);
            break;
         case '2/3 white':
            mixedColor = image.mixRgbColorsSubtractively([color, white, white]);
            break;
         case '3/4 white':
            mixedColor = image.mixRgbColorsSubtractively([color, white, white, white]);
            break;
         default:
            mixedColor = color;
      }
      return `rgb(${mixedColor.red}, ${mixedColor.green}, ${mixedColor.blue})`;
   }

   const getTableCells = (startingIndex = -1, paletteName = '') => {
      allow.anInteger(startingIndex, is.not.negative).aString(paletteName);
      const cells = [];
      for (let i = 0; i < 3; i++) {
         const color = palettes.basePaints[i + startingIndex];
         if (!color)
            return;
         cells.push(
            <TableCell
               key={`colorDisplay-${color.name}`}
               style={{backgroundColor: getColor(color, paletteName)}}
            />
         );
         cells.push(
            <TableCell key={`colorName-${color.name}`}>
               {color.name}
            </TableCell>
         );
      }
      return cells;
   }

   const getTableRows = (paletteName = '') => {
      allow.aString(paletteName);
      const rows = [];
      palettes.basePaints.forEach((palette, index) => {
         if (index % 6 === 0) {
            rows.push(
               <TableRow
                  key={`basePaintRows-${index}`}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
               >
                  {getTableCells(index, paletteName)}
               </TableRow>
            );
         }
      });
      return rows;
   }

   return <>
      <h4 className={'marginBottom_8'}>Heavy Body Acrylic Paints</h4>
      <div className={'marginBottom_16'}>
         <Typography>
            The palettes are matched, as closely as possible, to the colors available from the heavy body acrylic paints offered by Golden and Liquitex.
         </Typography>
      </div>
      <TableContainer component={Paper}>
         <Table
            aria-label={'color palette table'}
            size={'small'}
         >
            <TableBody>
               {getTableRows('')}
            </TableBody>
         </Table>
      </TableContainer>
      <h4 className={'marginBottom_8'}>1/4 Whites</h4>
      <div className={'marginBottom_16'}>
         <Typography>
            These are the colors you get when you mix each of the heavy body acrylic paints with three parts of the original color and one part of pure white.
         </Typography>
      </div>
      <TableContainer component={Paper}>
         <Table
            aria-label={'color palette table'}
            size={'small'}
         >
            <TableBody>
               {getTableRows('1/4 white')}
            </TableBody>
         </Table>
      </TableContainer>
      <h4 className={'marginBottom_8'}>1/3 Whites</h4>
      <div className={'marginBottom_16'}>
         <Typography>
            These are the colors you get when you mix each of the heavy body acrylic paints with two parts of the original color and one part of pure white.
         </Typography>
      </div>
      <TableContainer component={Paper}>
         <Table
            aria-label={'color palette table'}
            size={'small'}
         >
            <TableBody>
               {getTableRows('1/3 white')}
            </TableBody>
         </Table>
      </TableContainer>
      <h4 className={'marginBottom_8'}>1/2 Whites</h4>
      <div className={'marginBottom_16'}>
         <Typography>
            These are the colors you get when you mix each of the heavy body acrylic paints with one part of the original color and one part of pure white.
         </Typography>
      </div>
      <TableContainer component={Paper}>
         <Table
            aria-label={'color palette table'}
            size={'small'}
         >
            <TableBody>
               {getTableRows('1/2 white')}
            </TableBody>
         </Table>
      </TableContainer>
      <h4 className={'marginBottom_8'}>2/3 Whites</h4>
      <div className={'marginBottom_16'}>
         <Typography>
            These are the colors you get when you mix each of the heavy body acrylic paints with one part of the original color and two parts of pure white.
         </Typography>
      </div>
      <TableContainer component={Paper}>
         <Table
            aria-label={'color palette table'}
            size={'small'}
         >
            <TableBody>
               {getTableRows('2/3 white')}
            </TableBody>
         </Table>
      </TableContainer>
      <h4 className={'marginBottom_8'}>3/4 Whites</h4>
      <div className={'marginBottom_16'}>
         <Typography>
            These are the colors you get when you mix each of the heavy body acrylic paints with one part of the original color and three parts of pure white.
         </Typography>
      </div>
      <TableContainer component={Paper}>
         <Table
            aria-label={'color palette table'}
            size={'small'}
         >
            <TableBody>
               {getTableRows('3/4 white')}
            </TableBody>
         </Table>
      </TableContainer>
      <div className={'minHeight_500'}></div>
   </>
}