import { useRef } from 'react';
import { useImage } from './useImage';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';

export const useFile = () => {
   const current = useRef(null);
   const image = useImage();

   const handleFile = (event = {}) => {
      allow.anObject(event, is.not.empty);
      read(event.target.files[0]);
   }

   const read = (chosenFile = {}) => {
      const fileReader = new FileReader();
      fileReader.onloadend = event => {
         current.current = chosenFile;
         image.create(event.target.result);
      };
      fileReader.readAsDataURL(chosenFile);
   };

   return {
      current,
      handleFile,
      read,
   }
}
