import { useState } from 'react';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';
import { use } from '../objects/use';
import { local } from '@toolz/local-storage';


export const useImageForm = () => {
   const [algorithm, setAlgorithm] = useState(Number(local.getItem('algorithm', 1)));
   const [blockSize, setBlockSize] = useState(Number(local.getItem('blockSize', 10)));
   const [colorOrGreyscale, setColorOrGreyscale] = useState(local.getItem('colorOrGreyscale', 'color'));
   const [matchToPalette, setMatchToPalette] = useState(Boolean(local.getItem('matchToPalette', false)));
   const [palettes, setPalettes] = useState(local.getItem('palettes', {
      basePaints: true,
      halfWhites: false,
      thirdWhites: false,
      quarterWhites: false,
   }) || {});
   const file = use.file;

   const handleAlgorithm = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const { value } = event.target;
      const algorithmId = parseInt(value, 10);
      updateAlgorithm(algorithmId);
   }

   const handleBlockSize = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const { value } = event.target;
      const size = parseInt(value, 10);
      updateBlockSize(size);
   }

   const handleColorOrGreyscale = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const { value } = event.target;
      updateColorOrGreyscale(value);
   }

   const handleFile = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const [ source ] = event.target.files;
      file.read(source);
   }

   const handleMatchToPalette = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const { checked } = event.target;
      updateMatchToPalette(checked);
   }

   const handlePalettes = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const { checked, name } = event.target;
      updatePalettes(name, checked);
   }

   const updateAlgorithm = (algorithmId = -1) => {
      allow.anInteger(algorithmId, is.not.negative);
      local.setItem('algorithm', algorithmId);
      setAlgorithm(algorithmId);
      file.reload();
   }

   const updateBlockSize = (size = 0) => {
      allow.aNumber(size, 1, 100);
      local.setItem('blockSize', size);
      setBlockSize(size);
      file.reload();
   }

   const updateColorOrGreyscale = (value = '') => {
      allow.oneOf(value, ['color', 'greyscale']);
      local.setItem('colorOrGreyscale', value);
      setColorOrGreyscale(value);
      file.reload();
   }

   const updateMatchToPalette = (checked = false) => {
      allow.aBoolean(checked);
      local.setItem('matchToPalette', checked);
      setMatchToPalette(Boolean(checked));
      file.reload();
   }

   const updatePalettes = (key = '', value = false) => {
      allow.aString(key, is.not.empty).aBoolean(value);
      const newPalettes = { ...palettes };
      newPalettes[key] = value;
      local.setItem('palettes', newPalettes);
      setPalettes(newPalettes);
      file.reload();
   }

   return {
      algorithm,
      blockSize,
      colorOrGreyscale,
      handleAlgorithm,
      handleBlockSize,
      handleColorOrGreyscale,
      handleFile,
      handleMatchToPalette,
      handlePalettes,
      matchToPalette,
      palettes,
   }
}
