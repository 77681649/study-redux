'use strict';

import {combineReducers} from 'redux'

import loginReducer from './LoginReducer'
import listReducer from './ListReducer'
import grouplistReducer from './GroupListReducer'
import groupFlightListReducer from './GroupFlightListReducer'
import groupDiscountListReducer from './GroupDiscountListReducer'

const rootReducer = combineReducers({
    login: loginReducer,
    list: listReducer,
    grouplist: grouplistReducer,
    groupFlightList: groupFlightListReducer,
    groupDiscountList: groupDiscountListReducer
})

export default rootReducer
