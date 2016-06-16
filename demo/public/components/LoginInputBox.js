'use strict';

import React, {Component} from 'react'
import Input from './Input'

class LoginInputBox extends Component {

    render() {
        return (
            <div>
                <Input ref="username" id="username" name="username" value={this.props.username}  />
                <Input ref="password" id="passsword" name="passsword" value={this.props.password} />
            </div>
        )
    }
}

export default LoginInputBox