// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import dropdown from './dropdown';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, dropdown });

export default reducers;
