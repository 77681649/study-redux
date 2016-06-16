import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import configureStore from './store/configureStore'
import 'todomvc-app-css/index.css'

const store = configureStore()

render(
  <Route handler={App}>
    <Route path="/" component={Index}/>
    <Route path="list" component={List}/>
    <Route path="detail" component={Detail}/>
  </Route>,
  document.getElementById('root')
)
