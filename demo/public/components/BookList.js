import React, { Component } from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Book from './Book'
import {ListAction} from '../actions'

const BookList = React.createClass({

    componentWillMount: function () {
        this.props.getList()
    },

    renderBooks: function () {
        let list = this.props.list

        if (list.length > 0) {
            return this.props.list.map((it) => <Book key={it.id} id={it.id} name={it.name} />)
        }
        else {
            return <p>加载中...</p>
        }
    },

    render: function () {
        console.log('BooksList render')

        return (
            <ul>
                { this.renderBooks() }
            </ul>
        )
    }
})

function mapStateToProps(state) {
    return {
        list: state.list.data
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ListAction, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BookList)
