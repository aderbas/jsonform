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
  const {components,formData,changeField} = props;

  /** onChange for fields */
  const _onChange = (event) => {
    changeField(event.target.name, event.target.value);
  }


  /** Mount input components */
  return (
    <React.Fragment>
      {Object.keys(components).map((nodeName, key) => (
        <div style={{padding: 6}} key={key}>
          {Component({
            node: components[nodeName], 
            name: nodeName, 
            value: formData[nodeName],
            handlerChange: _onChange
          })}
        </div>        
      ))}
    </React.Fragment>
  )
}

/**
 * Main render
 */
const FlowContent = connect(mapStateToProps, mapDispatchToProps)(

  class Content extends React.PureComponent {

    componentDidMount(){
      const {fetchData,changeData,fetchParams,components} = this.props;
      if(fetchData && typeof fetchData === 'function'){
        (fetchParams?fetchData(...fetchParams):fetchData())
          .then(res => changeData(res.data))
          .catch(() => changeData(initialData(components)));
      }else{
        changeData(initialData(components));
      }
    }

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

    render(){
      const {title,...others} = this.props;
      return (
        <form>
          <h6>{title}</h6>
          <div>
            <Container {...others} />
          </div>
          <ControlButtons {...others} />
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
        <FlowContent
          {...this.props} 
        />
      </Provider>
    )
  }
}

export default JsonForm;
