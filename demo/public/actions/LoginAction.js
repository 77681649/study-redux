
import {loginConstants} from '../constants'

export function signIn(username, password) {
    return {
        type: loginConstants.LOGIN_SIGN_IN,
        username,
        password
    }
}