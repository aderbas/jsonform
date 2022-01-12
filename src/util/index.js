/**
 * Utils
 * @author Aderbal Nunes <aderbalnunes@gmail.com>
 * @since 28/10/2020
 */
import React from 'react';
import {Button,Box,Grid} from '@mui/material';
import Component from '../components';
import {ConfirmModal} from '../components/modal';
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
 * Confirm modal
 */
const UseConfirm = ({...props}) => {
  const {confirmSave,confirmCancel,options,...others} = props;

  const confirm = () => {
    if(typeof options.confirm === 'function'){
      options.confirm();
      props.onClose();
    }
  }

  return (Boolean(confirmSave) || Boolean(confirmCancel)) ? (
    <ConfirmModal 
      open={options.open}
      content={options.content}
      onConfirm={confirm}
      {...others}
    />
  ) : null
}

/**
 * Form control buttons
 * @param {any} props 
 */
export const ControlButtons = ({...props}) => {
  const [options, setOptions] = React.useState({
    type: 'save',
    open: false,
    content: props.confirmSave,
    confirm: () => props.onSave(props.formData),
  })
  const {onSave,onCancel,boxProps,saveText,cancelText,...others} = props;
  
  const _handlerClickSave = () => {
    const {formData,confirmSave} = props;
    if(typeof onSave === 'function'){
      if(Boolean(confirmSave)){
        return setOptions({
          type: 'save', confirm: () => onSave(formData), open: true, content: confirmSave
        })
      }
      // send data to parent component
      onSave(formData);
    }
  }

  const _handlerClickCancel = () => {
    const {confirmCancel} = props;
    if(typeof onCancel === 'function'){
      if(Boolean(confirmCancel)){
        return setOptions({
          type: 'cancel', confirm: onCancel, open: true, content: confirmCancel
        })
      }
      onCancel();
    }
  }

  const closeModal = () => setOptions({...options, open: !options.open})

  return (
    <Box p={1} {...boxProps}>
      <UseConfirm 
        onClose={closeModal}
        options={options}
        {...others} 
      />
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
 * Check rule
 */
const checkRule = rules => {
  if(!rules) return;
  const len = rules.length;
  let i=0,rule;
  for(;i<len;i++){
    rule = rules[i];
    if(!rule.hasOwnProperty('field')){
      throw new ReferenceError("Missing rule \"field\". Rule format: {field: string, condition: string, value: any }");
    }
    if(!rule.hasOwnProperty('condition') && !rule.hasOwnProperty('regex')){
      throw new ReferenceError("Mussing rule \"condition\". Rule format: {field: string, condition: string, value: any }");
    }
    if(!rule.hasOwnProperty('value') && !rule.hasOwnProperty('length') && !rule.hasOwnProperty('regex')){
      throw new ReferenceError("Missing rule \"value\". Rule format: {field: string, condition: string, value: any }");
    } 
    if(rule.hasOwnProperty('condition')){
      if(typeof rule.condition !== 'string'){
        throw new ReferenceError("Condition only accept string format: eq|ne|gt|lt|le|ge");
      }
      if(typeof rulesComparators[rule.condition] !== 'function'){
        throw new ReferenceError(`Wrong condition format: ${rule.condition}. Formats: eq|ne|gt|lt|le|ge`);
      }
    }
  }
}

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
        const depends = checkFlagDependency(collection[c]?.options)
        if(depends){
          pushDependency({of: depends, rule: collection[c]?.options?.depends.rules})
        }
      })
    }
  }
}

export const dispatchEvent = ({event,dependencies}) => {
  const {target: {name,type,checked}} = event;
  if(name && dependencies.length > 0){
    const value = (type==='checkbox')?Boolean(checked):event.target.value;
    const dependency = dependencies.filter(it => it.of === name)[0];
    if(dependency){
      document.dispatchEvent(new CustomEvent(`${name}_change`, {detail: {
        value: value,
        type: type,
        condition: dependency.rule
      }}));
    }
  }  
}

export const enabledInput = event => {
  switch(event.type){
    case 'password':
    case 'text':
    case 'date':
      return (event.value.length > 0)
    case "checkbox":
      return event.value;
    case "select-one":
      return parseInt(event.value) > 0
    default: return false;
  }
}

export const rulesComparators = {
  'eq': (a,b) => a === b,
  'ne': (a,b) => a !== b,
  'gt': (a,b) => a > b,
  'lt': (a,b) => a < b,
  'le': (a,b) => a <= b,
  'ge': (a,b) => a >= b
}

/**
 * Check flag dependency
 * @param options - Object
 */
export const checkFlagDependency = options => {
  if(typeof options === 'undefined') return options; // undefined
  if(typeof options.depends !== 'undefined'){
    if(typeof options.depends === 'string') return options.depends;
    if(typeof options.depends === 'object'){
      checkRule(options.depends?.rules);
      return options.depends?.rules[0] ? options.depends?.rules[0].field : undefined;
    }
  }

  return undefined;
}

/**
 * Toggle input using dependency rule
 */
export const toggleInput = (event) => {
  const {detail} = event;
  let enable = false;
  if(detail.condition){
    const rule = detail.condition[0];
    if(rule.hasOwnProperty('regex')){
      enable = (detail.value.match(rule.regex));
    }else{
      const compare = rulesComparators[rule.condition];
      if(typeof compare === 'function'){
        enable = (rule.hasOwnProperty('length')) 
          ? compare(detail.value.length, rule.length) 
          : compare(detail.value, rule.value)
      }
    }
  }else{
    enable = enabledInput(event.detail);
  }

  return enable;
}

/**
 * Enable select using dependency rule
 */
export const toggleSelect = async(event,options) => {
  const {detail} = event;
  try{
    let enable = false;
    if(detail.condition){
      const rule = detail.condition[0];
      if(rule.hasOwnProperty('regex')){
        enable = (detail.value.match(rule.regex));
      }else{
        const compare = rulesComparators[rule.condition];
        if(typeof compare === 'function'){
          enable = compare(detail.value, `${rule.value}`)
        }
      }
    }else{
      enable = enabledInput(event.detail);
    }
    if(typeof options !== 'function'){
      return new window.Promise(resolve => resolve({data: options, disabled: !(enable)}))
    }
    // check options data
    if(enable){
      if(typeof options === 'function'){
        try{
          const data = await options(detail?.value);
          return new window.Promise(resolve => resolve({data: data, disabled: false}))
        }catch(err){
          throw err;
        }
      }else{
        return new window.Promise(resolve => resolve({data: options, disabled: enable}))
      } 
    }

    return new window.Promise(resolve => resolve({data: [], disabled: true}))
  }catch(err){
    return new window.Promise(resolve => resolve({data: [], disabled: true}))
  }
}