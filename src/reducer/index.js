import {formReducer} from './formReducer';
import {globalReducer} from './globalReducer';
import {combineReducers} from 'redux';

export const Reducers = combineReducers({
  formState: formReducer,
  globalState: globalReducer
});