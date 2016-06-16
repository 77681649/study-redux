'use strict'

import React, {Component} from 'react'

class LoginButtonBox extends Component {


    onClickSignIn() {
        this.props.onClickSignIn && this.props.onClickSignIn()
    }

    onClickClear() {
        this.props.onClickClear && this.props.onClickClear()
    }

    render() {
        console.log('render LoginButtonBox')

        return (
            <div>
                <button onClick={this.onClickSignIn.bind(this)}>Sign In</button>
                <button onClick={this.onClickClear.bind(this)}>Clear</button>
            </div>
        )
    }
}

export default LoginButtonBox