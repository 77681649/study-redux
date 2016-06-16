import React, { Component , PropTypes } from 'react'


class News extends Component{

    render(){
        return (
            <li><a href="#">{this.props.name}</a></li>
        )
    }
}

News.propTypes = {
    name : PropTypes.string.isRequired
}

export default News