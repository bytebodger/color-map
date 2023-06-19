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
import { FormControl, InputLabel, Select, OutlinedInput, MenuItem } from '@mui/material';

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

   const getGridOutlineOptions = () => {
      const options = [];
      for (let i = 0; i <= 50; i += 5) {
         options.push(
            <MenuItem
               key={`gridOutline-${i}`}
               value={i}
            >
               {i}
            </MenuItem>,
         );
      }
      return options;
   };

   const getTableCells = (cells = [rgbModel], rowIndex = -1) => {
      allow.anArrayOfInstances(cells, rgbModel).anInteger(rowIndex, is.not.negative);
      const {gridOutline, highlightedColor} = uiState;
      return cells.map((cell, cellIndex) => {
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
         let style = {
            backgroundColor,
            borderWidth: highlightedColor === cell.name ? 5 : 0,
            color,
         }
         if (gridOutline && cellIndex && ((cellIndex + 1) % gridOutline === 0))
            style.borderRight = '5px solid red';
         return (
            <td
               className={'cell'}
               id={cell.name}
               key={`cell-${rowIndex}-${cellIndex}`}
               onClick={handleCellClick}
               style={style}
            >
               {paintIndex}
            </td>
         );
      });
   };

   const getTableRows = () => {
      colors = allColors.get();
      const {gridOutline} = uiState;
      return uiState.stats.map.map((row, rowIndex) => {
         const style = gridOutline && rowIndex && ((rowIndex + 1) % gridOutline === 0) ? {borderBottom: '5px solid red'} : {};
         return (
            <tr
               key={`row-${rowIndex}`}
               style={style}
            >
               {getTableCells(row, rowIndex)}
            </tr>
         );
      });
   };

   const handleCellClick = (event = {}) => {
      allow.anObject(event, is.not.empty);
      uiState.toggleHighlightedColor(event.target.id);
   };

   const handleGridOutline = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      const blocks = parseInt(value, 10);
      uiState.setGridOutline(blocks);
   };

   const navigateToStats = () => navigateTo('/stats');

   if (Object.keys(uiState.stats).length === 0)
      return null;

   return <>
      <h4 className={'marginBottom_8'}>Color Map</h4>
      <div className={'marginBottom_48'}>
         <Typography>
            This is essentially a paint-by-numbers grid for the image that you generated. You can copy all of the HTML from the
            grid below paste it into a spreadsheet (like Google Sheets). The key that tells you which colors map to which
            numbers can be seen by clicking on the{` `}
            <span
               className={'spanLink'}
               onClick={navigateToStats}
            >
               STATS
            </span>{` `}
            link in the top nav bar. Also, clicking on any of the color squares in the image below will highlight <i>every</i> instance
            of that color in the map. Clicking the same color again will toggle the highlighting <i>off</i>.
         </Typography>
         <br/>
         <FormControl sx={{m: 1, width: 100}}>
            <InputLabel
               id={'block-size-label'}
               size={'small'}
            >
               Grid Outline
            </InputLabel>
            <Select
               input={
                  <OutlinedInput label={'Grid Outline'}/>
               }
               labelId={'block-size-label'}
               onChange={handleGridOutline}
               size={'small'}
               value={uiState.gridOutline}
            >
               {getGridOutlineOptions()}
            </Select>
         </FormControl>
      </div>
      <table
         className={'borderSpacing_0'}
         style={{borderCollapse: 'collapse'}}
      >
         <tbody>
            {getTableRows()}
         </tbody>
      </table>
      <div className={'minHeight_500'}></div>
   </>;
};