import { combineReducers } from 'redux';

import lists from './Lists';
import app from './App';
import register from './Register';
import products from './Products';

const unrealTracker = combineReducers({
    app,
    lists,
    products,
    register,
});

export default unrealTracker;