/**
* Doc..
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 21/12/2020
*
*/

import React from "react"
import PropTypes from 'prop-types';
import baseComponent from '../../BaseComponent';
import {TextField,FormControl,InputAdornment} from '@material-ui/core';

class TextInput extends React.PureComponent {
  state = {
    error: false
  }

  _validate = (e) => {
    const {validation,required} = this.props;
    // clear error if field is blank e is not required
    if(e.target.value === '' && !required){
      this.setState({error: false});
      return;
    }
    if(typeof validation === 'object'){
      // regex
      this.setState({error: !validation.test(e.target.value)});
      return;
    }
    // check if field is required
    this.setState({error: (e.target.value === '' && required)});
  }

  render(){
    const {id, dbClick, endAdornment, startAdornment, validation, ...rest} = this.props;
    const {error} = this.state;
    return (
      <FormControl>
        <TextField
          id={id}
          name={id}
          error={error}
          variant="outlined"
          size="small"
          onBlur={this._validate}
          InputProps={{
            endAdornment: endAdornment?<InputAdornment>{endAdornment}</InputAdornment>:null,
            startAdornment: startAdornment?<InputAdornment>{startAdornment}</InputAdornment>:null
          }}
          {...rest} 
        />
      </FormControl>
    )
  }
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
}

export default baseComponent(null)(TextInput);