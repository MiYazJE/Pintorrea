import { createStore, applyMiddleware } from 'redux';
import reducers from './Reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

console.log(process.env.REACT_APP_ENVIROMENT)
const devTools = 
    process.env.REACT_APP_ENVIROMENT === 'PRODUCTION'
        ? applyMiddleware(thunk)
        : composeWithDevTools(applyMiddleware(thunk));

const store = createStore(
    reducers, 
    devTools
);

export default store;