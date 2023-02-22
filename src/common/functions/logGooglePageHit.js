import { allow } from '@toolz/allow-react';
import { is } from '../objects/is';
import { getEnvironment } from './getEnvironment';

export const logGooglePageHit = (page = '') => {
   allow.aString(page, is.not.empty);
   if (getEnvironment() === 'localhost')
      return;
   window.gtag('event', 'page_view', {page_path: '/' + page});
};
