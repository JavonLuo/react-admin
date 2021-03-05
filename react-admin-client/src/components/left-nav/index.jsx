import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import style from './index.module.less'
import { Link, withRouter } from 'react-router-dom'
import menulist from '../../config/menuConfig'
import { Menu, Icon, Layout, Tooltip } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
const { SubMenu } = Menu;
const { Sider } = Layout;


class LeftNav extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };
  // render函数之前先调用gitMenuNodes函数
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menulist)
  }
  // 判断用户权限
  hasAuth = (item) => {
    const { key, isPublic } = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item的权限: key有没有menus中
     */
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) { // 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }

    return false
  }
  getMenuNodes = (menulist) => {
    let path = this.props.location.pathname
    return menulist.map((item) => {
      if (this.hasAuth(item)) {
        if (item.children) {
          // 如果有子级菜单 那么通过数组find方法判断子菜单的key有没有跟路由匹配的路径相等
          const openkey = item.children.find(item => path.indexOf(item.key) === 0)
          // 如果有值 说明当前路由匹配子菜单的某一项 保存到组件对象this中
          if (openkey) {
            this.openkey = item.key
          }

          return (
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          )
        } else {
          return (
            <Menu.Item key={item.key} path={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        }
      } else {
        return null
      }
    })
  }
  render() {
    let path = this.props.location.pathname
    if (path.indexOf('/product') === 0) {
      path = '/product'
    }
    return (
      <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
        <div>
          <Link to='/' className={style.leftNav}>
            <header style={this.state.collapsed ? { justifyContent: 'center' } : null}>
              {

                this.state.collapsed ?
                  <Tooltip placement="right" title={'React 后台'}>
                    <img
                      src={logo}
                      // style={!this.state.collapsed ? { margin: '0px 10px' } : null}
                      alt="" />
                  </Tooltip>
                  :
                  <img
                    title={'React 后台'}
                    src={logo}
                    style={!this.state.collapsed ? { margin: '0px 10px' } : null}
                    alt="" />
              }
              {!this.state.collapsed ?
                <h1>React 后台</h1> : null
              }
            </header>
          </Link>
          <Menu
            mode="inline"
            theme='dark'
            selectedKeys={path}
            defaultOpenKeys={[this.openkey]}
          >
            {this.menuNodes}
          </Menu>
        </div>
      </Sider>
    )
  }
}
export default withRouter(LeftNav)