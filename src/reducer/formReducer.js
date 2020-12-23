/**
* Reducer for form changes
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 05/07/2020
*/
import {ACTION_CHANGE_FIELD,ACTION_CHANGE_DATA} from '../actions';

const initialValue = {
  formData: {}
}

export const formReducer = (state = initialValue, action) => {
  switch (action.type){
    case ACTION_CHANGE_DATA:
      return { ...state, formData: action.formData };
    case ACTION_CHANGE_FIELD:
      return { ...state, formData: {
        ...state.formData, 
        [action.target.name]: action.target.value 
      }};
    default:
      return state;
  }
}