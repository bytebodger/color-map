import { useRef, useContext } from 'react';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';
import { useImage } from './useImage';
import { IndexState } from '../index/components/IndexContainer';

export const useFile = () => {
   const blob = useRef(null);
   const file = useRef(null);
   const image = useImage();
   const indexState = useContext(IndexState);

   const handleFile = (event = {}) => {
      allow.anObject(event, is.not.empty);
      read(event.target.files[0]);
   };

   const read = (chosenFile = {}) => {
      console.log('indexState', indexState);
      indexState.setShowProcessing(true);
      const fileReader = new FileReader();
      fileReader.onloadend = event => {
         file.current = chosenFile;
         blob.current = event.target.result;
         image.create(blob.current);
      };
      try {
         fileReader.readAsDataURL(chosenFile);
      } catch (e) {
         // no file - do nothing
         indexState.setShowProcessing(false);
      }
   };

   const reload = () => {
      if (!blob.current || !file.current)
         return;
      indexState.setShowProcessing(true);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
         image.create(blob.current);
      };
      fileReader.readAsDataURL(file.current);
   };

   return {
      file,
      handleFile,
      read,
      reload,
   };
};
