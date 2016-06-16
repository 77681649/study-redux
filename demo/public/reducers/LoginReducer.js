
import {loginConstants} from '../constants'

export default function (state, aciton) {
    let newState

    switch (action.type) {
        case loginConstants.LOGIN_SIGN_IN:
            newState = {
                ...state,
                username : aciton.username,
                password : aciton.password
            }
            break;

        default:
            newState = state
    }

    return newState
}