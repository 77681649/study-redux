
import React, {Component} from 'react'
import {connect} from 'react-redux'

import LoginBox from '../components/LoginBox'

class Home extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <section>
            <h1>Home</h1>
                <LoginBox />
            </section>
        )
    }
}

export default connect()(Home)