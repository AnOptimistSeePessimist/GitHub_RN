import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../reducer';
import {middleware} from '../navigator/AppNavigator';

/*
const logger = store => next => action => {
  if (typeof action === 'function') {
    console.log('dispatching a function');
  } else {
    console.log('dispatching ', action);
  }
  const result = next(action);
  console.log('nextState ', store.getState());
};
*/

const middlewares = [
  middleware
];

if (__DEV__) {
  middlewares.push(logger);
}


export default createStore(rootReducer, applyMiddleware(...middlewares));