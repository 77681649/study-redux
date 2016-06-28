
// 依赖React
import { Component, createElement } from 'react'

// 定义store的结构
import storeShape from '../utils/storeShape'

/**
 * 测试是否浅相等
 * 
 * shallowEqual(objA , objB)
 */
import shallowEqual from '../utils/shallowEqual'

/**
 * ActionCreaters包装器
 * 
 * wrapActionCreators(actionCreators)
 */
import wrapActionCreators from '../utils/wrapActionCreators'

/**
 * warning
 */
import warning from '../utils/warning'

/**
 * 判断是否是单纯的对象
 * isPlainObject(obj)
 */
import isPlainObject from 'lodash/isPlainObject'

/**
 * 
 * hoistNonReactStatics(targetComponent, sourceComponent, customStatics) 
 */
import hoistStatics from 'hoist-non-react-statics'

/**
 * 根据条件判断是否需要抛出一个异常
 * true = 不抛出异常
 * false = 抛出异常
 * 
 * invariant(condition , format , ...args)
 */
import invariant from 'invariant'

/**
 * 默认 MapStateToProps
 * 映射一个空对象
 * @type {Function}
 */
const defaultMapStateToProps = state => ({}) // eslint-disable-line no-unused-vars

/**
 * 默认 MapDispatchToProps
 * 映射仅有个dispatch方法的对象
 * @type {Function}
 */
const defaultMapDispatchToProps = dispatch => ({ dispatch })

/**
 * 默认 合并到Props的规则
 * @type {Function}
 * 父级Props --> stateProps --> dispatchProps
 * @param {Object} stateProps
 * @param {Object} dispatchProps
 * @param {Object} parentProps
 * @returns {Object}
 */
const defaultMergeProps = (stateProps, dispatchProps, parentProps) => ({
  ...parentProps,
  ...stateProps,
  ...dispatchProps
})

/**
 * 获得组件的显示名称
 * @param {ReactComponent} WrappedComponent
 * @returns {String}
 */
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

let errorObject = { value: null }

/**
 * try .. catch ..
 * @param {Function} fn
 * @param {Any} ctx
 */
function tryCatch(fn, ctx) {
  try {
    return fn.apply(ctx)
  } catch (e) {
    errorObject.value = e
    return errorObject
  }
}

// Helps track hot reloading.
let nextVersion = 0

/**
 * connect , 连接ReactComponent与Store中的部分状态 , 部分Actions
 * 
 * @param {Function} [mapStateToProps] !!mapStateToProps == false , 表示当Store变化时 , 不通知组件变化
 * @param {Function} [mapDispatchToProps]
 * @param {Function} [mergeProps]
 * @param {Object} [options]
 *  {Boolean} [pure=true]
 *  {Boolean} [withRef=false]
 * 
 * @returns {Function} 
 */
