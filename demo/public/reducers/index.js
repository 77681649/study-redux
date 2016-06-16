'use strict';

import {combineReducers} from 'redux'

import loginReducer from './LoginReducer'
import listReducer from './ListReducer'

const rootReducer = combineReducers({
    login: loginReducer,
    list: listReducer
})

export default rootReducer
