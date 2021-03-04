import React, { Component } from 'react'
//角色路由
import {Card,Button,Table,Modal, message} from 'antd'
import {reqRoles,reqAddRole,reqUpdate} from '../../api'
import AddForm from '../../components/role-form/add-form'
import AuthForm from '../../components/role-form/auth-form'
import memoryUtils from '../../utils/memoryUtils.js'
import {formateDate} from '../../utils/dateUtils'
import {PAGE_SIZE} from '../../utils/constants'

export default class Role extends Component {
    state = {
        roles:[], //所有的角色列表
        role:{}, //选中的角色
        visible:0,
        loading:false
    }
    // 创建ref容器对象
    constructor(props){
        super(props)
        this.auth = React.createRef()
    }
    // 初始化字段
    initColumns = ()=>{
        this.columns = [
            {
              title: '角色名称',
              dataIndex: 'name',
            },
            {
              title: '创建时间',
              dataIndex: 'create_time',
              render:(create_time)=>formateDate(create_time,true)
            },
            {
              title: '授权时间',
              dataIndex: 'auth_time',
              render:(auth_time)=>formateDate(auth_time,true)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
          ]
    }
    // 提交添加角色
    addRole = ()=>{
        this.form.validateFields(async(err, values) => {
        // console.log(values);
        if(!err){
            let {roleName} = values
            // 清除输入数据
            this.form.resetFields()
           const result = await reqAddRole(roleName)
           if(result.status===0){
               message.success('添加角色成功！')
            //    隐藏modal框
               this.setState({visible:0})
               this.setState(state=>({
                   roles:[...state.roles,result.data]
               }))
           }else{
               message.error('添加角色失败！')
           }
        }
        })
    }
        
    // 获取所有角色列表
    getRoles = async()=>{
        this.setState({loading:true})
       const result = await reqRoles()
       this.setState({loading:false})
       if(result.status===0){
          const roles = result.data
           this.setState({roles})
       }
    }
    // 更新角色权限
    updateRole = async()=>{
        // 隐藏确认框
        this.setState({visible:0})
        const role = this.state.role
        // 调用子组件的方法 获取最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        // console.log(menus);
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdate(role)
        if(result.status===0){
            message.success('角色权限更新成功！')
            this.setState({
                roles:[...this.state.roles]
            })
        }
    }
    // 点击选中
    onRow = (role)=>{
        this.setState({role})
    }
    // 取消选择
    handleCancel = ()=>{
        this.setState({visible:0})
    }

    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getRoles()
    }
    render() {
        const {role,roles,loading} = this.state
        const title = (
            <span style={{marginBottom: 14, display: 'inline-block'}}>
                <Button 
                type='primary'
                onClick={()=>{this.setState({visible:2})}}
                >创建角色</Button>
                <Button 
                type='primary' 
                disabled={role._id?false:true} 
                style={{marginLeft:10}}
                onClick={()=>{this.setState({visible:1})}}
                >设置用户权限</Button>
            </span>
        )
        return (
            <Card>
            {title}
                <Table 
                rowKey='_id'
                dataSource={roles} 
                columns={this.columns}
                pagination={{defaultPageSize: PAGE_SIZE}}
                rowSelection={{type:"radio",selectedRowKeys:[role._id]}}
                loading={loading}
                onRow={role => {
                return {
                    onClick: event => {this.onRow(role)}, // 点击行
                };
                }}
                />
            <Modal
                title="设置用户权限"
                visible={this.state.visible===1?true:false}
                onOk={this.updateRole}
                onCancel={this.handleCancel}
                 >
                <AuthForm role={role} ref={this.auth}></AuthForm>
                </Modal>
                 <Modal
                title="创建角色"
                visible={this.state.visible===2?true:false}
                onOk={this.addRole}
                onCancel={this.handleCancel}
                 >
                <AddForm 
                setForm={(form)=>{this.form = form}}
                />
             </Modal>



            </Card>
        )
    }
}
