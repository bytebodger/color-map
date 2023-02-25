import { useState } from 'react';
import { isARegularObject } from '@toolz/is-a-regular-object';

export const useSynchronousState = initialValue => {
   const [value, updateValue] = useState(initialValue);

   let latestValue = value;

   const get = () => latestValue;

   const set = newValue => {
      if (Array.isArray(newValue) || isARegularObject(newValue))
         latestValue = structuredClone(newValue);
      else
         latestValue = newValue;
      updateValue(newValue);
      return latestValue;
   };

   return [
      get,
      set,
   ];
}