/**
 * Input Switch
 * @author: Aderbal Nunes <aderbalnunes@gmail.com>
 * @since: 24/06/2020
 */
import React from "react"
import PropTypes from 'prop-types';
import baseComponent from '../../BaseComponent';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {toggleInput} from '../../util';

class InputSwitch extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      disabled: Boolean(props.dependency),
    }
  }

  componentDidMount(){
    const {dependency} = this.props;
    if(dependency){
      document.addEventListener(`${dependency}_change`, this.dependencyChanged.bind(this));
    }
  }

  componentWillUnmount(){
    const {dependency} = this.props;
    if(dependency){
      document.removeEventListener(`${dependency}_change`, this.dependencyChanged);
    }    
  }

  dependencyChanged(event){
    this.setState({disabled: !toggleInput(event)});
  }

  componentDidUpdate(prevProps){
    if(prevProps.value === '' && this.props.value !== ''){
      this.props.onChange({target: {name: this.props.id, checked: this.props.value, type: 'checkbox'}})
    }
  }

  render(){
    const {disabled} = this.state;
    const {id, value, label, dispatch, ...rest} = this.props;
    return (
      <FormGroup row>
        <FormControlLabel
          label={label}
          control={
            <Switch 
              id={id}
              name={id}
              checked={(typeof value === 'boolean')?value:(value==='true')}
              disabled={disabled}
              {...rest}
            />
          }
        />        
      </FormGroup>
    )
  }
}

InputSwitch.propTypes = {
  label: PropTypes.string.isRequired,
}

export default baseComponent(null)(InputSwitch);
