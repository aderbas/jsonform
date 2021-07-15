/**
 * Utils
 * @author Aderbal Nunes <aderbalnunes@gmail.com>
 * @since 28/10/2020
 */
import React from 'react';
import {Button,Box,Grid} from '@material-ui/core';
import Component from '../components';

/**
 * Get default value for model
 * @param {Object} props
 */
const defaultValue = props => {
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
  }else return '';
}

/**
 * Mount inital data to form
 * @param {array} fields 
 */
export const initialData = (fields) => {
  let data = {};
  Object.keys(fields).forEach(k => {  
    if(fields[k].props){
      if(fields[k].options && fields[k].options.skipFromModel) return;
      data[k] = fields[k].props.value?fields[k].props.value:defaultValue(fields[k].props)
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
  const {target: {name,value,type}} = event;
  if(name && dependencies.length > 0){
    if(dependencies.filter(d => d === name)[0]){
      document.dispatchEvent(new CustomEvent(`${name}_change`, {detail: {
        value: value,
        type: type
      }}));
    }
  }  
}

export const enabledInput = event => {
  if(event.value){
    switch(event.type){
      case 'password':
      case 'text':
      case 'date':
        return (event.value.length <= 0)
      case 'checkbox':
        return event.value;
      default: return false;
    }
  }
  return false;
}