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
  const {components,formData,onChange} = props;

  if(!components) return null;

  /** Mount input components */
  return (
    <React.Fragment>
      {Object.keys(components).map((nodeName, key) => (
        <div style={{padding: 6}} key={key}>
          {Component({
            node: components[nodeName], 
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

    state = { loading: false }


    componentDidMount(){
      const {fetchData,changeData,fetchParams,collection} = this.props;
      if(fetchData && typeof fetchData === 'function'){
        (fetchParams?fetchData(...fetchParams):fetchData())
          .then(res => changeData(res.data))
          .catch(() => changeData(initialData(collection)));
      }else{
        changeData(initialData(collection));
      }
    }


    // componentDidMount(){
    //   const {fetchData,changeData,fetchParams,components} = this.props;
    //   if(fetchData && typeof fetchData === 'function'){
    //     this.setState({loading: true});
    //     (fetchParams?fetchData(...fetchParams):fetchData())
    //       .then(res => { 
    //         this.setState({loading: false});
    //         changeData(res.data);
    //       })
    //       .catch(() => {
    //         this.setState({loading: false});
    //         changeData(createModel(components));
    //       });
    //   }else{
    //     changeData(createModel(components));
    //   }
    // }    

    componentWillUnmount(){
      const {changeData} = this.props;
      changeData({});
    }
    
    componentDidUpdate(nextProps){
      const {components} = this.props;
      if(nextProps.components){
        if(JSON.stringify(components) !== JSON.stringify(nextProps.components)){
          this.updateExternalValues();
        }
      }
    }
    
    /**
     * When an input is updated by a external source, send to the internal redux.
     */ 
    updateExternalValues(){
      const {components,changeField} = this.props;
      Object.keys(components).forEach(k => {
        if(components[k].props.value){
          changeField(k, components[k].props.value);
        }
      });
    }   
    
    /** onChange for fields */
    _onChange = (event) => {
      const {changeField} = this.props;
      this._checkDependecy(event);
      changeField(event.target.name, event.target.type==='checkbox'?event.target.checked:event.target.value);
    }

    /** Check if field has dependency */
    _checkDependecy = (event) => {
      const {target} = event;
      const {dependencies} = this.props;
      if(target.name && dependencies.length > 0){
        if(dependencies.filter(d => d === target.name)[0]){
          document.dispatchEvent(new CustomEvent(`${target.name}_change`, {detail: target.value}));
        }
      }
    }     

    render(){
      const {title,fields,controlOptions, ...others} = this.props;
      return (
        <form>
          <h6>{title}</h6>
          <Grid container>
            {fields.map((components, k) => ((
              <Grid item key={k}>
                <Container
                  onChange={this._onChange}
                  components={components} 
                  {...others}
                />
              </Grid>
            )))}
          </Grid>
          <ControlButtons 
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

  state = {
    dependencies: [],
    collection: {},
    fields: []
  }

  _checkRows = () => {
    const {components} = this.props;
    this.setState({fields: !Array.isArray(components)?[components]:components});
    this._mountDependecies();
  }

  _mountDependecies = () => {
    const {fields} = this.state;
    // dependency array
    if(fields){
      const collection = {};
      fields.forEach(it => {
        Object.keys(it).forEach(k => {
          collection[k] = it[k];
        })
      }); 
      // cache it
      this.setState({collection: collection});   
      const deps = Object.keys(collection).filter(key => collection[key].props.dependency);
      if(deps && deps.length > 0){
        const dependencies = deps.map(name => collection[name].props.dependency);
        this.setState({dependencies: dependencies});
      }
    }  
  }

  componentDidMount(){
    this._checkRows();
  }

  render(){
    const {components, ...others} = this.props;
    return (
      <Provider store={Store}>
        <FormContainer
          {...others} 
          {...this.state}
        />
      </Provider>
    )
  }
}

export default JsonForm;
