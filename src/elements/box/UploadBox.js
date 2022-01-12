/**
 * Upload area component. Drag files or click to choose
 * Aderbal Nunes <aderbalnunes@gmail.com>
 */

import React, { PureComponent } from 'react';
import {withStyles} from '@mui/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    position: 'relative',
  },
  uploadArea: {
    paddig: 4,
    border: '2px dashed #bbb',
    '-moz-border-radius': 5,
    '-webkit-border-radius': 5,
    borderRadius: 5,
    padding: 18,
    textAlign: 'center',
    font: "20pt bold'Vollkorn'",
    color: '#bbb',
    '&:hover': {
      paddig: 3,
      border: '3px dashed #bbb',
      cursor: 'pointer'
    }
  },
  nativeInput: {
    display: 'none'
  },
  info: {
    color: '#CCC'
  }
});

class UploadBox extends PureComponent{

  constructor(props){
    super(props);
    this.dropBoxElement = React.createRef();
  }

  _handlerDropedFile = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    // FileList Object
    const files = ev.dataTransfer.files;
    this._sendFiles(files);
  }

  _handlerDragOver = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'copy';
  }

  _handlerChangeInput = (ev) => {
    this._sendFiles(ev.target.files);
  }

  _onClick = ev => this.inputElement.click();

  _sendFiles = files => {
    // seeq files and put in a queue or send a batch of file
    // append in a window.FormData() object
    // append('file', file, file.name)
    const {onChange,id} = this.props;
    if(files && files.length > 0){
      const listFiles = Array.from(files);
      if(onChange){
        onChange({target: {name: id, value: listFiles, type: 'upload'}});
      }
    }
  }

  componentDidMount(){
    this.dropBoxElement.current.addEventListener('dragover', this._handlerDragOver, false);
    this.dropBoxElement.current.addEventListener('drop', this._handlerDropedFile, false);
  }

  componentWillUnmount(){
    this.dropBoxElement.current.removeEventListener('dragover', this._handlerDragOver);
    this.dropBoxElement.current.removeEventListener('drop', this._handlerDropedFile);
  }

  render(){
    const {classes,label,info} = this.props;
    return (
      <div className={classes.root} ref={this.dropBoxElement}>
        <label>{label?label:'Upload File'}</label>
        <input
          multiple
          type="file" 
          ref={input => this.inputElement = input}
          className={classes.nativeInput} 
          onChange={this._handlerChangeInput}
        />
        <div className={classes.uploadArea} onClick={this._onClick}>Click or drop file here</div>
        <div className={classes.info}>{info}</div>
      </div>
    );
  };
}

UploadBox.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  info: PropTypes.string,
}

export default withStyles(styles)(UploadBox);