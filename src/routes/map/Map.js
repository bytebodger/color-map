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
   const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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
         const isHighlightedCell = highlightedColor === cell.name;
         const isBottomGridOutline = gridOutline && rowIndex && ((rowIndex + 1) % gridOutline === 0);
         const isRightGridOutline = gridOutline && cellIndex && ((cellIndex + 1) % gridOutline === 0);
         let color;
         let backgroundColor;
         if (isHighlightedCell) {
            backgroundColor = '#39ff14';
            color = 'red';
         } else {
            backgroundColor = `rgb(${cell.red}, ${cell.green}, ${cell.blue})`;
            color = darkness < 128 ? 'white' : 'black';
         }
         let style = {
            backgroundColor,
            borderBottomWidth: isBottomGridOutline ? 5 : 0,
            borderLeftWidth: 0,
            borderRightWidth: isRightGridOutline ? 5 : 0,
            borderTopWidth: 0,
            color,
         }
         if (isRightGridOutline)
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

   const getTableHeaderCells = () => {
      let columnCounter = -1;
      const headerCells = [];
      const outerLetters = ['', ...letters];
      outerLetters.forEach(outerLetter => {
         if (columnCounter >= uiState.stats.map.length)
            return;
         letters.forEach(letter => {
            columnCounter++;
            if (columnCounter >= uiState.stats.map.length)
               return;
            headerCells.push(
               <th
                  id={`headerCell-${columnCounter}`}
                  key={`headerCell-${columnCounter}`}
                  style={{
                     background: 'white',
                     border: '1px solid black',
                     position: 'sticky',
                     top: 0,
                     zIndex: 1,
                  }}
               >
                  {`${outerLetter}${letter}`}
               </th>
            )
         })
      })
      return headerCells;
   }

   const getTableRows = () => {
      colors = allColors.get();
      return uiState.stats.map.map((row, rowIndex) => {
         return (
            <tr key={`row-${rowIndex}`}>
               <th>{rowIndex + 1}</th>
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
      <div
         aria-labelledby={'caption'}
         role={'region'}
         tabIndex={0}
      >
         <table style={{
            border: 'none',
            borderCollapse: 'separate',
            borderSpacing: 0,
            margin: 0,
            tableLayout: 'fixed',
            whiteSpace: 'nowrap',
         }}>
            <thead>
               <tr>
                  <th/>
                  {getTableHeaderCells()}
               </tr>
            </thead>
            <tbody>
               {getTableRows()}
            </tbody>
         </table>
      </div>
      <div className={'minHeight_500'}></div>
   </>;
};