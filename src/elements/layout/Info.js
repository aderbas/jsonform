import React from 'react';
import {Box} from '@mui/material';
import PropTypes from 'prop-types';

const Info = ({...props}) => {
  const {icon,text,color} = props;

  return (
    <Box pb={1} pt={1} display="flex" color={color}>
      <Box>{icon}</Box>
      <Box flexGrow={1}>{text}</Box>
    </Box>
  )
}

Info.propTypes = {
  icon: PropTypes.object,
  color: PropTypes.string,
  text: PropTypes.string.isRequired
}

Info.defaultProps = {
  color: 'text.secondary'
}

export default Info;
