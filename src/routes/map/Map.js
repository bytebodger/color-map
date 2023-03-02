import { useEffect, useContext } from 'react';
import { UIState } from '../../UI';
import { useNavigate } from 'react-router-dom';
import { rgbModel } from '../../common/objects/models/rgbModel';
import { allow } from '@toolz/allow-react';
import { is } from '../../common/objects/is';
import '../../common/css/baseProperties.css';
import './css/map.css';
import Typography from '@mui/material/Typography';
import { useAllColors } from '../../common/hooks/useAllColors';
import { local } from '@toolz/local-storage';
import { logGooglePageHit } from '../../common/functions/logGooglePageHit';

export const Map = () => {
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

   useEffect(() => logGooglePageHit('map'), []);

   const getTableCells = (cells = [rgbModel], rowIndex = -1) => {
      allow.anArrayOfInstances(cells, rgbModel).anInteger(rowIndex, is.not.negative);
      const { highlightedColor } = uiState;
      const tableCells = [];
      cells.forEach((cell, cellIndex) => {
         const paintIndex = colors.findIndex(color => color.name === cell.name);
         const darkness = (cell.red + cell.green + cell.blue) / 3;
         let color;
         let backgroundColor;
         if (highlightedColor === cell.name) {
            backgroundColor = '#39ff14';
            color = 'red';
         } else {
            backgroundColor = `rgb(${cell.red}, ${cell.green}, ${cell.blue})`;
            color = darkness < 128 ? 'white' : 'black';
         }
         tableCells.push(
            <td
               className={'cell'}
               id={cell.name}
               key={`cell-${rowIndex}-${cellIndex}`}
               onClick={handleCellClick}
               style={{
                  backgroundColor,
                  borderWidth: highlightedColor === cell.name ? 5 : 0,
                  color,
               }}
            >
               {paintIndex}
            </td>
         );
      })
      return tableCells;
   }

   const getTableRows = () => {
      const tableRows = [];
      colors = allColors.get();
      uiState.stats.map.forEach((row, rowIndex) => {
         tableRows.push(
            <tr key={`row-${rowIndex}`}>
               {getTableCells(row, rowIndex)}
            </tr>
         )
      })
      return tableRows;
   }

   const handleCellClick = (event = {}) => {
      allow.anObject(event, is.not.empty);
      uiState.toggleHighlightedColor(event.target.id);
   }

   const navigateToStats = () => navigateTo('/stats');

   if (Object.keys(uiState.stats).length === 0)
      return null;

   return <>
      <h4 className={'marginBottom_8'}>Color Map</h4>
      <div className={'marginBottom_48'}>
         <Typography>
            This is essentially a paint-by-numbers grid for the image that you generated.  You can copy all of the HTML from the
            grid below paste it into a spreadsheet (like Google Sheets).  The key that tells you which colors map to which
            numbers can be seen by clicking on the{` `}
            <span
               className={'spanLink'}
               onClick={navigateToStats}
            >
               STATS
            </span>{` `}
            link in the top nav bar.  Also, clicking on any of the color squares in the image below will highlight <i>every</i> instance
            of that color in the map.  Clicking the same color again will toggle the highlighting <i>off</i>.
         </Typography>
      </div>
      <table className={'borderSpacing_0'}>
         <tbody>
            {getTableRows()}
         </tbody>
      </table>
      <div className={'minHeight_500'}></div>
   </>
}