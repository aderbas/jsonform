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
import baseComponent from '../../BaseComponent';
import {toggleSelect}  from '../../util';

const RenderRadios = ({ options, disabled }) => {
  return options && options.length > 0 && options.map((opt,k) => (
    <FormControlLabel 
      key={k}
      value={opt.value}
      control={<Radio disabled={disabled} />}
      label={opt.label}
    />
  ))
}

class InputRadioGroup extends React.PureComponent{
  
  constructor(props){
    super(props)
    this.state = {
      localOptions: [],
      disabled: Boolean(props.dependency)
    }
  }


  /**
   * Set Options 
   */
  async setOptions(){
    const {options,dependency} = this.props;
    if(!dependency){
      if(typeof options === 'function'){
        try{
          const data = await options();
          this.setState({localOptions: data});
        }catch(err){
          this.setState({localOptions: []});
        }
      }else{
        this.setState({localOptions: options});
      }
    }else{
      document.addEventListener(`${dependency}_change`, this.dependencyChanged);
      this.setState({localOptions: []});
    }    
  }

  componentDidMount(){
    this.setOptions();
  }

  dependencyChanged = async(event) => {
    const {options} = this.props;
    const applyRule = await toggleSelect(event,options);
    console.log(applyRule)
    this.setState({
      localOptions: applyRule.data, 
      disabled: applyRule.disabled
    });
  }

  componentWillUnmount(){
    const {dependency} = this.props;
    this._isMounted = false;
    if(dependency){
      // remove listener
      document.removeEventListener(`${dependency}_change`, this.dependencyChanged);
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.value === '' && this.props.value !== ''){
      const {onChange, id} = this.props;
      onChange({target: {name: id, value: this.props.value}});
    }
  }

  render(){
    const {localOptions,disabled} = this.state;
    const {id,value,label,onChange} = this.props;
    return (
      <React.Fragment>
        <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup name={id} value={`${value}`} onChange={onChange} >
          <RenderRadios options={localOptions} disabled={disabled} />
        </RadioGroup>
      </React.Fragment>
    )
  }
}

InputRadioGroup.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.any
}

export default baseComponent()(InputRadioGroup)