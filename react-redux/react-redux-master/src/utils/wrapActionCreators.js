import { bindActionCreators } from 'redux'

/**
 * 包绕ActionCreater
 * @param {Object} actionCreaters 动作创建者
 * @returns {Object}
 */
export default function wrapActionCreators(actionCreators) {
  return dispatch => bindActionCreators(actionCreators, dispatch)
}
