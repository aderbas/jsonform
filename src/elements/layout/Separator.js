/**
* Divider component
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 22/12/2020
*
*/

import React from "react"
import baseComponent from '../../BaseComponent';
import {Divider} from '@mui/material';

class Separator extends React.Component {

  render(){
    return (
      <Divider />
    );
  }
}

export default baseComponent(null)(Separator);