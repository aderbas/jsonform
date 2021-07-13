/**
* Create a form from JSON component data
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 09/05/2020
* 
*/

import React from "react"
import { Provider } from 'react-redux';
import { Store } from './store';
import {initialData,ControlButtons,Column,Row} from './util';
import {Grid} from '@material-ui/core';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeField,changeData} from './actions';

export {default as baseComponent} from './BaseComponent';

// REDUX ##
const mapStateToProps = store => ({formData: store.formState.formData});
const mapDispatchToProps = dispatch => bindActionCreators({changeField,changeData}, dispatch);
// ########

const CustomGrid = ({...props}) => {
  const {fields,...others} = props;

  return fields.map((f,ka) => {
    if(Array.isArray(f)){
      return <Row key={ka} fields={f} {...others} />
    }else{
      return <Column key={ka} field={f} {...others}  />
    }
  })
}

const ConditionalRender = ({...props}) => {
  const {id,name,title,controlOptions,loading, ...others} = props;
  return (
    <form id={id} name={name}>
      <h4>{title}</h4>
      <Grid container>
        <CustomGrid {...others} />
      </Grid>
      <ControlButtons 
        loading={loading}
        {...others} 
        {...controlOptions} />
    </form>    
  )
}

/**
 * Main render
 */
const FormContainer = connect(mapStateToProps, mapDispatchToProps)(

  class Content extends React.PureComponent {

    constructor(props){
      super(props);
      this.state = {
        loading: false, 
        dependencies: [],
        fields: props.components
          ? ( !Array.isArray(props.components)?[props.components]:props.components )
          : []
      }
    }

    componentDidMount(){
      this._mountDependecies();
      this._getDataForm();      
    }   

    componentWillUnmount(){
      const {changeData} = this.props;
      changeData({});
    }
    
    componentDidUpdate(nextProps){
      const {components} = this.props;
      if(nextProps.components){
        if(JSON.stringify(components) !== JSON.stringify(nextProps.components)){
          this._getDataForm();
          this.updateExternalValues();
        }
      }
    }
    
    /**
     * When an input is updated by a external source, send to the internal redux.
     */ 
    updateExternalValues(){
      const {changeField} = this.props;
      const {fields} = this.state;
      let collection = {};
      fields.forEach(it => collection = {...collection, ...it});      
      Object.keys(collection).forEach(k => {
        if(collection[k].props.value){
          changeField(k, collection[k].props.value);
        }
      });
    }
    
    /**
     * Get data for popule form if parent function exist
     */
    _getDataForm(){
      const {fetchData,changeData,fetchParams,model} = this.props;
      const {fields} = this.state;
      let collection = {};
      fields.forEach(it => collection = {...collection, ...it});
      if(fetchData && typeof fetchData === 'function'){
        this.setState({loading: true});
        (fetchParams?fetchData(...fetchParams):fetchData())
          .then(res => { 
            this.setState({loading: false});
            changeData(res.data);
          })
          .catch(() => {
            this.setState({loading: false});
            changeData(model?model:initialData(collection));
          });
      }else{
        changeData(model?model:initialData(collection));
      }
    }    
    
    /** 
     * onChange for fields 
     * @param {object} event
     */
    _onChange = (event) => {
      const {changeField,formChange} = this.props;
      //this._checkDependecy(event);
      const value = event.target.type==='checkbox'?event.target.checked:event.target.value;
      const {target: { name }} = event;
      changeField(name, value);
      // send to parent if exist handler
      if(typeof formChange === 'function'){
        const {formData} = this.props;
        formChange({...formData, [name]: value});
      }
    }

    /** 
     * Check if field has dependency 
     * @param {object} event
     */
    _checkDependecy = (event) => {
      const {target} = event;
      const {dependencies} = this.state;
      if(target.name && dependencies.length > 0){
        if(dependencies.filter(d => d === target.name)[0]){
          document.dispatchEvent(new CustomEvent(`${target.name}_change`, {detail: target.value}));
        }
      }
    }     

    /** 
     * Mount dependencies list 
     */
    _mountDependecies = () => {
      // const {fields} = this.state;
      // // dependency array
      // if(fields){
      //   const collection = [];
      //   const seeq = itens => {
      //     itens.forEach(it => Array.isArray(it)?seeq(it):collection.push(it));
      //   }
      //   seeq(fields);
      //   console.log(JSON.stringify(collection))
      //   if(collection && collection.length > 0){
      //     //const dependencies = collection.map(name => console.log(name));
      //     //console.log(dependencies)
      //     // this.setState({dependencies: dependencies});
      //   }
      // }    
    }    
    
    render(){
      return (
        <ConditionalRender 
          onChange={this._onChange}
          {...this.props}
          {...this.state}
        />
      );    
    }
  }

);

/**
 * Main class
 */
class JsonForm extends React.PureComponent {

  render(){
    return (
      <Provider store={Store}>
        <FormContainer
          {...this.props}
        />
      </Provider>
    )
  }
}

JsonForm.propTypes = {
  components: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
}

export default JsonForm;
