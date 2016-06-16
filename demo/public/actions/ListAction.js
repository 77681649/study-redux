
import fetch from 'isomorphic-fetch'

import {listConstants} from '../constants'

function fetchList(){
  const url = 'http://localhost:3000/list/books'

  return dispatch => {
    fetch(url)
      .then(req => req.json())
      .then(json => dispatch(createGetListAction(json)))
  }
}

function createGetListAction(result){
  return {
    type : listConstants.LIST_FETCH,
    data : result.data || []
  }
}

export function getList(){
  return fetchList()
}