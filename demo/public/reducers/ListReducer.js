
import {listConstants} from '../constants'

const initialState = {
    data:[]
}

export default function (state = initialState, action) {
    console.debug('dispatch %j', action)

    switch (action.type) {
        case listConstants.LIST_FETCH:
            return {
                ...state,
                data : action.data
            }

        default:
            return state
    }
}