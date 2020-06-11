import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeFunction =
    process.env.REACT_APP_ENVIROMENT === 'PRODUCTION'
    ? compose 
    : composeWithDevTools; 

const store = createStore(rootReducer, {}, composeFunction(applyMiddleware(thunk)));

export default store;
