
import {loginConstants} from '../constants'

const initialState = {
    username: '',
    password: ''
}

export default function (state = initialState, action) {
    console.debug('dispatch %j', action)

    switch (action.type) {
        case loginConstants.LOGIN_SIGN_IN:
            return {
                ...state,
                username: action.username,
                password: action.password
            }

        default:
            return state
    }
}