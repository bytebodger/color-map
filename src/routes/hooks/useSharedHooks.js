import { use } from '../objects/use';
import { useFile } from './useFile';
import { useImage } from './useImage';
import { useImageForm } from './useImageForm';

export const useSharedHooks = () => {
   use.file = useFile();
   use.image = useImage();
   use.imageForm = useImageForm();
}
