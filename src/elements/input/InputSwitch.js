/**
 * Input Switch
 * @author: Aderbal Nunes <aderbalnunes@gmail.com>
 * @since: 24/06/2020
 */
import React from "react"
import PropTypes from 'prop-types';
import baseComponent from '../../BaseComponent';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class InputSwitch extends React.PureComponent {

  render(){
    const {id, value, label, ...rest} = this.props;
    return (
      <FormGroup row>
        <FormControlLabel
          label={label}
          control={
            <Switch 
              id={id}
              name={id}
              checked={Boolean(value)} 
              {...rest}
            />
          }
        />        
      </FormGroup>
    )
  }
}

InputSwitch.propTypes = {
  label: PropTypes.string.isRequired,
}

export default baseComponent(null)(InputSwitch);
