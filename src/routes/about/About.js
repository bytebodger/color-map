import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import Typography from '@mui/material/Typography';
import './css/about.css';
import '../../common/css/baseProperties.css';
import { useContext, useEffect } from 'react';
import { UIState } from '../../UI';
import { logGooglePageHit } from '../../common/functions/logGooglePageHit';

export const About = () => {
   const uiState = useContext(UIState);

   useEffect(() => {
      if (uiState.showCanvas)
         uiState.setShowCanvas(false);
   });

   useEffect(() => logGooglePageHit('about'), []);

   return <>
      <Row>
         <Column>
            <h4 className={'marginBottom_8'}>What is Paint Map Studio?</h4>
            <Typography style={{fontSize: '0.9em'}}>
               This is a tool for matching colors in digital images against a palette derived from heavy-body acrylic paints.
            </Typography>
         </Column>
      </Row>
      <Row>
         <Column>
            <h4 className={'marginBottom_8'}>Who created this?</h4>
            <Typography style={{fontSize: '0.9em'}}>
               Paint Map Studio is the creation of Adam Nathaniel Davis.  To see all of his information and other works, you can
               check out his{` `}
               <a href={'https://adamdavis.link'}>full list of links here</a>.
            </Typography>
         </Column>
      </Row>
      <Row>
         <Column>
            <h4 className={'marginBottom_8'}>What technology does this use?</h4>
            <Typography style={{fontSize: '0.9em'}}>
               This site is built with React/JavaScript and hosted on AWS.  The UI controls come from Material UI.  The complete code can be found{` `}
               <a href={'https://github.com/bytebodger/color-map'}>in this GitHub repo</a>.  It uses modern React standards such as
               functional components and Hooks.  All of the color transformations are done solely in JavaScript.  There are no "backend"
               calculations.  Everything happens in your client (the browser).
            </Typography>
         </Column>
      </Row>
      <Row>
         <Column>
            <h4 className={'marginBottom_8'}>How does the logic for this application <i>work</i>?</h4>
            <Typography style={{fontSize: '0.9em'}}>
               Please check out the following articles:
               <br/><br/>
               <a href={'https://dev.to/bytebodger/converting-real-world-colors-to-a-digital-format-433c'}>
                  Converting Real-World Colors to a Digital Format
               </a>
               <br/><br/>
               <a href={'https://dev.to/bytebodger/loading-images-with-reactjavascript-3996'}>
                  Loading Images With React/JavaScript
               </a>
               <br/><br/>
               <a href={'https://dev.to/bytebodger/pixelating-images-in-reactjavascript-2ac7'}>
                  Pixelating Images With React/JavaScript
               </a>
               <br/><br/>
               <a href={'https://dev.to/bytebodger/determining-the-rgb-distance-between-two-colors-4n91'}>
                  Determining the RGB "Distance" Between Two Colors
               </a>
               <br/><br/>
               <a href={'https://dev.to/bytebodger/using-different-color-spaces-to-compare-colors-5agg'}>
                  Using Different Color Spaces to Compare Colors
               </a>
               <br/><br/>
               <a href={'https://dev.to/bytebodger/dithering-images-with-reactjavascript-och'}>
                  Dithering Images with React/JavaScript
               </a>
               <br/><br/>
               <a href={'https://dev.to/bytebodger/color-mixing-with-javascript-1llh'}>
                  Color Mixing With JavaScript
               </a>
               <br/><br/>
               <a href={'https://dev.to/bytebodger/using-virtual-color-mixing-to-extend-your-palette-in-reactjavascript-l41'}>
                  Using Virtual Color Mixing to Extend Your Palette in React/JavaScript
               </a>
               <br/><br/>
               <a href={'https://dev.to/bytebodger/reducing-color-depth-with-reactjavascript-4gg5'}>
                  Reducing Color Depth with React/JavaScript
               </a>
               <br/><br/>
               <a href={'https://dev.to/bytebodger/create-paint-by-numbers-from-digital-images-with-reactjavascript-2dc9'}>
                  Paint-by-Numbers From Digital Images With React/JavaScript
               </a>
            </Typography>
         </Column>
      </Row>
   </>
}
