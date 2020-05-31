import { combineReducers } from 'redux';
import UserReducer from './UserReducer';
import gameReducer from './gameReducer';

export default combineReducers({ UserReducer, gameReducer });