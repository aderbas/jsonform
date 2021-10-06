/**
 * Responsive FormControl
 * @author: Aderbal Nunes <aderbalnunes@gmail.com>
 * @since: 21/06/2021
 *
 * Copyright 2021.
 */
import {withStyles} from '@material-ui/styles';
import FormControl from '@material-ui/core/FormControl';

const ResponsiveControl = withStyles(({
  root: {
    display: 'block',
    margin: 4, 
    // '@media (max-width: 600px)': {
    // }
  }
}))(FormControl)

export default ResponsiveControl;