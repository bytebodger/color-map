import { useContext, useEffect } from 'react';
import { UIState } from '../../UI';
import { allow } from '@toolz/allow-react';
import { is } from '../../common/objects/is';
import { useNavigate } from 'react-router-dom';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { css3 } from '@toolz/css3/src/css3';

export const Stats = () => {
   const uiState = useContext(UIState);
   const navigateTo = useNavigate();

   useEffect(() => {
      if (Object.keys(uiState.stats).length === 0) {
         navigateTo('/');
         return;
      }
      if (!uiState.showCanvas)
         uiState.setShowCanvas(true);
   });

   const getColorCell = (paintName = '') => {
      allow.aString(paintName, is.not.empty);
      const color = uiState.stats.colors.find(color => color.name === paintName);
      return <TableCell style={{backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`}}/>;
   }

   const getTableRows = () => {
      const colorCounts = sortColorCounts(uiState.stats);
      const rows = [];
      colorCounts.forEach((colorCount, index) => {
         const [paintName, count] = colorCount;
         rows.push(
            <TableRow
               key={paintName}
               sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
               <TableCell style={{textAlign: css3.textAlign.center}}>{index + 1}</TableCell>
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

   if (Object.keys(uiState.stats).length === 0)
      return null;

   return <>
      <TableContainer component={Paper}>
         <Table
            aria-label={'used paints table'}
            size={'small'}
         >
            <TableHead>
               <TableRow>
                  <TableCell style={{
                     textAlign: css3.textAlign.center,
                     width: 75,
                  }}>
                     <b>Index</b>
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
   </>
}