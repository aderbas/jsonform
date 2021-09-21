/**
* Create a form from JSON component data
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 09/05/2020
* 
*/
import React from "react"
import { Provider } from 'react-redux';
import { Store } from './store';
import {initialData,ControlButtons,Column,Row,seeqDependencies,dispatchEvent} from './util';
import {Grid} from '@material-ui/core';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeField,changeData,pushDependency} from './actions';

export {default as baseComponent} from './BaseComponent';

// REDUX ##
const mapStateToProps = store => ({
  formData: store.formState.formData, 
  dependencies: store.globalState.dependencies
});
const mapDispatchToProps = dispatch => bindActionCreators({changeField,changeData,pushDependency}, dispatch);
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
          this._updateExternalValues();
        }
      }
    }
    
    /**
     * When an input is updated by a external source, send to the internal redux.
     */ 
    _updateExternalValues(){
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
      const {fetchData,changeData,fetchParams,model,...others} = this.props;
      const {fields} = this.state;
      let collection = {};
      fields.forEach(it => collection = {...collection, ...it});
      if(fetchData && typeof fetchData === 'function'){
        this.setState({loading: true});
        (fetchParams?fetchData(...fetchParams):fetchData())
          .then(res => { 
            if(res && typeof res !== 'undefined'){
              const {fetchDataHandler} = others;
              this.setState({loading: false});
              changeData(res.data || res);
              if(typeof fetchDataHandler === 'function'){
                fetchDataHandler(res);
              }
            }
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
      this._checkDependecy(event);
      // if checkbox, cast the value of 'checked' to string to fix componentDidUpdate() that received 
      // an empty string instead of an object when this value is false
      const value = (event.target.type==='checkbox')?`${event.target.checked}`:event.target.value;
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
      const {dependencies} = this.props;
      dispatchEvent({event, dependencies});
    }     

    /** 
     * Mount dependencies list 
     */
    _mountDependecies = () => {
      const {fields} = this.state;
      const {pushDependency} = this.props;
      seeqDependencies({fields, pushDependency});
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