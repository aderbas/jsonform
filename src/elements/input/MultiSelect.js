/**
 * Multi select
 * @author: Aderbal Nunes <aderbal@zenitebr.com
 * @since: 27/05/2021
 *
 * Copyright 2021 Zenite Tecnologia.
 */
import React from 'react';
import {Checkbox,Select,FormControl,MenuItem,InputLabel,Input,ListItemText} from '@material-ui/core';
import PropTypes from 'prop-types';
import baseComponent from '../../BaseComponent';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/**
 * Conditional Render
 * @param {object} props 
 * @returns Element
 */
const ConditionalRender = ({...props}) => {
  const {id,value,label,width,internalOptions,selectChange,getLabel,disabled} = props;

  return (
    <FormControl style={{ width }}>
      <InputLabel>{label}</InputLabel>
      <Select
        id={id}
        name={id}
        onChange={selectChange}
        input={<Input />}
        MenuProps={MenuProps}
        multiple
        renderValue={(selected) => getLabel(selected)}
        value={value||[]}
        disabled={disabled}
      >
        {internalOptions.map((v,k) => (
          <MenuItem key={k} value={v.value}>
            <Checkbox checked={(value.indexOf(v.value) > -1)} />
            <ListItemText primary={v.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>    
  )
}

/**
 * Main class
 */
class MultiSelect extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      internalOptions: [],
      disabled: Boolean(props.dependency)
    }
  }

  /**
   * Handler select change
   * @param {object} target 
   */
  _handleChange = ({ target }) => {
    const {value} = target;
    const {onChange,id} = this.props;

    if(typeof onChange === 'function'){
      onChange({target: {name: id, value: value}});
    }
  }

  /**
   * Mount select string for selected itens
   * @param {array} selected 
   * @returns string
   */
  _getLabel = (selected) => {
    const {internalOptions} = this.state;
    return selected.map(s => {
      return internalOptions.filter(o => o.value === s)[0]?.label || s
    }).join(', ');
  }

  /**
   * Set Options 
   */
  async setOptions(param){
    try{
      const {options} = this.props;
      if(typeof options === 'function'){
        const data = await options(param);
        this.setState({internalOptions: data, disabled: false});
      }else{
        this.setState({internalOptions: options, disabled: false});
      }
    }catch(err){
      this.setState({internalOptions: []});
    }
  }

  componentDidMount(){
    const {dependency} = this.props;
    if(dependency){
      document.addEventListener(`${dependency}_change`, this.dependencyChanged);
    }
    this.setOptions();
  }

  componentWillUnmount(){
    const {dependency} = this.props;
    this._isMounted = false;
    if(dependency){
      // remove listener
      document.removeEventListener(`${dependency}_change`, this.dependencyChanged);
    }
  }

  dependencyChanged = async(event) => {
    const {options} = this.props;
    const {detail} = event;
    if(typeof detail?.value === 'boolean'){
      this.setState({disabled: !(detail?.value)})
    }
    if(detail && typeof options === 'function'){
      this.setOptions(detail?.value);
    }
  }  

  render() {
    return (
      <ConditionalRender 
        selectChange={this._handleChange}
        getLabel={this._getLabel}
        {...this.state}
        {...this.props} 
      />
    )
  }
}

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  width: PropTypes.number
}

MultiSelect.defaultProps = {
  value: [],
  width: 150
}

export default baseComponent()(MultiSelect)