export default function connect(mapStateToProps, mapDispatchToProps, mergeProps, options = {}) {
  
  // 判断是否需要订阅store的变化
  const shouldSubscribe = Boolean(mapStateToProps)
  
  // set mapState
  const mapState = mapStateToProps || defaultMapStateToProps

  // set mapDispatch
  let mapDispatch
  if (typeof mapDispatchToProps === 'function') {
    mapDispatch = mapDispatchToProps
  } else if (!mapDispatchToProps) {
    mapDispatch = defaultMapDispatchToProps
  } else {
    mapDispatch = wrapActionCreators(mapDispatchToProps)
  }

  // set mergeProps
  const finalMergeProps = mergeProps || defaultMergeProps
  
  // set options
  // pure 
  // withRef
  const { pure = true, withRef = false } = options

  // 是否需要检查合并之后的props是否相等
  // 为什么使用默认的merge就不需要检查merged之后的是否与当前的相等 ?
  // 
  const checkMergedEquals = pure && finalMergeProps !== defaultMergeProps

  // Helps track hot reloading.
  const version = nextVersion++

  /**
   * @param {ReactComponent} WrappedComponent 被包装的组件
   */
  return function wrapWithConnect(WrappedComponent) {

    // 组件显示名称
    const connectDisplayName = `Connect(${getDisplayName(WrappedComponent)})`

    /**
     * 检查props是否为一个纯对象
     * @param {Object} props 组件的属性
     * @param {String} methodName 方法名
     */
    function checkStateShape(props, methodName) {
      if (!isPlainObject(props)) {
        warning(
          `${methodName}() in ${connectDisplayName} must return a plain object. ` +
          `Instead received ${props}.`
        )
      }
    }

    /**
     * 计算合并之后的Props -- 通过调用自定义的合并函数完成
     * @param {Object} stateProps     
     * @param {Object} dispatchProps
     * @param {Object} parentProps
     * 
     * @returns {Object}
     */
    function computeMergedProps(stateProps, dispatchProps, parentProps) {
      const mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps)
      
      if (process.env.NODE_ENV !== 'production') {
        checkStateShape(mergedProps, 'mergeProps')
      }

      return mergedProps
    }

    /**
     * Connect组件
     * @class
     */
    class Connect extends Component {

      /**
       * 判断组件是否需要更新
       * true  = 更新   
       * false = 不更新
       * 
       * 不优化的化 , 无论
       */
      shouldComponentUpdate() {
        return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged
      }

      constructor(props, context) {
        super(props, context)
        
        // 版本
        this.version = version

        // store
        this.store = props.store || context.store

        invariant(this.store,
          `Could not find "store" in either the context or ` +
          `props of "${connectDisplayName}". ` +
          `Either wrap the root component in a <Provider>, ` +
          `or explicitly pass "store" as a prop to "${connectDisplayName}".`
        )

        const storeState = this.store.getState()
        this.state = { storeState }
        this.clearCache()
      }



      /**
       * 计算 state.props
       * @param {Redux.Store} store 状态容器
       * @param {Object} props 组件的属性
       * @returns {Object}
       */
      computeStateProps(store, props) {

        // 没有缓存时 , 配置一个mapState
        if (!this.finalMapStateToProps) {
          return this.configureFinalMapState(store, props)
        }

        const state = store.getState()
        const stateProps = this.doStatePropsDependOnOwnProps ?
          this.finalMapStateToProps(state, props) :
          this.finalMapStateToProps(state)

        if (process.env.NODE_ENV !== 'production') {
          checkStateShape(stateProps, 'mapStateToProps')
        }

        return stateProps
      }

      /**
       * 设置最终的MapState函数
       * @param {Redux.Store} store 状态容器
       * @param {Object} props 组件的属性
       * @returns {Object} mapped之后的状态
       */
      configureFinalMapState(store, props) {
        // 映射状态
        const mappedState = mapState(store.getState(), props)

        // 测试mapState返回的是否是一个工厂方法
        const isFactory = typeof mappedState === 'function'
        
        this.finalMapStateToProps = isFactory ? mappedState : mapState

        // 是否需要依赖组件的props属性进行mapping
        this.doStatePropsDependOnOwnProps = this.finalMapStateToProps.length !== 1

        if (isFactory) {
          return this.computeStateProps(store, props)
        }

        // 测试
        if (process.env.NODE_ENV !== 'production') {
          checkStateShape(mappedState, 'mapStateToProps')
        }

        return mappedState
      }

      /**
       * 如果需要更新Store.state , 则更新
       * @returns {Boolean}
       */
      updateStatePropsIfNeeded() {
        const nextStateProps = this.computeStateProps(this.store, this.props)

        if (this.stateProps && 
          shallowEqual(nextStateProps, this.stateProps)) {
          return false
        }

        this.stateProps = nextStateProps
        return true
      }



      /**
       * 
       */
      computeDispatchProps(store, props) {
        if (!this.finalMapDispatchToProps) {
          return this.configureFinalMapDispatch(store, props)
        }

        const { dispatch } = store
        const dispatchProps = this.doDispatchPropsDependOnOwnProps ?
          this.finalMapDispatchToProps(dispatch, props) :
          this.finalMapDispatchToProps(dispatch)

        if (process.env.NODE_ENV !== 'production') {
          checkStateShape(dispatchProps, 'mapDispatchToProps')
        }
        return dispatchProps
      }

      /**
       * 
       */
      configureFinalMapDispatch(store, props) {
        const mappedDispatch = mapDispatch(store.dispatch, props)
        const isFactory = typeof mappedDispatch === 'function'

        this.finalMapDispatchToProps = isFactory ? mappedDispatch : mapDispatch
        this.doDispatchPropsDependOnOwnProps = this.finalMapDispatchToProps.length !== 1

        if (isFactory) {
          return this.computeDispatchProps(store, props)
        }

        if (process.env.NODE_ENV !== 'production') {
          checkStateShape(mappedDispatch, 'mapDispatchToProps')
        }
        return mappedDispatch
      }

      /**
       * 
       */
      updateDispatchPropsIfNeeded() {
        const nextDispatchProps = this.computeDispatchProps(this.store, this.props)
        if (this.dispatchProps && shallowEqual(nextDispatchProps, this.dispatchProps)) {
          return false
        }

        this.dispatchProps = nextDispatchProps
        return true
      }


      /**
       * 
       * @returns {Boolean} true=已更新 , false=不更新
       */
      updateMergedPropsIfNeeded() {

        // 根据当前的stateProps , dispatchProps , props计算出最新的合并之后的props
        const nextMergedProps = computeMergedProps(this.stateProps, this.dispatchProps, this.props)
        
        
        if (this.mergedProps && 
          checkMergedEquals && 
          shallowEqual(nextMergedProps, this.mergedProps)) {
          return false
        }

        this.mergedProps = nextMergedProps
        return true
      }



      /**
       * 判断是否已经subscribe
       * @returns {Boolean}
       */
      isSubscribed() {
        return typeof this.unsubscribe === 'function'
      }

      /**
       * 尝试subscribe ( this.store.subscribe )
       */
      trySubscribe() {
        // 需要订阅 && 之前没有订阅过
        if (shouldSubscribe && !this.unsubscribe) {
          this.unsubscribe = this.store.subscribe(this.handleChange.bind(this))
          this.handleChange()
        }
      }

      /**
       * 尝试unsubscribe
       */
      tryUnsubscribe() {
        if (this.unsubscribe) {
          this.unsubscribe()
          this.unsubscribe = null
        }
      }



      /**
       * 当组件已挂载时 , 尝试订阅Store change
       */
      componentDidMount() {
        this.trySubscribe()
      }

      /**
       * 测试props是否变化
       */
      componentWillReceiveProps(nextProps) {
        if (!pure || !shallowEqual(nextProps, this.props)) {
          this.haveOwnPropsChanged = true
        }
      }

      /**
       * 当组件卸载时 , 取消订阅 && 清除缓存
       */
      componentWillUnmount() {
        this.tryUnsubscribe()
        this.clearCache()
      }

      /**
       * 
       */
      clearCache() {
        this.dispatchProps = null
        this.stateProps = null
        this.mergedProps = null
        
        this.haveOwnPropsChanged = true
        this.hasStoreStateChanged = true
        this.haveStatePropsBeenPrecalculated = false
        
        this.statePropsPrecalculationError = null
        this.renderedElement = null
        
        this.finalMapDispatchToProps = null
        this.finalMapStateToProps = null
      }

      /**
       * 处理Store change
       */
      handleChange() {
        // 已取消订阅 , 不处理
        if (!this.unsubscribe) {
          return
        }

        // 当前state
        const storeState = this.store.getState()

        // 之前的State
        const prevStoreState = this.state.storeState

        // 没有变化 , 不处理
        if (pure && prevStoreState === storeState) {
          return
        }

        // state不依赖Props 
        // doStatePropsDependOnOwnProps = true  , 表示mapState(state,props)
        // doStatePropsDependOnOwnProps = false , 表示mapState(state)
        if (pure && !this.doStatePropsDependOnOwnProps) {
          const haveStatePropsChanged = tryCatch(this.updateStatePropsIfNeeded, this)
          
          // 没有变化
          if (!haveStatePropsChanged) {
            return
          }

          // 
          if (haveStatePropsChanged === errorObject) {
            this.statePropsPrecalculationError = errorObject.value
          }
          
          this.haveStatePropsBeenPrecalculated = true
        }

        this.hasStoreStateChanged = true
        this.setState({ storeState })
      }

      /**
       * 
       */
      getWrappedInstance() {
        invariant(withRef,
          `To access the wrapped instance, you need to specify ` +
          `{ withRef: true } as the fourth argument of the connect() call.`
        )

        return this.refs.wrappedInstance
      }

      /**
       * render
       */
      render() {
        const {
          haveOwnPropsChanged,
          hasStoreStateChanged,
          haveStatePropsBeenPrecalculated,
          statePropsPrecalculationError,
          renderedElement
        } = this

        // 初始化
        this.haveOwnPropsChanged = false
        this.hasStoreStateChanged = false
        this.haveStatePropsBeenPrecalculated = false
        this.statePropsPrecalculationError = null

        // 发生错误
        if (statePropsPrecalculationError) {
          throw statePropsPrecalculationError
        }

        // 是否应该更新stateProps
        let shouldUpdateStateProps = true

        // 是否应该更新dispatchProps
        let shouldUpdateDispatchProps = true

        // 若 已被渲染过 , 则需要判断是否更新
        // 否则 , 直接更新state , dispatch 
        if (pure && renderedElement) {
          shouldUpdateStateProps = hasStoreStateChanged || (
            haveOwnPropsChanged && this.doStatePropsDependOnOwnProps
          )

          shouldUpdateDispatchProps =
            haveOwnPropsChanged && this.doDispatchPropsDependOnOwnProps
        }

        let haveStatePropsChanged = false
        let haveDispatchPropsChanged = false
        
        if (haveStatePropsBeenPrecalculated) {
          // 之前已经计算好了 , 则表明肯定有state更改变
          haveStatePropsChanged = true
        } 
        else if (shouldUpdateStateProps) {
          //
          haveStatePropsChanged = this.updateStatePropsIfNeeded()
        }

        if (shouldUpdateDispatchProps) {
          haveDispatchPropsChanged = this.updateDispatchPropsIfNeeded()
        }

        let haveMergedPropsChanged = true
        if (
          haveStatePropsChanged ||
          haveDispatchPropsChanged ||
          haveOwnPropsChanged
        ) {
          haveMergedPropsChanged = this.updateMergedPropsIfNeeded()
        } else {
          haveMergedPropsChanged = false
        }

        if (!haveMergedPropsChanged && renderedElement) {
          return renderedElement
        }

        if (withRef) {
          this.renderedElement = createElement(WrappedComponent, {
            ...this.mergedProps,
            ref: 'wrappedInstance'
          })
        } else {
          this.renderedElement = createElement(WrappedComponent,
            this.mergedProps
          )
        }

        return this.renderedElement
      }
    }

    // 连接之后的显示名称为被连接的组件的显示名称
    Connect.displayName = connectDisplayName
    
    // 被包装的组件
    Connect.WrappedComponent = WrappedComponent
    
    // 定义父组件的Context类型
    Connect.contextTypes = {
      store: storeShape
    }
    
    // 定义组件的Props类型
    Connect.propTypes = {
      store: storeShape
    }

    // 当是DEV版本时 , 启动热替换的功能
    if (process.env.NODE_ENV !== 'production') {
      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
        if (this.version === version) {
          return
        }

        // We are hot reloading!
        this.version = version
        this.trySubscribe()
        this.clearCache()
      }
    }

    // extend 构造函数的静态数据
    // prototype ... , 但是排除
    return hoistStatics(Connect, WrappedComponent)
  }
}
