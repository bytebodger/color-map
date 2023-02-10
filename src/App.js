import { UI } from './UI';
import { useSharedHooks } from './routes/hooks/useSharedHooks';

export const App = () => {
   useSharedHooks();

   return <UI/>;
};
