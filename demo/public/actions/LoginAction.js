
import {loginConstants} from '../constants'

export function clearInput() {
    return {
        type: loginConstants.LOGIN_CLEAR_INPUT
    }
}

export function signIn(username, password) {
    return {
        type: loginConstants.LOGIN_SIGN_IN,
        username,
        password
    }
}