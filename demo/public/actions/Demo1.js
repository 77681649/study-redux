
import fetch from 'isomorphic-fetch'
import {demo1} from '../constants'

function fetchGroupList(departureDate) {
    const url = `http://localhost:3000/group/list/${departureDate}`

    return fetch(url).then(req => req.json())
}

function fetchGroupFlightList(groupId) {
    const url = `http://localhost:3000/group/flight-list/${groupId}`

    return fetch(url).then(req => req.json())
}

function fetchGroupDiscountList(groupId) {
    const url = `http://localhost:3000/group/discount-list/${groupId}`

    return fetch(url).then(req => req.json())
}

function fetchGroupResource(selectedId) {
    return Promise.all([
        fetchGroupFlightList(selectedId),
        fetchGroupDiscountList(selectedId)
    ])
}



function createGetGroupListAction(result) {
    let list = result && result.data || []
    let selected = list.length > 0 ? list[0].id : 0

    return {
        type: demo1.GET_GROUP_LIST,
        selected: selected,
        data: list
    }
}

function createGetGroupFlightListAction(result) {
    return {
        type: demo1.GET_GROUP_FLIGHT_LIST,
        data: result.data || []
    }
}

function createGetGroupDiscountListAction(result) {
    return {
        type: demo1.GET_GROUP_DISCOUNT_LIST,
        data: result.data || []
    }
}

function createChangeSelectedGroupIdAction(selected) {
    return {
        type: demo1.CHANGE_SELECT_GROUP_ID,
        selected: selected
    }
}

function createUpdateGroupResourceAction(flightList, discountList) {
    return {
        type: demo1.UPDATE_GROUP_RESOURCE,
        flightList: flightList.data || [],
        discountList: discountList.data || []
    }
}



// 获得出发团列表
export function getGroupList(departureDate) {
    return dispatch => {
        fetchGroupList(departureDate)
            .then(result => dispatch(createGetGroupListAction(result)))
    }
}

// 获得出发团机票列表
export function getGroupFlightList(groupId) {
    return dispatch => {
        fetchGroupFlightList(groupId)
            .then(json => dispatch(createGetGroupFlightListAction(json)))
    }
}

// 获得出发团优惠列表
export function getGroupDiscountList(groupId) {
    return dispatch => {
        fetchGroupDiscountList(departureDate)
            .then(json => dispatch(createGetGroupDiscountListAction(json)))
    }
}

// 改变选中的出发团ID
export function changeSelectedGroupId(selectedId) {
    return createChangeSelectedGroupIdAction(selectedId)
}

// 改变选中的出发团ID
export function updateGroupResource(selectedId) {

    return dispatch => {
        fetchGroupResource(selectedId)
            .then((results) => {
                dispatch(createUpdateGroupResourceAction(...results))
            })
    }
}