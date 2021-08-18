/**
 * Utils
 * @author Aderbal Nunes <aderbalnunes@gmail.com>
 * @since 28/10/2020
 */
import React from 'react';
import {Button,Box,Grid} from '@material-ui/core';
import Component from '../components';
import * as Elements from '../elements';

/**
 * Default component list
 * @type {Objetc}
 */
export const componentList = {
  text        : Elements.TextInput,
  info        : Elements.Info,
  select      : Elements.InputSelect,
  multiselect : Elements.MultiSelect,
  divider     : Elements.Separator,
  switch      : Elements.InputSwitch,
  upload      : Elements.UploadBox,
  radiogroup  : Elements.InputRadioGroup,
};

/**
 * Get default value for model
 * @param {Object} node
 */
const defaultValue = node => {
  const {props} = node;
  if(!props) return '';
  if(props.valueType){
    switch(props.valueType){
      case 'array': return [];
      case 'integer': return 0;
      case 'object': return {};
      case 'string': return '';
      case 'bool': return false;
      case 'date': return new Date();
      default: return '';
    }
  }else{
    switch(node.component){
      case componentList.info:
      case componentList.text: return '';
      case componentList.select: return -1;
      case componentList.multiselect: return [];
      case componentList.switch: return false;
      default: return '';
    }
  };
}

/**
 * Mount inital data to form
 * @param {array} fields 
 */
export const initialData = (fields) => {
  let data = {};
  Object.keys(fields).forEach(k => {  
    if(fields[k].props){
      if(fields[k]?.options?.skipFromModel) return;
      data[k] = fields[k]?.props.value?fields[k].props.value:defaultValue(fields[k])
    }
  });
  return data;
}

/**
 * Form control buttons
 * @param {any} props 
 */
export const ControlButtons = ({...props}) => {
  const {onSave,onCancel,boxProps,saveText,cancelText} = props;
  
  const _handlerClickSave = () => {
    const {formData} = props;
    if(typeof onSave === 'function'){
      // send data to parent component
      onSave(formData);
    }
  }

  const _handlerClickCancel = () => {
    if(typeof onCancel === 'function'){
      onCancel();
    }    
  }

  return (
    <Box p={1} {...boxProps}>
      {onCancel
        ? <Button onClick={_handlerClickCancel}>{cancelText ?? 'Cancel'}</Button>
        : null
      }
      {onSave
        ?<Button onClick={_handlerClickSave} variant="contained" color="primary">{saveText ?? 'Save'}</Button>
        : null
      }
    </Box>
  )
}

/**
 * Container
 * @param {any} props
 */
export const Container = ({...props}) => {
  const {field,formData,onChange,spacing} = props;
  /** Mount input components */
  return (
    <React.Fragment>
      {Object.keys(field).map((nodeName, key) => (
        <Box mt={spacing??2} key={key}>
          {Component({
            node: field[nodeName], 
            name: nodeName, 
            value: formData[nodeName],
            handlerChange: onChange,
          })}
        </Box>        
      ))}
    </React.Fragment>
  )
}

/**
 * Mount column 
 * @param {Object} props
 * @returns Element
 */
export const Column = ({field,...others}) => (
  <Grid item xs={12} lg md sm>
    <Container
      field={field} 
      {...others}
    />
  </Grid>
)

/**
 * Mount row
 * @param {object} props
 * @return Element
 */
export const Row = ({fields, ...others}) => (
  <Grid container>
    {fields.map((field, k) => ((
      <Column key={k} field={field} {...others} />
    )))}    
  </Grid>
)

/**
 * Check if any field of form depends from a another field
 * @param {Object}
 */
export const seeqDependencies = ({fields, pushDependency}) => {
  // dependency array
  if(fields){
    let collection = {};
    const seeq = list => {
      if(list.length > 0){
        list.forEach(it => Array.isArray(it)?seeq(it):collection = {...collection, ...it})
      }
    }
    seeq(fields);
    const len = Object.keys(collection).length;
    if(len > 0){
      Object.keys(collection).forEach(c => {
        if((collection[c]?.options?.depends)){
          pushDependency(collection[c]?.options?.depends)
        }
      })
    }
  }
}

export const dispatchEvent = ({event,dependencies}) => {
  const {target: {name,type,checked}} = event;
  if(name && dependencies.length > 0){
    const value = (type==='checkbox')?Boolean(checked):event.target.value;
    if(dependencies.filter(d => d === name)[0]){
      document.dispatchEvent(new CustomEvent(`${name}_change`, {detail: {
        value: value,
        type: type
      }}));
    }
  }  
}

export const enabledInput = event => {
  switch(event.type){
    case 'password':
    case 'text':
    case 'date':
      return (event.value.length <= 0)
    case "checkbox":
      return !(event.value);
    case "select-one":
      return (parseInt(event.value) < 0);
    default: return false;
  }
}