
import React, {Component, PropTypes} from 'react'

import Nav from '../components/Nav'
import LoginBox from '../components/LoginBox'
import Header from '../components/Header'

class Home extends Component {

    goList(){
        this.props.history.pushState(null, '/list');
    }

    render() {
        return (
            <section>
                <Nav />
                <Header title='Home' />
                <LoginBox goList={()=>this.goList()} />
            </section>
        )
    }
}

export default Home