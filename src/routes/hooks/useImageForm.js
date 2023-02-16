import { useState } from 'react';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';
import { use } from '../objects/use';
import { local } from '@toolz/local-storage';
import { algorithm as algorithms } from '../objects/algorithm';

const getPaletteArray = () => {
   const paletteList = getPaletteList();
   return paletteList === '' ? [] : paletteList.split(',');
}

const getPaletteList = () => {
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

export const useImageForm = () => {
   const [algorithm, setAlgorithm] = useState(local.getItem('algorithm', algorithms.RGB));
   const [blockSize, setBlockSize] = useState(Number(local.getItem('blockSize', 10)));
   const [colorOrGreyscale, setColorOrGreyscale] = useState(local.getItem('colorOrGreyscale', 'color'));
   const [matchToPalette, setMatchToPalette] = useState(Boolean(local.getItem('matchToPalette', false)));
   const [maximumColors, setMaximumColors] = useState(Number(local.getItem('maximumColors', 0)));
   const [minimumThreshold, setMinimumThreshold] = useState(Number(local.getItem('minimumThreshold', 5)));
   const [paletteList, setPaletteList] = useState(getPaletteList());
   const [paletteArray, setPaletteArray] = useState(getPaletteArray());
   const [palettes, setPalettes] = useState(local.getItem('palettes') || {});

   const file = use.file;

   const handleAlgorithm = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      updateAlgorithm(value);
   };

   const handleBlockSize = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      const size = parseInt(value, 10);
      updateBlockSize(size);
   };

   const handleColorOrGreyscale = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      updateColorOrGreyscale(value);
   };

   const handleFile = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const [source] = event.target.files;
      file.read(source);
   };

   const handleMatchToPalette = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {checked} = event.target;
      updateMatchToPalette(checked);
   };

   const handleMaximumColors = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      const maximum = parseInt(value, 10);
      updateMaximumColors(maximum);
   };

   const handleMinimumThreshold = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const {value} = event.target;
      const minimum = parseInt(value, 10);
      updateMinimumThreshold(minimum);
   }

   const handlePalettes = (name = '', value = false) => {
      allow.aString(name, is.not.empty).aBoolean(value);
      updatePalettes(name, value);
   };

   const updateAlgorithm = (value = '') => {
      allow.aString(value, is.not.empty);
      local.setItem('algorithm', value);
      setAlgorithm(value);
      file.reload();
   };

   const updateBlockSize = (size = 0) => {
      allow.aNumber(size, 1, 100);
      local.setItem('blockSize', size);
      setBlockSize(size);
      file.reload();
   };

   const updateColorOrGreyscale = (value = '') => {
      allow.oneOf(value, ['color', 'greyscale']);
      local.setItem('colorOrGreyscale', value);
      setColorOrGreyscale(value);
      file.reload();
   };

   const updateMatchToPalette = (checked = false) => {
      allow.aBoolean(checked);
      local.setItem('matchToPalette', checked);
      setMatchToPalette(Boolean(checked));
      file.reload();
   };

   const updateMaximumColors = (maximum = -1) => {
      allow.anInteger(maximum, is.not.negative);
      local.setItem('maximumColors', maximum);
      setMaximumColors(maximum);
      file.reload();
   };

   const updateMinimumThreshold = (minimum = 0) => {
      allow.anInteger(minimum, is.positive);
      local.setItem('minimumThreshold', minimum);
      setMinimumThreshold(minimum);
      file.reload();
   }

   const updatePalettes = (key = '', value = false) => {
      allow.aString(key, is.not.empty).aBoolean(value);
      const newPalettes = {...palettes};
      newPalettes[key] = value;
      local.setItem('palettes', newPalettes);
      setPaletteList(getPaletteList());
      setPalettes(newPalettes);
      setPaletteArray(getPaletteArray());
      file.reload();
   };

   return {
      algorithm,
      blockSize,
      colorOrGreyscale,
      handleAlgorithm,
      handleBlockSize,
      handleColorOrGreyscale,
      handleFile,
      handleMatchToPalette,
      handleMaximumColors,
      handleMinimumThreshold,
      handlePalettes,
      matchToPalette,
      maximumColors,
      minimumThreshold,
      paletteArray,
      paletteList,
      palettes,
   };
};
