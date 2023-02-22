import { palettes } from '../arrays/palettes';
import { useImage } from './useImage';

export const useAllColors = () => {
   const image = useImage();

   const get = () => {
      const colors = [...palettes.basePaints];
      const white = {
         red: 255,
         green: 255,
         blue: 255,
         name: '',
      }
      palettes.basePaints.forEach(baseColor => {
         const mixedColor = image.mixRgbColorsSubtractively([baseColor, baseColor, baseColor, white]);
         mixedColor.name = `${baseColor.name} (1/4 White)`;
         colors.push(mixedColor);
      })
      palettes.basePaints.forEach(baseColor => {
         const mixedColor = image.mixRgbColorsSubtractively([baseColor, baseColor, white]);
         mixedColor.name = `${baseColor.name} (1/3 White)`;
         colors.push(mixedColor);
      })
      palettes.basePaints.forEach(baseColor => {
         const mixedColor = image.mixRgbColorsSubtractively([baseColor, white]);
         mixedColor.name = `${baseColor.name} (1/2 White)`;
         colors.push(mixedColor);
      })
      palettes.basePaints.forEach(baseColor => {
         const mixedColor = image.mixRgbColorsSubtractively([baseColor, white, white]);
         mixedColor.name = `${baseColor.name} (2/3 White)`;
         colors.push(mixedColor);
      })
      palettes.basePaints.forEach(baseColor => {
         const mixedColor = image.mixRgbColorsSubtractively([baseColor, white, white, white]);
         mixedColor.name = `${baseColor.name} (3/4 White)`;
         colors.push(mixedColor);
      })
      return colors;
   }

   return {
      get,
   }
}