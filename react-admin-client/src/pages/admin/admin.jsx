import React, { Component } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Route, Switch } from 'react-router-dom'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
// admin子路由
import Home from '../home/home'
import Product from '../product/product'
import Category from '../category/category'
import Role from '../role/role'
import Auth from '../role/auth'
import User from '../user/user'
import Pie from '../charts/pie'
import Line from '../charts/line'
import Bar from '../charts/bar'
import Order from '../order/order'
import Menu from '../menu/menu'
import { reqMenu } from '../../api'
import { Spin } from 'antd'
import store from 'store'

import { Layout } from 'antd';
const { Footer, Content } = Layout;
export default class admin extends Component {
    state = {
        isRender: false,
    }
    componentDidMount() {
        this.getMenu()
    }
    getMenu = async () => {
        const result = await reqMenu()
        store.set('menus', result.data)
        this.setState({ isRender: true })
    }
    render() {
        if (!memoryUtils.user._id) {
            return <Redirect to='/login'></Redirect>
        }
        if (!this.state.isRender) {
            return (
                <div style={{
                    width: '100%',
                    height: "100%",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Spin />
                </div>
            )
        }
        return (
            <Layout style={{ minHeight: '100%' }}>
                <LeftNav></LeftNav>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{ backgroundColor: 'white', margin: 20 }}>
                        <Switch>
                            <Route path='/home' component={Home}></Route>
                            <Route path='/category' component={Category}></Route>
                            <Route path='/product' component={Product}></Route>
                            <Route path='/role' component={Role}></Route>
                            <Route path='/auth' component={Auth}></Route>
                            <Route path='/charts/pie' component={Pie}></Route>
                            <Route path='/charts/line' component={Line}></Route>
                            <Route path='/charts/bar' component={Bar}></Route>
                            <Route path='/user' component={User}></Route>
                            <Route path='/menu' component={Menu}></Route>
                            <Route path='/order' component={Order}></Route>
                            <Redirect to='/home'></Redirect>
                        </Switch>

                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#aaa' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
