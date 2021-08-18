/**
* Input text Field
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 21/12/2020
*/

import React from "react"
import PropTypes from 'prop-types';
import baseComponent from '../../BaseComponent';
import {enabledInput} from '../../util';
import {TextField,InputAdornment} from '@material-ui/core';

class TextInput extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      disabled: Boolean(props.dependency),
    }
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

  componentDidMount(){
    const {dependency} = this.props;
    if(dependency){
      document.addEventListener(`${dependency}_change`, this.dependencyChanged.bind(this));
    }
  }

  componentWillUnmount(){
    const {dependency} = this.props;
    if(dependency){
      // remove listener
      document.removeEventListener(`${dependency}_change`, this.dependencyChanged);
    }    
  }

  dependencyChanged(event){
    const {detail} = event;
    this.setState({disabled: enabledInput(detail)});
  }

  render(){
    const {id,dbClick,endAdornment,startAdornment,validation,dispatch, ...rest} = this.props;
    const {error,disabled} = this.state;
    return (
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
        disabled={disabled}
        {...rest}
      />
    )
  }
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
}

export default baseComponent()(TextInput);