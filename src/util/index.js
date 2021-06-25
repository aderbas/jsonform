/**
 * Utils
 * @author Aderbal Nunes <aderbalnunes@gmail.com>
 * @since 28/10/2020
 */
import React from 'react';
import {Button,Box} from '@material-ui/core';

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
      {onCancel?<Button onClick={_handlerClickCancel}>{cancelText ?? 'Cancel'}</Button>:null}
      {onSave?<Button onClick={_handlerClickSave} variant="contained" color="primary">{saveText ?? 'Save'}</Button>:null}
    </Box>
  )
}
