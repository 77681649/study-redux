'use strict';

import {combineReducers} from 'redux'
import loginReducer from './LoginReducer'

export default function () {
    return combineReducers({
        login: loginReducer
    })
}