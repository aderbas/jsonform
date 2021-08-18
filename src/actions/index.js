/**
* Actions for Redux
* @author: Aderbal Nunes <aderbalnunes@gmail.com>
* @since: 05/07/2020
*/
export const ACTION_CHANGE_FIELD = 'ACTION_CHANGE_FIELD';
export const ACTION_CHANGE_DATA = 'ACTION_CHANGE_DATA';
export const ACTION_SET_DEPENDENCY = 'ACTION_SET_DEPENDENCY';
export const ACTION_PUSH_DEPENDENCY = 'ACTION_PUSH_DEPENDENCY';

// change object field
export const changeField = (name,value) => ({
  type: ACTION_CHANGE_FIELD,
  target: {name,value}
});

// change object
export const changeData = value => ({
  type: ACTION_CHANGE_DATA,
  formData: value
});

// set dependency
export const setDependency = value => ({
  type: ACTION_SET_DEPENDENCY,
  dependencies: value
});

// push dependency
export const pushDependency = dependency => ({
  type: ACTION_PUSH_DEPENDENCY,
  dependency: dependency
})