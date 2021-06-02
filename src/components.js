/**
* Components collection and function to render Components
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 12/05/2020
*
*/
import React from 'react';
import * as Elements from './elements';

// list
const Components = {
  text    : Elements.TextInput,
  select  : Elements.InputSelect,
  divider : Elements.Separator,
  switch  : Elements.InputSwitch,
  upload  : Elements.UploadBox,
};

// create component by json node
export default ({...props}) => {
  const {node, name, value, handlerChange} = props;
  if(!node.props) node.props = {};
  // get node component
  const _props = {
    ...node.props,
    id: name,
    value: value?value:'',
    onChange: handlerChange
  }
  if (typeof node.component !== 'undefined'){
    return React.createElement(
      (typeof node.component === 'string')
        ? Components[node.component]
        : node.component, _props
    );
  }

  return React.createElement(
    () => <div>{`The component ${node.component} has not been created yet.`}</div>,
    {key: 'fail-component-created'}
  )
};
