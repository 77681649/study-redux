'use strict';

import React, {Component} from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link } from 'react-router'

import * as Pages from './pages'

import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

require('./style/normalize.css')
require('./style/Index.less')

const store = configureStore({
    login: {}
})

render(
    <Provider store={store} key="provider">
        <Router history={browserHistory}>
            <Route path='/' component={Pages.Home} />
            <Route path='list' component={Pages.List} />
            <Route path='detail/:id' component={Pages.Detail} />

            <Route path="demo">
                <Route path="demo1" component={Pages.Demo.Demo1} />
            </Route>

            <Route path='*' component={Pages.NotFound} />
        </Router>
    </Provider>,
    document.getElementById('root')
)