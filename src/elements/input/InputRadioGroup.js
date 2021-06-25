/**
 * Input RadioGroup
 * @author: Aderbal Nunes <aderbalnunes@gmail.com>
 * @since: 22/06/2021
 *
 * Copyright 2021.
 */
import React from 'react';
import {FormLabel,RadioGroup,FormControlLabel,Radio} from '@material-ui/core';
import PropTypes from 'prop-types';

const RenderRadios = ({ options }) => {
  return options && options.map((opt,k) => (
    <FormControlLabel 
      key={k}
      value={opt.value}
      control={<Radio />}
      label={opt.label}
    />
  ))
}

class InputRadioGroup extends React.PureComponent{
  
  state = {
    internalOptions: []
  }

  /**
   * Set Options 
   */
  async setOptions(){
    try{
      const {options} = this.props;
      if(typeof options === 'function'){
        const data = await options();
        this.setState({internalOptions: data});
      }else{
        this.setState({internalOptions: options});
      }
    }catch(err){
      this.setState({internalOptions: []});
    }
  }

  componentDidMount(){
    this.setOptions();
  }

  render(){
    const {internalOptions} = this.state;
    const {id,value,label,onChange} = this.props;
    return (
      <React.Fragment>
        <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup name={id} value={`${value}`} onChange={onChange}>
          <RenderRadios options={internalOptions} />
        </RadioGroup>
      </React.Fragment>
    )
  }
}

InputRadioGroup.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.any
}

export default InputRadioGroup;