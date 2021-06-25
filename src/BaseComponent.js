/**
 * Base component to inject shared props in component 
 * @author: Aderbal Nunes <aderbalnunes@gmail.com>
 * @since: 09/05/2020
 * 
 */
import React from 'react';
import ResponsiveControl from './elements/ResponsiveControl';

const initialOptions = {
  padding: {
    paddingTop: 1, 
    paddingBottom: 1
  }
};

const baseComponent = (options = initialOptions) => (Component) => {

  if(Component === undefined){
    throw new Error(
      [
        'You are calling baseComponent(options)(Component) with an undefined component.',
        'You may have forgotten to import it.',
      ].join('\n')
    );
  }

  const BaseComponent = React.forwardRef( (props, ref) => {
    const _props = {
      ...props,
    }

    return (
      <ResponsiveControl>
        <Component {..._props} />
      </ResponsiveControl>
    );
  });

  return BaseComponent;
}


export default baseComponent;