import { combineReducers } from 'redux';
import UserReducer from './userReducer';
import gameReducer from './gameReducer';

export default combineReducers({
    UserReducer, 
    gameReducer
});