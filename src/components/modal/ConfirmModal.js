import React from 'react';
import {Dialog,DialogActions,DialogContent,DialogContentText,Button} from '@material-ui/core';
import {PropTypes} from 'prop-types';

const ConfirmModal = ({...props}) => {
  const {open,onClose,onConfirm,content,confirmButtonsLabel} = props;
  const {no, yes} = confirmButtonsLabel||{};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"    
    >
      <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {no||'No'}
          </Button>
          <Button onClick={onConfirm} color="primary" autoFocus>
            {yes||'Yes'}
          </Button>
        </DialogActions>      
    </Dialog>
  )
}

ConfirmModal.propTypes = {
  onConfirm: PropTypes.func.isRequired
}

export default ConfirmModal;