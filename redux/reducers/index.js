import {combineReducers} from 'redux';
import { user } from './user';
import { search } from './search';

const Reducers = combineReducers ({
    userState: user,
    searchState: search
});

export default Reducers;