import { useState } from 'react';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';
import { use } from '../objects/use';
import { local } from '@toolz/local-storage';


export const useImageForm = () => {
   const [algorithm, setAlgorithm] = useState(Number(local.getItem('algorithm', 1)));
   const [blockSize, setBlockSize] = useState(Number(local.getItem('blockSize', 10)));
   const [matchToPalette, setMatchToPalette] = useState(Boolean(local.getItem('matchToPalette', false)));
   const [palettes, setPalettes] = useState(local.getItem('palettes', {
      basePaints: true,
      halfWhites: false,
      quarterWhites: false,
      halfBlacks: false,
      quarterBlacks: false,
   }) || {});
   const file = use.file;

   const handleBlockSize = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const { value } = event.target;
      const size = parseInt(value, 10);
      updateBlockSize(size);
   }

   const handleAlgorithm = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const { value } = event.target;
      const algorithmId = parseInt(value, 10);
      updateAlgorithm(algorithmId);
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
      handleAlgorithm,
      handleBlockSize,
      handleFile,
      handleMatchToPalette,
      handlePalettes,
      matchToPalette,
      palettes,
   }
}
