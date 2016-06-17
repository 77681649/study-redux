'use strict';

import React, {Component} from 'react'

const Input = React.createClass({

    getInitialState: function () {
        return {
            value: this.props.value
        }
    },

    componentWillReceiveProps: function () {
        this.setState({ value: this.props.value });
    },

    change: function (e) {
        this.setState({ value: e.target.value });
    },

    render: function () {
        console.log('render Input')

        const props = this.props

        return (
            <div class="input">
                <label htmlFor={props.id}>{props.name}</label>
                <input id={props.id} type="text" value={this.state.value} onChange={this.change } />
            </div>
        )
    }
})

export default Input