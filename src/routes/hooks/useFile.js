import { useRef } from 'react';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';
import { use } from '../objects/use';

export const useFile = () => {
   const blob = useRef(null);
   const file = useRef(null);
   const image = use.image;

   const handleFile = (event = {}) => {
      allow.anObject(event, is.not.empty);
      read(event.target.files[0]);
   }

   const read = (chosenFile = {}) => {
      const fileReader = new FileReader();
      fileReader.onloadend = event => {
         file.current = chosenFile;
         blob.current = event.target.result;
         image.create(blob.current);
      };
      fileReader.readAsDataURL(chosenFile);
   };

   const reload = () => {
      if (!blob.current || !file.current)
         return;
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
         image.create(blob.current);
      }
      fileReader.readAsDataURL(file.current);
   }

   return {
      file,
      handleFile,
      read,
      reload,
   }
}
