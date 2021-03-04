import React, { Component } from 'react'
import { Button, Modal } from 'antd';
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import style from './index.module.less'
import memoryUtils from '../../utils/memoryUtils'
import { formateDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'
const { confirm } = Modal;


class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()) //获取当前时间
    }
    // 获取时间方法
    getTime = () => {
        this.setIntervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }
    //动态显示标题
    getTitle = () => {
        let path = this.props.location.pathname
        let title
        menuList.forEach((item) => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) {

                    title = cItem.title
                }
            }
        })
        return title
    }
    //退出登录
    loginOut = () => {
        confirm({
            title: '确定退出登录吗?',
            onOk: () => {
                // 清除内存数据
                memoryUtils.user = {}
                // 清除本地数据
                storageUtils.removeUser()
                // 路由跳转到登录页面
                this.props.history.replace('/login')
            },
        });
    }
    componentDidMount() {
        this.getTime()
    }
    componentWillUnmount() {
        clearInterval(this.setIntervalId)
    }
    render() {
        let username = memoryUtils.user.username
        let { currentTime } = this.state
        let title = this.getTitle()
        return (
            <div className={style.header}>
                <div className={style.headerTop}>
                    <div className={style.weatherInfo}>
                        <span>{currentTime}</span>
                    </div>
                    <p>欢迎您，<span style={{ fontWeight: 500 }}>{username}</span></p>
                    <Button type="link" onClick={this.loginOut} style={{ margin: '0px 10px' }}>退出</Button>
                </div>
                <div className={style.headerBottom}>
                    <h3>{title}</h3>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)