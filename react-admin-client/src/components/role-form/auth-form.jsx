import React, { Component } from 'react'
import { Form, Tree, Select } from 'antd';
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const { Option } = Select
const { TreeNode } = Tree;


export default class AuthForm extends Component {
    static propType = {
        role: PropTypes.object
    }
    constructor(props) {
        super(props)
        // const { menus } = this.props.role
        this.state = { 
            checkedKeys: [],
            roles: [],
            role: {}
        }
    }
    // 监听props的变化
    componentWillReceiveProps(nextProps) {
        const roles = nextProps.roles
        this.setState({
            roles
        })
    }
    // 监听权限的选举
    onCheck = checkedKeys => {
        this.setState({ checkedKeys })
    }
    // 为父组件提交获取最新的menus数据的方法
    getMenus = () => this.state.checkedKeys
    // 为父组件获取选中的角色
    getSelectRole = () => this.state.role
    // 获取权限列表
    getTreeNodes = (menuList) => {
        return menuList.map(item => {
            return (<TreeNode title={item.title} key={item.key} >
                {item.children ? this.getTreeNodes(item.children) : null}
            </TreeNode>)
        })
    }
    handleChange = (_id) => {
        const { roles } = this.state
        roles.forEach(v => {
            if (v._id === _id) {
                this.setState({checkedKeys: v.menus, role: v})
                return
            }
        })
    }
    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }
    render() {
        const { checkedKeys, roles } = this.state
        return (
            <div style={{ padding: '20px 0px 24px 24px' }}>
                <Form.Item
                    label="角色"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    style={{ marginBottom: 12 }}
                >
                    <Select
                    placeholder={'请选择角色'}
                    onChange={this.handleChange}
                    >
                        {
                            roles.map(v => (
                                <Option value={v._id} key={v._id}>{v.name}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                    disabled={!this.state.role.name}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}


