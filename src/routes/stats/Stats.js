import { useContext, useEffect } from 'react';
import { UIState } from '../../UI';
import { allow } from '@toolz/allow-react';
import { is } from '../../common/objects/is';
import { useNavigate } from 'react-router-dom';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { css3 } from '@toolz/css3/src/css3';
import { useAllColors } from '../../common/hooks/useAllColors';
import '../../common/css/baseProperties.css';
import Typography from '@mui/material/Typography';
import { local } from '@toolz/local-storage';
import { logGooglePageHit } from '../../common/functions/logGooglePageHit';

export const Stats = () => {
   const uiState = useContext(UIState);
   const navigateTo = useNavigate();
   const allColors = useAllColors();
   let colors = [];

   useEffect(() => {
      if (Object.keys(uiState.stats).length === 0) {
         navigateTo('/');
         return;
      }
      if (uiState.showCanvas)
         uiState.setShowCanvas(false);
      local.setItem('hasViewedMapOrStats', true);
   });

   useEffect(() => logGooglePageHit('stats'), []);

   const getColorCell = (paintName = '') => {
      allow.aString(paintName, is.not.empty);
      const color = uiState.stats.colors.find(color => color.name === paintName);
      return <TableCell style={{backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`}}/>;
   }

   const getTableRows = () => {
      colors = allColors.get();
      const colorCounts = sortColorCounts(uiState.stats);
      const rows = [];
      colorCounts.forEach((colorCount, index) => {
         const [paintName, count] = colorCount;
         const paintIndex = colors.findIndex(color => color.name === paintName);
         rows.push(
            <TableRow
               key={paintName}
               sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
               <TableCell style={{textAlign: css3.textAlign.center}}><b>{index + 1}.</b></TableCell>
               <TableCell style={{textAlign: css3.textAlign.center}}>{paintIndex}</TableCell>
               <TableCell style={{textAlign: css3.textAlign.center}}>{count}</TableCell>
               {getColorCell(paintName)}
               <TableCell>{paintName}</TableCell>
            </TableRow>
         );
      })
      return rows;
   }

   const sortColorCounts = (stats = {}) => {
      allow.anObject(stats, is.not.empty);

      const sort = (a, b) => {
         const [, aCount] = a;
         const [, bCount] = b;
         if (aCount > bCount)
            return -1;
         else if (aCount < bCount)
            return 1;
         else
            return 0;
      };

      const colorCounts = [];
      Object.entries(stats.colorCounts).forEach(colorCount => colorCounts.push(colorCount));
      return colorCounts.sort(sort);
   };

   const navigateToMap = () => navigateTo('/map');

   if (Object.keys(uiState.stats).length === 0)
      return null;

   return <>
      <h4 className={'marginBottom_8'}>Color Stats</h4>
      <div className={'marginBottom_48'}>
         <Typography>
            These are all the colors represented in your generated image.  To see where these colors exist in the image,
            click on the{` `}
            <span
               className={'spanLink'}
               onClick={navigateToMap}
            >
               MAP
            </span>{` `}
            link in the top nav bar.
         </Typography>
      </div>
      <TableContainer component={Paper}>
         <Table
            aria-label={'used paints table'}
            size={'small'}
         >
            <TableHead>
               <TableRow>
                  <TableCell style={{width: 75}}/>
                  <TableCell style={{
                     textAlign: css3.textAlign.center,
                     width: 75,
                  }}>
                     <b>Ref</b>
                  </TableCell>
                  <TableCell style={{
                     textAlign: css3.textAlign.center,
                     width: 75,
                  }}>
                     <b>Blocks</b>
                  </TableCell>
                  <TableCell/>
                  <TableCell><b>Paint</b></TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {getTableRows()}
            </TableBody>
         </Table>
      </TableContainer>
      <div className={'minHeight_500'}></div>
   </>
}