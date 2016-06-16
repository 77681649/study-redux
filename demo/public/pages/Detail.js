
import React, {Component} from 'react'
import {connect} from 'react-redux'

const Detail = React.createClass({

    getInitialState: function () {
        return this.getBookById() || {}
    },

    getBookById: function () {
        let id = this.props.params.id
        let list = this.props.list || []

        return list.find((it) => it.id == id)
    },

    render: function () {
        let element;

        if (this.state.name) {
            element = <div>
                <h1>{this.state.name}</h1> 
                <p>{this.state.description}</p>
            </div>
        }
        else {
            element = <h1>Not Found</h1>
        }

        return (
            <section>
                { element }
            </section>
        )
    }
})

export default connect(
    function (state) {
        return {
            list: state.list.data
        }
    }
)(Detail)