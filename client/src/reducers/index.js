import { combineReducers } from 'redux';
import stocks from './stocksReducer';
import {routerReducer} from 'react-router-redux';


const rootReducer = combineReducers({
  stocks,
  routing: routerReducer,
});

export default rootReducer;
