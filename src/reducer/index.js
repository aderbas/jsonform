import {formReducer} from './formReducer';
import {combineReducers} from 'redux';

export const Reducers = combineReducers({
  formState: formReducer,
});