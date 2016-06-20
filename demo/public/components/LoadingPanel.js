'use strict';

import React, {Component} from 'react'

// 带loading功能的面板
class LoadingPanel extends Component {
    render() {
        let content

        if (this.props.loading) {
            content = <div className="loading">加载中...</div>
        }
        else {
            content = <div className="content">{this.props.content}</div>
        }

        return (
            <div>
                <div>{this.props.title}</div>
                <div>
                    {content}
                </div>
            </div>
        )
    }
}

LoadingPanel.defaultProps = {
    title: 'loadingPanel',
    content: null
};

export default LoadingPanel