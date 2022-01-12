/**
* Input text Field
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 21/12/2020
*/

import React from "react"
import PropTypes from 'prop-types';
import baseComponent from '../../BaseComponent';
import {toggleInput} from '../../util';
import {TextField,InputAdornment} from '@mui/material';
import {withStyles} from '@mui/styles';

const ResponsiveTextField = withStyles(({
  root: {
    '@media (max-width: 600px)': {
      width: '100%'
    }
  }
}))(TextField)

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
    this.setState({disabled: !toggleInput(event)});
  }

  componentDidUpdate(prevProps){
    if(prevProps.value === '' && this.props.value !== ''){
      const {onChange, id} = this.props;
      onChange({target: {name: id, value: this.props.value}});
    }
  }

  render(){
    const {id,dbClick,endAdornment,startAdornment,validation,dispatch, ...rest} = this.props;
    const {error,disabled} = this.state;
    return (
      <ResponsiveTextField
        id={id}
        name={id}
        error={error}
        variant="outlined"
        size="small"
        onBlur={this._validate}
        InputProps={{
          endAdornment  : endAdornment?<InputAdornment>{endAdornment}</InputAdornment>:null,
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