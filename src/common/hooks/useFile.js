import { useContext } from 'react';
import { useImage } from './useImage';
import { IndexState } from '../../routes/index/components/IndexContainer';
import { UIState } from '../../UI';

export const useFile = () => {
   const image = useImage();
   const indexState = useContext(IndexState);
   const uiState = useContext(UIState);

   const read = (chosenFile = {}) => {
      indexState.setShowProcessing(true);
      const fileReader = new FileReader();
      fileReader.onloadend = event => {
         uiState.file.current = chosenFile;
         uiState.blob.current = event.target.result;
         image.create(uiState.blob.current);
      };
      try {
         fileReader.readAsDataURL(chosenFile);
      } catch (e) {
         // no file - do nothing
         indexState.setShowProcessing(false);
      }
   };

   const reload = () => {
      if (!uiState.blob.current || !uiState.file.current)
         return;
      indexState.setShowProcessing(true);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
         image.create(uiState.blob.current);
      };
      fileReader.readAsDataURL(uiState.file.current);
   };

   return {
      read,
      reload,
   };
};
