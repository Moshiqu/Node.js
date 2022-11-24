import { legacy_createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

import arrReducer from './ArrStatus/reducer';
import numReducer from './NumStatus/reducer';
import userInfoReducer from './UserInfo/reducer';

const reducers = combineReducers({ arrReducer, numReducer, userInfoReducer })

const store = legacy_createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))

export default store