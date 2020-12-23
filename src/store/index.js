/**
* Store
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 05/07/2020
*/
import {createStore} from 'redux';
import {Reducers} from '../reducer';

export const Store = createStore(Reducers);
