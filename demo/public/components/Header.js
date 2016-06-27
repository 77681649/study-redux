import React, { Component , PropTypes } from 'react'

class Header extends Component{

    render(){
        return (
            <header className="header">
                <a href="#">后退</a>
                <h1>{this.props.title}</h1>
                <a href="#">首页</a>
            </header>
        )
    }
}

export default Header