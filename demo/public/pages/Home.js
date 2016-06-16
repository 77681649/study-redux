
import React, {Component, PropTypes} from 'react'

import LoginBox from '../components/LoginBox'

class Home extends Component {

    goList(){
        this.props.history.pushState(null, '/list');
    }

    render() {
        return (
            <section>
                <h1>Home</h1>
                <LoginBox goList={()=>this.goList()} />
            </section>
        )
    }
}

export default Home