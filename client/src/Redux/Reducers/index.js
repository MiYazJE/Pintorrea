import { combineReducers } from 'redux';
import UserReducer from './UserReducer';
import gameReducer from './gameReducer';

const rootReducer = combineReducers({
    UserReducer, 
    gameReducer
});

export default rootReducer;