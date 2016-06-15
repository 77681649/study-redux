import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, 
 * this should be the first store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * 
 * IMiddle
 * 
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState, enhancer) => {
    // 创建一个Store
    var store = createStore(reducer, initialState, enhancer)

    // dispatch方法
    var dispatch = store.dispatch

    // 调用链
    var chain = []

    // 定义中间件的API
    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }

    // 生成调用链
    // (next)=>(action)=>{}
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    
    // 执行顺序 MiddlewareN --> MidleewareN-1 --> ... -> Middleware1
    dispatch = compose(...chain)(store.dispatch)

    const result = {
      ...store,
      dispatch
    }

    return result;
  }
}
