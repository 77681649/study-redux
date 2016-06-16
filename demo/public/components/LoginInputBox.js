'use strict';

import React, {Component} from 'react'
import Input from './Input'

class LoginInputBox extends Component {

    getUserName(){
        return this.refs.username.state.value
    }

    getPassword(){
        return this.refs.password.state.value
    }

    render() {
        console.log('render LoginInputBox')

        return (
            <div>
                <Input ref="username" id="username" name="username" value={this.props.username}  />
                <Input ref="password" id="password" name="password" value={this.props.password} />
            </div>
        )
    }
}

export default LoginInputBox