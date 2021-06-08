/**
* Create a form from JSON component data
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 09/05/2020
* 
*/

import React from "react"
import Component from './components';
import { Provider } from 'react-redux';
import { Store } from './store';
import {initialData,ControlButtons} from './util';
import {Grid} from '@material-ui/core';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeField,changeData} from './actions';


// REDUX ##
const mapStateToProps = store => ({formData: store.formState.formData});
const mapDispatchToProps = dispatch => bindActionCreators({changeField,changeData}, dispatch);
// ########

/**
 * Container
 * @param {any} props
 */
const Container = ({...props}) => {
  const {field,formData,onChange} = props;

  if(!field) return null;

  /** Mount input components */
  return (
    <React.Fragment>
      {Object.keys(field).map((nodeName, key) => (
        <div style={{padding: 6}} key={key}>
          {Component({
            node: field[nodeName], 
            name: nodeName, 
            value: formData[nodeName],
            handlerChange: onChange
          })}
        </div>        
      ))}
    </React.Fragment>
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
        fields: !Array.isArray(props.components)?[props.components]:props.components
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
    
    _getDataForm(){
      const {fetchData,changeData,fetchParams} = this.props;
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
            changeData(initialData(collection));
          });
      }else{
        changeData(initialData(collection));
      }
    }    
    
    /** onChange for fields */
    _onChange = (event) => {
      const {changeField,formChange} = this.props;
      this._checkDependecy(event);
      const value = event.target.type==='checkbox'?event.target.checked:event.target.value;
      const {target: { name }} = event;
      changeField(name, value);
      // send to parent if exist handler
      if(typeof formChange === 'function'){
        const {formData} = this.props;
        formChange({...formData, [name]: value});
      }
    }

    /** Check if field has dependency */
    _checkDependecy = (event) => {
      const {target} = event;
      const {dependencies} = this.state;
      if(target.name && dependencies.length > 0){
        if(dependencies.filter(d => d === target.name)[0]){
          document.dispatchEvent(new CustomEvent(`${target.name}_change`, {detail: target.value}));
        }
      }
    }     

    /** Mount dependencies list */
    _mountDependecies = () => {
      const {fields} = this.props;
      // dependency array
      if(fields){
        let collection = {};
        fields.forEach(it => collection = {...collection, ...it});
        const deps = Object.keys(collection).filter(key => collection[key].props.dependency);
        if(deps && deps.length > 0){
          const dependencies = deps.map(name => collection[name].props.dependency);
          this.setState({dependencies: dependencies});
        }
      }    
    }    
    
    render(){
      const {title,controlOptions, ...others} = this.props;
      const {loading,fields} = this.state;
      return (
        <form>
          <h6>{title}</h6>
          <Grid container>
            {fields.map((row, k) => ((
              <Grid item key={k} xs={12} lg md sm>
                <Container
                  onChange={this._onChange}
                  field={row} 
                  {...others}
                />
              </Grid>
            )))}
          </Grid>
          <ControlButtons 
            loading={loading}
            {...others} 
            {...controlOptions} />
        </form>
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

export default JsonForm;
