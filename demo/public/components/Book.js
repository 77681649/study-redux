import React, { Component , PropTypes } from 'react'
import { Router, Route, Link } from 'react-router'

class Book extends Component{

    render(){
        return (
            <li><Link to={'detail/' + this.props.id}>{this.props.name}</Link></li>
        )
    }
}

Book.propTypes = {
    name : PropTypes.string.isRequired
}

export default Book