import { Component, PropTypes, Children } from 'react'
import storeShape from '../utils/storeShape'
import warning from '../utils/warning'

/**
 * 
 */
let didWarnAboutReceivingStore = false

function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return
  }
  didWarnAboutReceivingStore = true

  warning(
    '<Provider> does not support changing `store` on the fly. ' +
    'It is most likely that you see this error because you updated to ' +
    'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' +
    'automatically. See https://github.com/reactjs/react-redux/releases/' +
    'tag/v2.0.0 for the migration instructions.'
  )
}

/**
 * React Provider
 * 用于存储Store , 
 */
export default class Provider extends Component {
  
  /**
   * 返回给子组建的Context , 子组件通过context访问父组件的Context
   * 
   * 子组件要使用context时 ， 必须做如下步骤 ： 
   *  1. 设置contextTypes
   *  2. 访问this.context
   * 
   * @returns {Object}
   */
  getChildContext() {
    return { store: this.store }
  }

  constructor(props, context) {
    super(props, context)
    
    // store 通过Provider组件的属性设置
    this.store = props.store
  }

  render() {
    // 
    return Children.only(this.props.children)
  }
}

if (process.env.NODE_ENV !== 'production') {
  Provider.prototype.componentWillReceiveProps = function (nextProps) {
    const { store } = this
    const { store: nextStore } = nextProps

    if (store !== nextStore) {
      warnAboutReceivingStore()
    }
  }
}

Provider.propTypes = {
  // 容器
  store: storeShape.isRequired,
  
  // 子组件
  children: PropTypes.element.isRequired
}

/**
 * 定义getChildContext返回对象的类型
 */
Provider.childContextTypes = {
  store: storeShape.isRequired
}
