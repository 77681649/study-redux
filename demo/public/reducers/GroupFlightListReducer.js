
import {demo1} from '../constants'

const initialState = {
    list: [],
    loading: true
}

export default function (state = initialState, action) {
    console.debug('dispatch %j', action)

    switch (action.type) {
        case demo1.GET_GROUP_FLIGHT_LIST:
            return {
                loading: false,
                data: action.data
            }

        case demo1.CHANGE_SELECT_GROUP_ID:
            return {
                ...state,
                loading: true
            }

        case demo1.UPDATE_GROUP_RESOURCE:
            return {
                loading: false,
                data: action.flightList
            }

        default:
            return state
    }
}