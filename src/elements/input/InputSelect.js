/**
 * Custom Input list for flow
 * @author: Aderbal Nunes <aderbalnunes@gmail.com>
 * @since: 24/06/2020
 */
import React from 'react';
import {InputLabel,Select} from '@material-ui/core';
import PropTypes from 'prop-types';
import baseComponent from '../../BaseComponent';

// default value
const defaultOption = [{value: -1, label: 'Choice'}];

class InputSelect extends React.PureComponent {

  state = {
    localOptions: [{value: -1, label: 'Loading...'}]
  }

  async setOptions(){
    const {options,dependency} = this.props;
    if(typeof options === 'function' && this._isMounted){
      if(!dependency){
        try{
          const data = await options();
          if(this._isMounted){
            this.setState({localOptions: [...defaultOption, ...data]});
          }
        }catch(err){
          this.setState(state => ({localOptions: [...state.localOptions]}));
        }
      }else{
        this.setState({localOptions: [{value: -1, label: 'Escolha'}]});
        document.addEventListener(`${dependency}_change`, this.dependencyChanged);
      }
    }else{
      this.setState(state => ({...state, localOptions: [...state.localOptions, ...options]}))
    }
  }

  componentDidMount(){
    this._isMounted = true;
    this.setOptions();
  }

  dependencyChanged = async(event) => {
    const {options} = this.props;
    const {detail} = event;
    if(detail && typeof options === 'function'){
      try{
        this.setState({localOptions: [{value: -1, label: 'Loading...'}]});
        const data = await options(detail);
        if(this._isMounted){
          this.setState({localOptions: [...defaultOption, ...data]});
        }        
      }catch(err){
        this.setState({localOptions: defaultOption});
      }    
    }
  }

  componentWillUnmount(){
    const {dependency} = this.props;
    this._isMounted = false;
    if(dependency){
      // remove listener
      document.removeEventListener(`${dependency}_change`, this.dependencyChanged);
    }
  }

  render() {
    const {localOptions} = this.state;
    const {value,id,onChange,label,width,required} = this.props;
    return (
      <React.Fragment>
        <InputLabel htmlFor={id}>{`${label} ${required?'*':''}`}</InputLabel>
        <Select
          native
          id={id}
          name={id}
          value={value}
          inputProps={{ 
            'aria-label': id,
            style: width?{width: width}:null
          }}
          onChange={onChange}
        >
          {localOptions.map((opt, key) => (
            <option key={key} value={opt.value?opt.value:opt.label}>
              {opt.label}
            </option>
          ))}
        </Select>
      </React.Fragment>
    )
  }
}

InputSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
}

InputSelect.defaultProps = {
  width: 200
}

export default baseComponent(null)(InputSelect);