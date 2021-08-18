/**
 * Reducers for form
 * @author: Aderbal Nunes <aderbalnunes@gmail.com>
 * @since: 13/07/2021
 *
 * Copyright 2021.
 */
import {ACTION_SET_DEPENDENCY,ACTION_PUSH_DEPENDENCY} from '../actions';

const initialValue = {
  dependencies: []
}
 
export const globalReducer = (state = initialValue, action) => {
  switch (action.type){
    case ACTION_SET_DEPENDENCY:
      return { ...state, dependencies: action.dependencies };
    case ACTION_PUSH_DEPENDENCY:
      return { ...state, dependencies: [...state.dependencies, action.dependency]}
    default:
      return state;
  }
}