/**
 * Base component to inject shared props in component 
 * @author: Aderbal Nunes <aderbalnunes@gmail.com>
 * @since: 09/05/2020
 * 
 */
import React from 'react';
import ResponsiveControl from './elements/ResponsiveControl';
import {connect} from 'react-redux';


// REDUX ##
const mapStateToProps = store => ({formdata: store.formState.formData});
// ########

const baseComponent = () => (Component) => {

  if(Component === undefined){
    throw new Error(
      [
        'You are calling baseComponent()(Component) with an undefined component.',
        'You may have forgotten to import it.',
      ].join('\n')
    );
  }

  const ConnectedComponent = connect(mapStateToProps, null)(Component);

  const BaseComponent = React.forwardRef( (props, ref) => {
    const _props = {
      ...props,
    }

    return (
      <ResponsiveControl>
        <ConnectedComponent ref={ref} {..._props} />
      </ResponsiveControl>
    );
  });

  return BaseComponent;
}


export default baseComponent;