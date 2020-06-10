import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './Reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';

const composeFunction =
    process.env.REACT_APP_ENVIROMENT === 'PRODUCTION'
    ? compose 
    : composeWithDevTools; 

export const store     = createStore(rootReducer, {}, composeFunction(applyMiddleware(thunk)));
export const persistor = persistStore(store);

export default { store, persistor };
