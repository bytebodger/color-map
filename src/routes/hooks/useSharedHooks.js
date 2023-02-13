import { use } from '../objects/use';
import { useFile } from './useFile';
import { useImage } from './useImage';
import { useImageForm } from './useImageForm';

export const useSharedHooks = () => {
   use.image = useImage();
   use.file = useFile();
   use.imageForm = useImageForm();
}
