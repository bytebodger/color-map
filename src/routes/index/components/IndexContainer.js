import { Index } from '../Index';
import { createContext, useState } from 'react';
import { local } from '@toolz/local-storage';
import { algorithm as algorithms } from '../../objects/algorithm';
import { useStateWithCallback } from '../../hooks/useStateWithCallback';

export const IndexState = createContext({});

export const getPaletteArray = () => {
   const paletteList = getPaletteList();
   return paletteList === '' ? [] : paletteList.split(',');
}

export const getPaletteList = () => {
   const translation = {
      basePaints: 'Heavy Body Acrylics',
      halfWhites: 'Half-Whites',
      thirdWhites: 'Third-Whites',
      quarterWhites: 'Quarter-Whites',
   }
   const palettes = local.getItem('palettes', {
      basePaints: true,
      halfWhites: false,
      thirdWhites: false,
      quarterWhites: false,
   });
   let paletteList = [];
   Object.entries(palettes).forEach(entry => {
      const [key, isUsed] = entry;
      if (!isUsed)
         return;
      paletteList.push(translation[key]);
   });
   return paletteList.join(',');
}

export const IndexContainer = () => {
   const [algorithm, setAlgorithm] = useStateWithCallback(local.getItem('algorithm', algorithms.RGB));
   const [blockSize, setBlockSize] = useStateWithCallback(local.getItem('blockSize', 10));
   const [colorOrGreyscale, setColorOrGreyscale] = useStateWithCallback(local.getItem('colorOrGreyscale', 'color'));
   const [currentFile, setCurrentFile] = useState(null);
   const [imageSource, setImageSource] = useState(null);
   const [matchToPalette, setMatchToPalette] = useStateWithCallback(local.getItem('matchToPalette', false));
   const [maximumColors, setMaximumColors] = useStateWithCallback(local.getItem('maximumColors', 0));
   const [minimumThreshold, setMinimumThreshold] = useStateWithCallback(local.getItem('minimumThreshold', 5));
   const [paletteList, setPaletteList] = useState(getPaletteList());
   const [paletteArray, setPaletteArray] = useState(getPaletteArray());
   const [palettes, setPalettes] = useStateWithCallback(local.getItem('palettes') || {});
   const [progress, setProgress] = useState([0]);
   const [showProcessing, setShowProcessing] = useState(false);

   return <>
      <IndexState.Provider value={{
         algorithm,
         blockSize,
         colorOrGreyscale,
         currentFile,
         imageSource,
         matchToPalette,
         maximumColors,
         minimumThreshold,
         paletteArray,
         paletteList,
         palettes,
         progress,
         setAlgorithm,
         setBlockSize,
         setColorOrGreyscale,
         setCurrentFile,
         setImageSource,
         setMatchToPalette,
         setMaximumColors,
         setMinimumThreshold,
         setPaletteArray,
         setPaletteList,
         setPalettes,
         setProgress,
         setShowProcessing,
         showProcessing,
      }}>
         <Index progress={progress[0]}/>
      </IndexState.Provider>
   </>
}
