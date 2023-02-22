export const getEnvironment = () => {
   const url = window.location.href;
   if (url.includes('//localhost'))
      return 'localhost';
   if (url.includes('paintmap.studio'))
      return 'production';
   return 'unknown';
};
