
import {demo1} from '../constants'

const initialState = {
    list: [],
    selected: 0,
    loading: true
}

export default function (state = initialState, action) {
    console.debug('dispatch %j', action)

    switch (action.type) {
        case demo1.GET_GROUP_LIST:
            return {
                selected: action.selected,
                loading: false,
                data: action.data
            }

        case demo1.CHANGE_SELECT_GROUP_ID:
            return {
                ...state,
                selected: action.selected
            }

        default:
            return state
    }
}