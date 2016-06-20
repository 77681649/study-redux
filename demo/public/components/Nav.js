'use strict'

import React, {Component} from 'react'
import {Link} from 'react-router'

class LoginButtonBox extends Component {

    render() {
        return (
            <div>
                <Link to="demo/demo1">demo1 - 多子组件局部show/hide loading加载数据</Link>
            </div>
        )
    }
}

export default LoginButtonBox