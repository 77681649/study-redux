'use strict'

import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import LoginButtonBox from './LoginButtonBox'
import LoginInputBox from './LoginInputBox'

import {LoginAction} from '../actions'

const LoginBox = React.createClass({
    propTypes: {
        signIn: PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            username: '',
            password: ''
        }
    },

    onClickSignIn: function () {
        let inputbox = this.refs.inputbox

        this.props.signIn(
            inputbox.getUserName(),
            inputbox.getPassword()
        )

        this.props.goList()
    },
    
    onClickClear: function () {
        this.setState({ username: '', password: '' })
    },
 
    render: function() {   
        return (
            <div> 
                <LoginInputBox ref="inputbox" username={this.state.username} password={this.state.password} />
                <LoginButtonBox
                    onClickSignIn={this.onClickSignIn}
                    onClickClear={this.onClickClear}
                    />
            </div>
        )
    }
})

function mapStateToProps(state) {
    return {
        login: state.login
    }
}

function mapDispatchToProps(dispatch) {
        return bindActionCreators(LoginAction, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginBox)
