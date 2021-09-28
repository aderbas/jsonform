/**
 * Custom Input list for flow
 * @author: Aderbal Nunes <aderbalnunes@gmail.com>
 * @since: 24/06/2020
 */
import React from 'react';
import {InputLabel,Select} from '@material-ui/core';
import PropTypes from 'prop-types';
import baseComponent from '../../BaseComponent';
import {toggleSelect} from '../../util';
import {withStyles} from '@material-ui/styles';

const Option = ({value, label}) => (
  <option value={value}>
    {label}
  </option>
)

const ResponsiveSelect = withStyles(({
  select: {
    display: 'block',
    '@media only screen and (max-width: 600px)': {
      width: '100%',
    }
  }
}))(Select)

class InputSelect extends React.PureComponent {

  constructor(props){
    super(props)
    this.state = {
      localOptions: [{
        value: -1,
        label: props.hint ?? ''
      }],
      disabled: Boolean(props.dependency)
    }
    this.defaultOption = [{value: -1, label: props.hint ?? ''}]
  }

  async setOptions(){
    const {options,dependency} = this.props;
    if(!dependency){
      if(typeof options === 'function'){
        try{
          const data = await options();
          if(this._isMounted){
            this.setState({localOptions: [...this.defaultOption, ...data]});
          }
        }catch(err){
          this.setState(state => ({localOptions: [...this.defaultOption]}));
        }
      }else{
        this.setState({localOptions: [...this.defaultOption, ...options]});
      }
    }else{
      document.addEventListener(`${dependency}_change`, this.dependencyChanged);
      this.setState({
        localOptions: (typeof options === 'function')?this.defaultOption:[...this.defaultOption, ...options]
      });
    }  
  }

  componentDidMount(){
    this._isMounted = true;
    this.setOptions();
  }

  dependencyChanged = async(event) => {
    const {options} = this.props;
    const applyRule = await toggleSelect(event,options);
    this.setState({
      localOptions: [...this.defaultOption, ...applyRule.data], 
      disabled: applyRule.disabled
    });
  }

  componentWillUnmount(){
    const {dependency} = this.props;
    this._isMounted = false;
    if(dependency){
      // remove listener
      document.removeEventListener(`${dependency}_change`, this.dependencyChanged);
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.value === '' && this.props.value !== ''){
      const {onChange, id} = this.props;
      onChange({target: {name: id, value: this.props.value, type: 'select-one'}});
    }
  }

  render() {
    const {localOptions,disabled} = this.state;
    const {value,id,onChange,label,width,required} = this.props;
    return (
      <React.Fragment>
        <InputLabel htmlFor={id}>{`${label} ${required?'*':''}`}</InputLabel>
        <ResponsiveSelect
          native
          id={id}
          name={id}
          value={value}
          inputProps={{ 
            'aria-label': id,
            // style: {
            //   width: width,
            //   '@media (max-width: 600px)': {
            //     width: 350
            //   }
            // }
          }}
          disabled={disabled}
          onChange={onChange}
        >
          {localOptions.map((opt, key) => (
            <Option key={key} 
              value={opt.value ?? opt.label} 
              label={opt.label ?? '--'} />
          ))}
        </ResponsiveSelect>
      </React.Fragment>
    )
  }
}

InputSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
}

InputSelect.defaultProps = {
  width: 200
}

export default baseComponent()(InputSelect);