import React, { Component } from 'react'
// import './index.less'
import style from './index.module.less'
export default class index extends Component {
    render() {
        return (
            <div>
                <h1 className={style.box}>子组件</h1>
            </div>
        )
    }
}
