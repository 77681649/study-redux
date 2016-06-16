'use strict'

import React, {Component} from 'react'
import LoginButtonBox from './LoginButtonBox'
import LoginInputBox from './LoginInputBox'

const LoginBox = React.createClass({

    getInitialState: function () {
        return {
            username: '',
            password: ''
        }
    },

    onClickSignIn: function () {

    },

    onClickClear: function () {
        this.setState({ username: '', password: '' })
    },

    render: function () {
        return (
            <div>
                <LoginInputBox username={this.state.username} password={this.state.password} />
                <LoginButtonBox
                    onClickSignIn={this.onClickSignIn}
                    onClickClear={this.onClickClear}
                    />
            </div>
        )
    }
})

export default LoginBox