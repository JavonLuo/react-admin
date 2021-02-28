import React, { Component } from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'
import ProductHome from './product-home'
import ProductAddUpdate from './product-add-update'
import ProductDetail from './product-detail'
//产品路由
export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' component={ProductHome} exact ></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
                <Redirect to='/product'></Redirect>
            </Switch>
        )
    }
}
