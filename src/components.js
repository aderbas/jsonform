/**
* Components collection and function to render Components
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 12/05/2020
*
*/
import React from 'react';
import { componentList } from './util';

/**
 * Component fail
 */
const failComponent = () => React.createElement(
  () => <div>{`Error creating component. Or does not exist.`}</div>,
  {key: 'fail-component-created'}
)

/**
 * create component by json node
 */
export default ({...props}) => {
  const {node, name, value, handlerChange} = props;
  if(!node.props) node.props = {};
  
  const _props = {
    ...node.props,
    id: name,
    value: value?value:'',
    onChange: handlerChange,
    dependency: node?.options?.depends
  }
  if(typeof node.component !== 'undefined'){

    // check node component
    if(typeof node.component === 'string'){
      const _component = componentList[node.component];
      if(!_component) return failComponent();

      return React.createElement(_component, _props);
    }

    return React.createElement(node.component, _props);
  }

  return failComponent();
};
