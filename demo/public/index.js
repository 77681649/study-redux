'use strict';

import React, {Component} from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link } from 'react-router'

import * as Pages from './pages'

import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

const store = configureStore({
    login: {}
})

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <Pages.Home />
            </Provider>
        )
    }
}

render(
    <Router history={browserHistory}>
        <Route path='/' component={App} />
        <Route path='list' component={Pages.List} />
        <Route path='detail' component={Pages.Detail} />
        <Route path='*' component={Pages.NotFound} />
    </Router>,
    document.getElementById('root')
)