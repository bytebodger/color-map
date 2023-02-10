import { useRef } from 'react';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';

export const useImage = () => {
   const current = useRef(null);

   const create = (source = '') => {
      allow.aString(source, is.not.empty);
      const image = new Image();
      image.src = source;
      image.onload = () => {
         current.current = image;
         const canvas = document.getElementById('canvas');
         canvas.width = image.width;
         canvas.height = image.height;
         const context = canvas.getContext('2d');
         context.drawImage(image, 0, 0);
      };
      return image;
   };

   return {
      create,
      current,
   }
}
