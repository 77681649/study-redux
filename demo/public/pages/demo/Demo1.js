
import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {Demo1 as Demo1Actions} from '../../actions'

import LoadingPanel from '../../components/LoadingPanel'


class GroupList extends Component {

    constructor(props, context, updater) {
        super(props, context, updater)
    }

    asyncGetList() {
        this.props.getGroupList('2016-12-1')
    }

    handleClickItem(groupdId, event) {
        this.changeSelectedGroupId(groupdId);
    }

    componentWillMount() {
        console.log('componentWillMount')
        this.asyncGetList()
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.changeSelectedGroupId(this.props.selected)
    }

    changeSelectedGroupId(selectedId) {
        if (this.props.selected == selectedId || selectedId <= 0) {
            return;
        }

        this.props.changeSelectedGroupId(selectedId)
        this.props.updateGroupResource(selectedId);
    }


    renderList() {
        console.log('render')

        let items = (this.props.list || []).map((it) => {
            let style = it.id == this.props.selected ? { backgroundColor: 'blue' } : null

            return <li
                key={it.id}
                style={style}
                onClick={this.handleClickItem.bind(this, it.id) }>{it.name}</li>
        })

        let list = <ul>{items}</ul>

        return list
    }

    render() {
        return (
            <LoadingPanel
                title="出发团列表"
                loading={this.props.loading}
                content={this.renderList() } />
        )
    }
}

const ConnectedGroupList = connect(
    (state) => {
        const list = state.grouplist;

        return {
            selected: list.selected,
            loading: !!list.loading,
            list: list.data
        }
    },
    (dispatch) => {
        return bindActionCreators(Demo1Actions, dispatch)
    }
)(GroupList)




class GroupFlightList extends Component {
    renderList() {
        let items = (this.props.list || []).map((it) => <li key={it.id} >{it.name}</li>)
        let list = <ul>{items}</ul>

        return list
    }

    render() {
        return (
            <LoadingPanel
                title="出发团机票列表"
                loading={this.props.loading}
                content={this.renderList() } />
        )
    }
}

const ConnectedGroupFlightList = connect(
    (state) => {
        const list = state.groupFlightList;

        return {
            loading: !!list.loading,
            list: list.data
        }
    }
)(GroupFlightList)




class GroupDiscountList extends Component {
    renderList() {
        let items = (this.props.list || []).map((it) => <li key={it.id} >{it.name}</li>)
        let list = <ul>{items}</ul>

        return list
    }

    render() {
        return (
            <LoadingPanel
                title="出发团优惠列表"
                loading={this.props.loading}
                content={this.renderList() } />
        )
    }
}

const ConnectedGroupDiscountList = connect(
    (state) => {
        const list = state.groupDiscountList;

        return {
            loading: !!list.loading,
            list: list.data
        }
    }
)(GroupDiscountList)




class Page extends Component {
    render() {
        return (
            <section>
                <h1>demo1--多模块局部加载</h1>
                <ConnectedGroupList />
                <ConnectedGroupFlightList />
                <ConnectedGroupDiscountList />
            </section>
        )
    }
}

export default Page