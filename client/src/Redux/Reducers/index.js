import { combineReducers } from 'redux';
import UserReducer from './UserReducer';
import gameReducer from './gameReducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage
};

const rootReducer = combineReducers({
    UserReducer, 
    gameReducer
});

export default persistReducer(persistConfig, rootReducer);