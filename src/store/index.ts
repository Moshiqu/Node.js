import { legacy_createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'

import arrReducer from './ArrStatus/reducer';
import numReducer from './NumStatus/reducer';

const reducers = combineReducers({ arrReducer, numReducer })


const store = legacy_createStore(reducers, composeWithDevTools())

export default store