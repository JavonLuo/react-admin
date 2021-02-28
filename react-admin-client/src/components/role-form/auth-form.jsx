import React, { Component } from 'react'
import { Form, Input,Tree } from 'antd';
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'


const { TreeNode } = Tree;


export default class AuthForm extends Component {
    static propType = {
        role:PropTypes.object
    }
    constructor(props){
        super(props)
        const {menus} = this.props.role
        this.state = {checkedKeys: menus}
    }
    // 监听props的变化
    componentWillReceiveProps(nextProps){
       const menus = nextProps.role.menus
       this.setState({
           checkedKeys:menus
       })
    }
    // 监听权限的选举
    onCheck = checkedKeys =>{
        this.setState({checkedKeys})
    }
    // 为父组件提交获取最新的menus数据的方法
    getMenus = () => this.state.checkedKeys

    // 获取权限列表
    getTreeNodes = (menuList)=>{
        return  menuList.map(item=>{
            return  (<TreeNode title={item.title} key={item.key} >
                {item.children?this.getTreeNodes(item.children):null}
            </TreeNode>)
            })
        }
    componentWillMount(){
        this.treeNodes = this.getTreeNodes(menuList)
    }
    render() {
        const {checkedKeys} = this.state
        return (
            <div>
                <Form.Item 
                label="角色名称" 
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 15 }}
                >
                <Input placeholder={this.props.role.name} disabled></Input>
                    </Form.Item>
                    <Tree
                checkable
                defaultExpandAll={true}
                checkedKeys={checkedKeys}
                onCheck={this.onCheck}
                 >
                <TreeNode title="平台权限" key="all">
                {this.treeNodes}
                </TreeNode>
             </Tree>
            </div>
        )
    }
}


