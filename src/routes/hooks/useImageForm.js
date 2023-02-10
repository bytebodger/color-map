import { useState } from 'react';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';
import { use } from '../objects/use';

export const useImageForm = () => {
   const [blockSize, setBlockSize] = useState(10);
   const file = use.file;

   const handleBlockSize = (event = {}) => {
      allow.anObject(event, is.not.empty);
      const size = parseInt(event.target.value, 10);
      updateBlockSize(size);
   }

   const handleFile = (event = {}) => {
      allow.anObject(event, is.not.empty);
      file.read(event.target.files[0]);
   }

   const updateBlockSize = (size = 0) => {
      allow.aNumber(size, 1, 100);
      setBlockSize(size);
   }

   return {
      blockSize,
      handleBlockSize,
      handleFile,
   }
}
