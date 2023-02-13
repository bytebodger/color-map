import { useRef, useEffect } from 'react';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';
import { algorithm } from '../objects/algorithm';
import { rgbModel } from '../objects/models/rgbModel';
import { local } from '@toolz/local-storage';
import { palettes } from '../arrays/palettes';
import { Colour } from '../classes/colour';

export const useImage = () => {
   const canvas = useRef(null);
   const context = useRef(null);
   const image = useRef(null);
   let closestColors = {};
   let lightInsensitivity = 75;
   let palette = [];

   const calculateAverageColor = (imageData = {}) => {
      allow.anObject(imageData, is.not.empty);
      let redSum = 0;
      let redCounter = 0;
      let greenSum = 0;
      let greenCounter = 0;
      let blueSum = 0;
      let blueCounter = 0;
      for (let x = 0; x < imageData.width; x++) {
         for (let y = 0; y < imageData.height; y++) {
            const pixel = getPixelObjectFromImageData(imageData, x, y);
            const [ red ] = pixel.red;
            const [ green ] = pixel.green;
            const [ blue ] = pixel.blue;
            if (red) {
               redSum += red;
               redCounter++;
            }
            if (green) {
               greenSum += green;
               greenCounter++;
            }
            if (blue) {
               blueSum += blue;
               blueCounter++;
            }
         }
      }
      return {
         red: redSum / redCounter,
         green: greenSum / greenCounter,
         blue: blueSum / blueCounter,
      };
   };

   useEffect(() => {
      canvas.current = document.getElementById('canvas');
   }, []);

   const create = (src = '') => {
      allow.aString(src);
      const source = src === '' ? image.current.src : src;
      const newImage = new Image();
      newImage.src = source;
      newImage.onload = () => {
         image.current = newImage;
         canvas.current.width = newImage.width;
         canvas.current.height = newImage.height;
         context.current = canvas.current.getContext('2d');
         context.current.drawImage(newImage, 0, 0);
         pixelate();
      };
      return newImage;
   };

   const getClosestColorInThePalette = (referenceColor = rgbModel) => {
      allow.anInstanceOf(referenceColor, rgbModel);
      const key = `${referenceColor.red},${referenceColor.green},${referenceColor.blue}`;
      if (closestColors[key])
         return closestColors[key];
      let closestColor = {
         blue: -1,
         green: -1,
         name: '',
         red: -1,
      };
      let shortestDistance = Number.MAX_SAFE_INTEGER;
      const currentAlgorithm = local.getItem('algorithm');
      palette.forEach(paletteColor => {
         if (shortestDistance === 0)
            return;
         let distance;
         switch (currentAlgorithm) {
            case algorithm.HSV_3D:
               const paletteCoordinates = getCoordinates(paletteColor);
               const referenceCoordinates = getCoordinates(referenceColor);
               const xDifferenceSquared = Math.pow((referenceCoordinates.x - paletteCoordinates.x), 2);
               const yDifferenceSquared = Math.pow((referenceCoordinates.y - paletteCoordinates.y), 2);
               const zDifferenceSquared = Math.pow((referenceCoordinates.z - paletteCoordinates.z), 2);
               distance = Math.sqrt(xDifferenceSquared + yDifferenceSquared + zDifferenceSquared);
               break;
            case algorithm.RGBPLUS_SIMPLE:
               distance = Math.abs(paletteColor.red - referenceColor.red)
                  + Math.abs(paletteColor.green - referenceColor.green)
                  + Math.abs(paletteColor.blue - referenceColor.blue)
                  + Math.abs((paletteColor.red + paletteColor.green + paletteColor.blue) - (referenceColor.red + referenceColor.green + referenceColor.blue));
               break;
            case algorithm.RGBPLUS_SQUARED:
               distance = Math.pow((paletteColor.red - referenceColor.red), 2)
                  + Math.pow((paletteColor.green - referenceColor.green), 2)
                  + Math.pow((paletteColor.blue - referenceColor.blue), 2)
                  + Math.pow(((paletteColor.red + paletteColor.green + paletteColor.blue) - (referenceColor.red + referenceColor.green + referenceColor.blue)), 2);
               break;
            case algorithm.RGB_SQUARED:
               distance = Math.pow((paletteColor.red - referenceColor.red), 2)
                  + Math.pow((paletteColor.green - referenceColor.green), 2)
                  + Math.pow((paletteColor.blue - referenceColor.blue), 2);
               break;
            case algorithm.RGB_COLOR_WEIGHTED:
               const primaryColors = [];
               const secondaryColors = [];
               const tertiaryColors = [];
               if (referenceColor.red > referenceColor.green && referenceColor.red > referenceColor.blue) {
                  primaryColors.push('red');
                  if (referenceColor.green === referenceColor.blue) {
                     secondaryColors.push('green');
                     secondaryColors.push('blue');
                  } else if (referenceColor.green > referenceColor.blue) {
                     secondaryColors.push('green');
                     tertiaryColors.push('blue');
                  } else if (referenceColor.blue > referenceColor.green) {
                     secondaryColors.push('blue');
                     tertiaryColors.push('green');
                  }
               } else if (referenceColor.red > referenceColor.green && referenceColor.red === referenceColor.blue) {
                  primaryColors.push('red');
                  primaryColors.push('blue');
                  tertiaryColors.push('green');
               } else if (referenceColor.red > referenceColor.blue && referenceColor.red === referenceColor.green) {
                  primaryColors.push('red');
                  primaryColors.push('green');
                  tertiaryColors.push('blue');
               } else if (referenceColor.green > referenceColor.red && referenceColor.green > referenceColor.blue) {
                  primaryColors.push('green');
                  if (referenceColor.red === referenceColor.blue) {
                     secondaryColors.push('red');
                     secondaryColors.push('blue');
                  } else if (referenceColor.red > referenceColor.blue) {
                     secondaryColors.push('red');
                     tertiaryColors.push('blue');
                  } else if (referenceColor.blue > referenceColor.red) {
                     secondaryColors.push('blue');
                     tertiaryColors.push('red');
                  }
               } else if (referenceColor.green > referenceColor.red && referenceColor.green === referenceColor.blue) {
                  primaryColors.push('green');
                  primaryColors.push('blue');
                  tertiaryColors.push('red');
               } else if (referenceColor.green > referenceColor.blue && referenceColor.green === referenceColor.red) {
                  primaryColors.push('green');
                  primaryColors.push('red');
                  tertiaryColors.push('blue');
               } else if (referenceColor.blue > referenceColor.green && referenceColor.blue > referenceColor.red) {
                  primaryColors.push('blue');
                  if (referenceColor.green === referenceColor.red) {
                     secondaryColors.push('green');
                     secondaryColors.push('red');
                  } else if (referenceColor.green > referenceColor.red) {
                     secondaryColors.push('green');
                     tertiaryColors.push('red');
                  } else if (referenceColor.red > referenceColor.green) {
                     secondaryColors.push('red');
                     tertiaryColors.push('green');
                  }
               } else if (referenceColor.blue > referenceColor.green && referenceColor.blue === referenceColor.red) {
                  primaryColors.push('blue');
                  primaryColors.push('red');
                  tertiaryColors.push('green');
               } else if (referenceColor.blue > referenceColor.red && referenceColor.blue === referenceColor.green) {
                  primaryColors.push('blue');
                  primaryColors.push('green');
                  tertiaryColors.push('red');
               }
               distance = 0;
               primaryColors.forEach(primaryColor => {
                  distance += Math.abs(paletteColor[primaryColor] - referenceColor[primaryColor]) * 4;
                  secondaryColors.forEach(secondaryColor => {
                     distance += Math.abs(paletteColor[secondaryColor] - referenceColor[secondaryColor]) * 2;
                     const referenceDiffBetweenPrimaryAndSecondary = Math.abs(referenceColor[primaryColor] - referenceColor[secondaryColor]);
                     const paletteDiffBetweenPrimaryAndSecondary = Math.abs(paletteColor[primaryColor] - paletteColor[secondaryColor]);
                     distance += Math.abs(referenceDiffBetweenPrimaryAndSecondary - paletteDiffBetweenPrimaryAndSecondary);
                     tertiaryColors.forEach(tertiaryColor => {
                        const referenceDiffBetweenSecondaryAndTertiary = Math.abs(referenceColor[secondaryColor] - referenceColor[tertiaryColor]);
                        const paletteDiffBetweenSecondaryAndTertiary = Math.abs(paletteColor[secondaryColor] - paletteColor[tertiaryColor]);
                        distance += Math.abs(referenceDiffBetweenSecondaryAndTertiary - paletteDiffBetweenSecondaryAndTertiary);
                     });
                  });
                  tertiaryColors.forEach(tertiaryColor => {
                     distance += Math.abs(paletteColor[tertiaryColor] - referenceColor[tertiaryColor]);
                     const referenceDiffBetweenPrimaryAndTertiary = Math.abs(referenceColor[primaryColor] - referenceColor[tertiaryColor]);
                     const paletteDiffBetweenPrimaryAndTertiary = Math.abs(paletteColor[primaryColor] - paletteColor[tertiaryColor]);
                     distance += Math.abs(referenceDiffBetweenPrimaryAndTertiary - paletteDiffBetweenPrimaryAndTertiary);
                  });
                });
               break;
            case algorithm.DELTA_E:
               const paletteLabColor = Colour.rgba2lab(paletteColor.red, paletteColor.green, paletteColor.blue);
               const referenceLabColor = Colour.rgba2lab(referenceColor.red, referenceColor.green, referenceColor.blue);
               distance = Colour.deltaE00(paletteLabColor[0], paletteLabColor[1], paletteLabColor[2], referenceLabColor[0], referenceLabColor[1], referenceLabColor[2]);
               break;
            case algorithm.RGB_SIMPLE:
            default:
               distance = Math.abs(paletteColor.red - referenceColor.red)
                  + Math.abs(paletteColor.green - referenceColor.green)
                  + Math.abs(paletteColor.blue - referenceColor.blue);
               break;
         }
         if (distance < shortestDistance) {
            shortestDistance = distance;
            closestColor = paletteColor;
            closestColors[key] = paletteColor;
         }
      });
      return closestColor;
   };

   const getCoordinates = (rgbObject = rgbModel) => {
      allow.anInstanceOf(rgbObject, rgbModel);
      const hsvObject = getHsvObjectFromRgbObject(rgbObject);
      const theta = hsvObject.hue * 2 * Math.PI;
      const maxRadius = lightInsensitivity / 2;
      const radius = hsvObject.saturation * maxRadius;
      const x = radius * Math.cos(theta) + maxRadius;
      const y = radius * Math.sin(theta) + maxRadius;
      return {
         x,
         y,
         z: hsvObject.value * 100,
      };
   };

   const getHsvObjectFromRgbObject = (rgbObject = rgbModel) => {
      allow.anInstanceOf(rgbObject, rgbModel);
      const red = rgbObject.red / 255;
      const green = rgbObject.green / 255;
      const blue = rgbObject.blue / 255;
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      let hue;
      const value = max;
      const range = max - min;
      const saturation = max === 0 ? 0 : range / max;
      if (max === min) {
         hue = 0;
      } else {
         switch (max) {
            case red:
               hue = (green - blue) / range + (green < blue ? 6 : 0);
               break;
            case green:
               hue = (blue - red) / range + 2;
               break;
            case blue:
            default:
               hue = (red - green) / range + 4;
         }
         hue = hue / 6;
      }
      return {
         hue,
         saturation,
         value,
      };
   };

   const getPixelIndex = (x = -1, y = -1) => {
      allow.anInteger(x, is.not.negative).anInteger(y, is.not.negative);
      return ((image.current.width * y) + x) * 4;
   };

   const getPixelObjectFromImageData = (imageData = {}, x = -1, y = -1) => {
      allow.anObject(imageData).anInteger(x, is.not.negative).anInteger(y, is.not.negative);
      const index = getPixelIndex(x, y);
      return {
         alpa: [imageData.data[index + 3], index + 3],
         blue: [imageData.data[index + 2], index + 2],
         green: [imageData.data[index + 1], index + 1],
         red: [imageData.data[index], index],
         x,
         y,
      };
   };

   const loadPalettes = () => {
      const chosenPalettes = local.getItem('palettes');
      Object.entries(chosenPalettes).forEach(entry => {
         const [ name, shouldLoad ] = entry;
         if (!shouldLoad)
            return;
         palette = [...palette, ...palettes[name]];
      });
   }

   const pixelate = () => {
      const imageData = context.current.getImageData(0, 0, canvas.current.width, canvas.current.height);
      const stats = {
         colors: {},
         map: [],
      };
      const blockSize = local.getItem('blockSize');
      const matchToPalette = local.getItem('matchToPalette');
      if (matchToPalette)
         loadPalettes();
      for (let y = 0; y < imageData.height; y += blockSize) {
         const row = [];
         for (let x = 0; x < imageData.width; x += blockSize) {
            const remainingX = imageData.width - x;
            const remainingY = imageData.height - y;
            const blockX = remainingX > blockSize ? blockSize : remainingX;
            const blockY = remainingY > blockSize ? blockSize : remainingY;
            const averageColor = calculateAverageColor(context.current.getImageData(x, y, blockX, blockY));
            const referenceColor = {
               blue: averageColor.blue,
               green: averageColor.green,
               red: averageColor.red,
               name: '',
            };
            const color = matchToPalette ? getClosestColorInThePalette(referenceColor) : averageColor;
            row.push(color);
            if (color.name) {
               if (Object.hasOwn(stats.colors, color.name))
                  stats.colors[color.name]++;
               else
                  stats.colors[color.name] = 1;
            }
            context.current.fillStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;
            context.current.fillRect(x, y, blockX, blockY);
         }
         stats.map.push(row);
      }
      return stats;
   };

   return {
      create,
      image,
      pixelate,
   }
}
