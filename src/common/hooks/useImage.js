import { useRef, useEffect, useContext } from 'react';
import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';
import { algorithm as algorithms } from '../objects/algorithm';
import { rgbModel } from '../objects/models/rgbModel';
import { palettes } from '../arrays/palettes';
import { xyzModel } from '../objects/models/xyzModel';
import { labModel } from '../objects/models/labModel';
import { cmykModel } from '../objects/models/cmykModel';
import { IndexState } from '../../routes/index/components/IndexContainer';
import { UIState } from '../../UI';

export const useImage = () => {
   const canvas = useRef(null);
   const context = useRef(null);
   const image = useRef(null);
   const indexState = useContext(IndexState);
   const uiState = useContext(UIState);
   let closestColors = {};
   let palette = [];
   let totalBlocks;
   let blocksProcessed;
   let previousProgress;
   let currentProgress;

   useEffect(() => {
      canvas.current = document.getElementById('canvas');
   }, []);

   const adjustColorDepth = (stats = {}) => {
      allow.anObject(stats, is.not.empty);
      const imageData = context.current.getImageData(0, 0, canvas.current.width, canvas.current.height);
      const adjustedStats = {
         colorCounts: {},
         colors: [],
         map: [],
      };
      const { algorithm, blockSize } = indexState;
      palette = filterPalette(stats);
      for (let y = 0; y < imageData.height; y += blockSize) {
         const row = [];
         for (let x = 0; x < imageData.width; x += blockSize) {
            const remainingX = imageData.width - x;
            const remainingY = imageData.height - y;
            const blockX = remainingX > blockSize ? blockSize : remainingX;
            const blockY = remainingY > blockSize ? blockSize : remainingY;
            const {red, green, blue} = getRgbFromImageData(imageData, x, y);
            const referenceColor = {
               blue,
               green,
               red,
               name: '',
            };
            const color = getClosestColorInThePalette(referenceColor);
            row.push(color);
            if (Object.hasOwn(adjustedStats.colorCounts, color.name))
               adjustedStats.colorCounts[color.name]++;
            else {
               adjustedStats.colorCounts[color.name] = 1;
               adjustedStats.colors.push(color);
            }
            context.current.fillStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;
            context.current.fillRect(x, y, blockX, blockY);
         }
         adjustedStats.map.push(row);
      }
      indexState.setShowProcessing(false);
      console.log(`${algorithm} color depth adjustment finished at ${window.performance.now()}`);
      return adjustedStats;
   };

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
            const {red, green, blue} = getRgbFromImageData(imageData, x, y);
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

   const calculateDeltaE2000 = (labColor1 = labModel, labColor2 = labModel) => {
      allow.anInstanceOf(labColor1, labModel).anInstanceOf(labColor2, labModel);
      const {lightness: lightness1, redGreen: redGreen1, blueYellow: blueYellow1} = labColor1;
      const {lightness: lightness2, redGreen: redGreen2, blueYellow: blueYellow2} = labColor2;
      // Utility functions added to Math Object
      Math.rad2deg = function (rad) {
         return 360 * rad / (2 * Math.PI);
      };
      Math.deg2rad = function (deg) {
         return (2 * Math.PI * deg) / 360;
      };
      // Start Equation
      // Equation exist on the following URL http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
      const avgL = (lightness1 + lightness2) / 2;
      const c1 = Math.sqrt(Math.pow(redGreen1, 2) + Math.pow(blueYellow1, 2));
      const c2 = Math.sqrt(Math.pow(redGreen2, 2) + Math.pow(blueYellow2, 2));
      const avgC = (c1 + c2) / 2;
      const g = (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7)))) / 2;
      const a1p = redGreen1 * (1 + g);
      const a2p = redGreen2 * (1 + g);
      const c1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(blueYellow1, 2));
      const c2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(blueYellow2, 2));
      const avgCp = (c1p + c2p) / 2;
      let h1p = Math.rad2deg(Math.atan2(blueYellow1, a1p));
      if (h1p < 0)
         h1p = h1p + 360;
      let h2p = Math.rad2deg(Math.atan2(blueYellow2, a2p));
      if (h2p < 0)
         h2p = h2p + 360;
      const avghp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;
      const t = 1 -
         0.17 * Math.cos(Math.deg2rad(avghp - 30))
         + 0.24 * Math.cos(Math.deg2rad(2 * avghp))
         + 0.32 * Math.cos(Math.deg2rad(3 * avghp + 6))
         - 0.2 * Math.cos(Math.deg2rad(4 * avghp - 63));
      let deltahp = h2p - h1p;
      if (Math.abs(deltahp) > 180) {
         if (h2p <= h1p) {
            deltahp += 360;
         } else {
            deltahp -= 360;
         }
      }
      const deltalp = lightness2 - lightness1;
      const deltacp = c2p - c1p;
      deltahp = 2 * Math.sqrt(c1p * c2p) * Math.sin(Math.deg2rad(deltahp) / 2);
      const sl = 1 + ((0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2)));
      const sc = 1 + 0.045 * avgCp;
      const sh = 1 + 0.015 * avgCp * t;
      const deltaro = 30 * Math.exp(-(Math.pow((avghp - 275) / 25, 2)));
      const rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
      const rt = -rc * Math.sin(2 * Math.deg2rad(deltaro));
      const kl = 1;
      const kc = 1;
      const kh = 1;
      return Math.sqrt(Math.pow(deltalp / (kl * sl), 2)
         + Math.pow(deltacp / (kc * sc), 2)
         + Math.pow(deltahp / (kh * sh), 2)
         + rt * (deltacp / (kc * sc)) * (deltahp / (kh * sh)));
   };

   const convertCmykToRgb = (cmykColor = cmykModel) => {
      allow.anInstanceOf(cmykColor, cmykModel);
      const {cyan, magenta, yellow, key} = cmykColor;
      let red = cyan * (1.0 - key) + key;
      let green = magenta * (1.0 - key) + key;
      let blue = yellow * (1.0 - key) + key;
      red = Math.round((1.0 - red) * 255.0 + 0.5);
      green = Math.round((1.0 - green) * 255.0 + 0.5);
      blue = Math.round((1.0 - blue) * 255.0 + 0.5);
      return {
         red,
         green,
         blue,
      };
   };

   const convertRgbToCmyk = (rgbColor = rgbModel) => {
      allow.anInstanceOf(rgbColor, rgbModel);
      const {red, green, blue} = rgbColor;
      let cyan = 255 - red;
      let magenta = 255 - green;
      let yellow = 255 - blue;
      let key = Math.min(cyan, magenta, yellow);
      const divider = key === 255 ? 1 : 255 - key;
      cyan = ((cyan - key) / divider);
      magenta = ((magenta - key) / divider);
      yellow = ((yellow - key) / divider);
      key = key / 255;
      return {
         cyan,
         magenta,
         yellow,
         key,
      };
   };

   const convertRgbToLab = (rgbColor = rgbModel) => {
      allow.anInstanceOf(rgbColor, rgbModel);
      const xyzColor = convertRgbToXyz(rgbColor);
      return convertXyzTolab(xyzColor);
   };

   const convertRgbToXyz = (rgbColor = rgbModel) => {
      allow.anInstanceOf(rgbColor, rgbModel);
      let {red, green, blue} = rgbColor;
      if (red > 255)
         red = 255;
      else if (red < 0)
         red = 0;
      if (green > 255)
         green = 255;
      else if (green < 0)
         green = 0;
      if (blue > 255)
         blue = 255;
      else if (blue < 0)
         blue = 0;
      red = red / 255;
      green = green / 255;
      blue = blue / 255;
      // step 1
      if (red > 0.04045)
         red = Math.pow(((red + 0.055) / 1.055), 2.4);
      else
         red = red / 12.92;
      if (green > 0.04045)
         green = Math.pow(((green + 0.055) / 1.055), 2.4);
      else
         green = green / 12.92;
      if (blue > 0.04045)
         blue = Math.pow(((blue + 0.055) / 1.055), 2.4);
      else
         blue = blue / 12.92;
      // step 2
      red = red * 100;
      green = green * 100;
      blue = blue * 100;
      // step 3
      const x = (red * 0.4124564) + (green * 0.3575761) + (blue * 0.1804375);
      const y = (red * 0.2126729) + (green * 0.7151522) + (blue * 0.0721750);
      const z = (red * 0.0193339) + (green * 0.1191920) + (blue * 0.9503041);
      return {
         x,
         y,
         z,
      };
   };

   const convertXyzTolab = (xyzColor = xyzModel) => {
      allow.anInstanceOf(xyzColor, xyzModel);

      const adjust = value => value > 0.008856 ? Math.pow(value, (1 / 3)) : (7.787 * value) + (16 / 116);

      let {x, y, z} = xyzColor;
      // using 10o Observer (CIE 1964)
      // CIE10_D65 = {94.811f, 100f, 107.304f} => Daylight
      // step 1
      x = x / 94.811;
      y = y / 100;
      z = z / 107.304;
      // step 2
      x = adjust(x);
      y = adjust(y);
      z = adjust(z);
      // step 3
      const lightness = (116 * y) - 16;
      const redGreen = 500 * (x - y);
      const blueYellow = 200 * (y - z);
      return {
         lightness,
         redGreen,
         blueYellow,
      };
   };

   const create = (src = '') => {
      const source = src === '' ? image.current.src : src;
      const newImage = new Image();
      newImage.src = source;
      newImage.onload = () => {
         indexState.setShowProcessing(false);
         image.current = newImage;
         canvas.current.width = newImage.width;
         canvas.current.height = newImage.height;
         context.current = canvas.current.getContext('2d', {alpha: false, willReadFrequently: true});
         context.current.drawImage(newImage, 0, 0);
         let stats = pixelate();
         const { matchToPalette, maximumColors } = indexState;
         if (matchToPalette && maximumColors !== 0)
            stats = adjustColorDepth(stats);
         else
            indexState.setShowProcessing(false);
         uiState.setStats(stats);
         uiState.setShowStatsLink(true);
      }
      return newImage;
   };

   const filterPalette = (stats = {}) => {
      allow.anObject(stats, is.not.empty);
      const sortedColorCounts = sortPalette(stats);
      const filteredPalette = [];
      sortedColorCounts.forEach(colorCount => {
         const [colorName] = colorCount;
         const filteredColor = stats.colors.find(color => color.name === colorName);
         filteredPalette.push(filteredColor);
      });
      return filteredPalette;
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
      const { algorithm } = indexState;
      palette.forEach(paletteColor => {
         if (shortestDistance === 0)
            return;
         let distance;
         switch (algorithm) {
            case algorithms.XYZ:
               const {x: paletteX, y: paletteY, z: paletteZ} = convertRgbToXyz(paletteColor);
               const {x: referenceX, y: referenceY, z: referenceZ} = convertRgbToXyz(referenceColor);
               distance = Math.abs(referenceX - paletteX)
                  + Math.abs(referenceY - paletteY)
                  + Math.abs(referenceZ - paletteZ);
               break;
            case algorithms.CMYK:
               const {cyan: paletteCyan, magenta: paletteMagenta, yellow: paletteYellow, key: paletteKey} = convertRgbToCmyk(paletteColor);
               const {cyan: referenceCyan, magenta: referenceMagenta, yellow: referenceYellow, key: referenceKey} = convertRgbToCmyk(referenceColor);
               distance = Math.abs(referenceCyan - paletteCyan)
                  + Math.abs(referenceMagenta - paletteMagenta)
                  + Math.abs(referenceYellow - paletteYellow)
                  + Math.abs(referenceKey - paletteKey);
               break;
            case algorithms.DELTA_E:
               const paletteLabColor = convertRgbToLab(paletteColor);
               const referenceLabColor = convertRgbToLab(referenceColor);
               distance = calculateDeltaE2000(paletteLabColor, referenceLabColor);
               break;
            case algorithms.RGB:
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

   const getPixelFromImageData = (imageData = {}, x = -1, y = -1) => {
      allow.anObject(imageData).anInteger(x, is.not.negative).anInteger(y, is.not.negative);
      const index = getPixelIndex(x, y);
      return {
         blue: [imageData.data[index + 2], index + 2],
         green: [imageData.data[index + 1], index + 1],
         red: [imageData.data[index], index],
         x,
         y,
      };
   };

   const getPixelIndex = (x = -1, y = -1) => {
      allow.anInteger(x, is.not.negative).anInteger(y, is.not.negative);
      return ((image.current.width * y) + x) * 4;
   };

   const getRgbFromImageData = (imageData = {}, x = -1, y = -1) => {
      allow.anObject(imageData).anInteger(x, is.not.negative).anInteger(y, is.not.negative);
      const pixelObject = getPixelFromImageData(imageData, x, y);
      const [red] = pixelObject.red;
      const [green] = pixelObject.green;
      const [blue] = pixelObject.blue;
      return {
         red,
         green,
         blue,
         name: '',
      }
   }

   const loadPalettes = () => {
      const { palettes: chosenPalettes } = indexState;
      const white = {
         red: 255,
         green: 255,
         blue: 255,
         name: 'generic white',
      };
      Object.entries(chosenPalettes).forEach(entry => {
         const [name, shouldLoad] = entry;
         if (!shouldLoad)
            return;
         switch (name) {
            case 'quarterWhites':
               palettes.basePaints.forEach(paint => {
                  const mixed = mixRgbColorsSubtractively([paint, paint, paint, white]);
                  mixed.name = `${paint.name} (1/4 White)`;
                  palette.push(mixed);
               });
               break;
            case 'thirdWhites':
               palettes.basePaints.forEach(paint => {
                  const mixed = mixRgbColorsSubtractively([paint, paint, white]);
                  mixed.name = `${paint.name} (1/3 White)`;
                  palette.push(mixed);
               });
               break;
            case 'halfWhites':
               palettes.basePaints.forEach(paint => {
                  const mixed = mixRgbColorsSubtractively([paint, white]);
                  mixed.name = `${paint.name} (1/2 White)`;
                  palette.push(mixed);
               });
               break;
            case 'twoThirdWhites':
               palettes.basePaints.forEach(paint => {
                  const mixed = mixRgbColorsSubtractively([paint, white, white]);
                  mixed.name = `${paint.name} (2/3 White)`;
                  palette.push(mixed);
               });
               break;
            case 'threeQuarterWhites':
               palettes.basePaints.forEach(paint => {
                  const mixed = mixRgbColorsSubtractively([paint, white, white, white]);
                  mixed.name = `${paint.name} (3/4 White)`;
                  palette.push(mixed);
               });
               break;
            default:
               palette = [...palette, ...palettes[name]];
         }
      });
   };

   const mixRgbColorsSubtractively = (rgbColors = [rgbModel]) => {
      allow.anArrayOfInstances(rgbColors, rgbModel);
      let cmykColors = [];
      rgbColors.forEach(rgbColor => cmykColors.push(convertRgbToCmyk(rgbColor)));
      let cyan = 0;
      let magenta = 0;
      let yellow = 0;
      let key = 0;
      cmykColors.forEach(cmykColor => {
         cyan += cmykColor.cyan;
         magenta += cmykColor.magenta;
         yellow += cmykColor.yellow;
         key += cmykColor.key;
      });
      const cmykColor = {
         cyan: cyan / cmykColors.length,
         magenta: magenta / cmykColors.length,
         yellow: yellow / cmykColors.length,
         key: key / cmykColors.length,
      };
      return convertCmykToRgb(cmykColor);
   };

   const pixelate = () => {
      const imageData = context.current.getImageData(0, 0, canvas.current.width, canvas.current.height);
      const stats = {
         colorCounts: {},
         colors: [],
         map: [],
      };
      const { algorithm, blockSize, colorOrGreyscale, matchToPalette } = indexState;
      if (matchToPalette)
         loadPalettes();
      totalBlocks = Math.ceil(imageData.height / blockSize) * Math.ceil(imageData.width / blockSize);
      blocksProcessed = 0;
      previousProgress = 0;
      for (let y = 0; y < imageData.height; y += blockSize) {
         const row = [];
         for (let x = 0; x < imageData.width; x += blockSize) {
            const remainingX = imageData.width - x;
            const remainingY = imageData.height - y;
            const blockX = remainingX > blockSize ? blockSize : remainingX;
            const blockY = remainingY > blockSize ? blockSize : remainingY;
            const averageColor = calculateAverageColor(context.current.getImageData(x, y, blockX, blockY));
            let referenceColor = {
               blue: averageColor.blue,
               green: averageColor.green,
               red: averageColor.red,
               name: '',
            };
            if (colorOrGreyscale === 'greyscale') {
               const darkness = Math.round((averageColor.red + averageColor.green + averageColor.blue) / 3);
               referenceColor.red = darkness;
               referenceColor.green = darkness;
               referenceColor.blue = darkness;
            }
            const closestColor = matchToPalette ? getClosestColorInThePalette(referenceColor) : averageColor;
            row.push(closestColor);
            if (!closestColor.name) {
               closestColor.red = Math.round(closestColor.red);
               closestColor.green = Math.round(closestColor.green);
               closestColor.blue = Math.round(closestColor.green);
               closestColor.name = `${closestColor.red}_${closestColor.green}_${closestColor.blue}`;
            }
            if (Object.hasOwn(stats.colorCounts, closestColor.name))
               stats.colorCounts[closestColor.name]++;
            else {
               stats.colorCounts[closestColor.name] = 1;
               stats.colors.push(closestColor);
            }
            context.current.fillStyle = `rgb(${closestColor.red}, ${closestColor.green}, ${closestColor.blue})`;
            context.current.fillRect(x, y, blockX, blockY);
            blocksProcessed++;
         }
         currentProgress = Math.ceil((blocksProcessed / totalBlocks) * 100);
         if (currentProgress !== previousProgress && currentProgress % 5 === 0) {
            console.log(`${currentProgress}% complete`);
         }
         previousProgress = currentProgress;
         stats.map.push(row);
      }
      if (matchToPalette)
         console.log(`${algorithm} calculation finished at ${window.performance.now()}`);
      else
         console.log(`raw calculation finished at ${window.performance.now()}`);
      return stats;
   };

   const sortPalette = (stats = {}) => {
      allow.anObject(stats, is.not.empty);

      const sort = (a, b) => {
         const [, aCount] = a;
         const [, bCount] = b;
         if (aCount > bCount)
            return -1;
         else if (aCount < bCount)
            return 1;
         else
            return 0;
      };

      const colorCounts = [];
      Object.entries(stats.colorCounts).forEach(colorCount => colorCounts.push(colorCount));
      colorCounts.sort(sort);
      const { maximumColors, minimumThreshold } = indexState;
      return colorCounts.filter((colorCount, index) => {
         const [, count] = colorCount;
         return index < maximumColors && count >= minimumThreshold;
      });
   };

   return {
      convertRgbToCmyk,
      create,
      mixRgbColorsSubtractively,
      pixelate,
   };
};
