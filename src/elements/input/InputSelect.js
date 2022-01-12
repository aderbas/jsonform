/**
 * Custom Input list for flow
 * @author: Aderbal Nunes <aderbalnunes@gmail.com>
 * @since: 24/06/2020
 */
import React from 'react';
import {InputLabel,Select,MenuItem,FormControl} from '@mui/material';
import PropTypes from 'prop-types';
import baseComponent from '../../BaseComponent';
import {toggleSelect} from '../../util';

const Option = ({value, label}) => (
  <option value={value}>
    {label}
  </option>
)

class InputSelect extends React.PureComponent {

  constructor(props){
    super(props)
    this.state = {
      localOptions: [{
        value: -1,
        label: props.hint ?? ''
      }],
      disabled: Boolean(props.dependency)
    }
    this.defaultOption = [{value: -1, label: props.hint ?? ''}]
  }

  async setOptions(){
    const {options,dependency} = this.props;
    if(!dependency){
      if(typeof options === 'function'){
        try{
          const data = await options();
          if(this._isMounted){
            this.setState({localOptions: [...this.defaultOption, ...data]});
          }
        }catch(err){
          this.setState(state => ({localOptions: [...this.defaultOption]}));
        }
      }else{
        this.setState({localOptions: [...this.defaultOption, ...options]});
      }
    }else{
      document.addEventListener(`${dependency}_change`, this.dependencyChanged);
      this.setState({
        localOptions: (typeof options === 'function')?this.defaultOption:[...this.defaultOption, ...options]
      });
    }  
  }

  componentDidMount(){
    this._isMounted = true;
    this.setOptions();
  }

  dependencyChanged = async(event) => {
    const {options} = this.props;
    const applyRule = await toggleSelect(event,options);
    this.setState({
      localOptions: [...this.defaultOption, ...applyRule.data], 
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
      onChange({target: {name: id, value: this.props.value, type: 'select-one'}});
    }
  }

  render() {
    const {localOptions,disabled} = this.state;
    const {value,id,onChange,label,width,required} = this.props;
    return (
      <FormControl sx={{ minWidth: width }}>
        <InputLabel id={id}>{`${label} ${required?'*':''}`}</InputLabel>
        <Select
          id={id}
          name={id}
          value={value}
          label={`${label} ${required?'*':''}`}
          inputProps={{ 
            'aria-label': id,
          }}
          disabled={disabled}
          onChange={onChange}
        >
          {localOptions.map((opt, key) => (
            <MenuItem key={key} value={opt.value ?? opt.label}>{opt.label ?? '--'}</MenuItem>
          ))}
        </Select>
      </FormControl>
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

export default baseComponent()(InputSelect);