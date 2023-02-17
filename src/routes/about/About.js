import { Row } from '@toolz/material-ui/dist/components/Row';
import { Column } from '@toolz/material-ui/dist/components/Column';
import Typography from '@mui/material/Typography';
import './css/about.css';
import '../css/baseProperties.css';

export const About = () => {
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
   </>
}
