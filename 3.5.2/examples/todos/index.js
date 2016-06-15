import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers }  from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = (function configureStore(initialState) {
  const store = createStore(todoApp, initialState, compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
})();

window.redux = {
  createStore,
  applyMiddleware,
  compose
}

// change , dispatch嵌套
let store1 = createStore(
  combineReducers({
    a: (prevState, action) => 1,
    b: (prevState, action) => 2,
    c: (prevState, action) => 3
  })
)

// let unscribe1 = store1.subscribe(()=>{
//   console.log('listen1' , store1.getState());

//   if(store1.getState().num == 1){
//     unscribe2();

//     store1.dispatch({type:'SET' , num:2});
//   }
// })

// let unscribe2 = store1.subscribe(()=>{
//   console.log('listen2' , store1.getState());
// })

// let unscribe3 = store1.subscribe(()=>{
//   console.log('getState' , store1.getState());
// })

// store1.dispatch({
//   type: 'SET'
// });


function middleware1(store) {
  console.log('outside - middleware1');

  return next => {
    console.log('middle - middleware1');

    return action => {
      console.log('inside - middleware1');
      // console.log(next);

      if (action.type == 'INIT') {
        setTimeout(
          () => next(Object.assign({}, action, { data: [1, 2, 3] })),
          1000
        );
      }
      else {
        next(this.getState());
      }
    }
  }
}

function middleware2(store) {
  console.log('outside - middleware2');

  return next => {
    console.log('middle - middleware2');
    console.log(store.dispatch);

    return action => {

      console.log('inside - middleware2');
      // console.log(next);

      next(action);
    }
  }
}

const store2 = applyMiddleware(
  middleware1,
  middleware2
)(createStore)(
  (prevState, action) => {
    console.log('dispatch OK');
    return prevState
  },
  { data: [] }
  )

let dispatch = store2.dispatch;

store2.dispatch = function (...args) {
  console.log('dispatch');

  return dispatch(...args);
}

store2.dispatch({ type: 'INIT' });

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
