import { useRef } from 'react';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';

export const useFile = () => {
   const blob = useRef(null);
   const file = useRef(null);
   let imageHook;
   let imageFormHook;

   const handleFile = (event = {}) => {
      allow.anObject(event, is.not.empty);
      read(event.target.files[0]);
   };

   const read = (chosenFile = {}) => {
      imageFormHook.updateShowProcessing(true);
      const fileReader = new FileReader();
      fileReader.onloadend = event => {
         file.current = chosenFile;
         blob.current = event.target.result;
         imageHook.create(blob.current);
      };
      try {
         fileReader.readAsDataURL(chosenFile);
      } catch (e) {
         // no file - do nothing
         imageFormHook.updateShowProcessing(false);
      }
   };

   const reload = () => {
      if (!blob.current || !file.current)
         return;
      imageFormHook.updateShowProcessing(true);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
         imageHook.create(blob.current);
      };
      fileReader.readAsDataURL(file.current);
   };

   const setImageFormHook = (hook = {}) => {
      allow.anObject(hook, is.not.empty);
      imageFormHook = hook;
   }

   const setImageHook = (hook = {}) => {
      allow.anObject(hook, is.not.empty);
      imageHook = hook;
   }

   return {
      file,
      handleFile,
      read,
      reload,
      setImageFormHook,
      setImageHook,
   };
};
