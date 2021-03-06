import React, { Component } from 'react'
//角色路由
import { Card, Button, Table, message } from 'antd'
import { reqRoles, reqUpdate } from '../../api'
import AuthForm from '../../components/role-form/auth-form'
import memoryUtils from '../../utils/memoryUtils.js'
import { formateDate } from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'
import SplitPane from 'react-split-pane'

export default class Auth extends Component {
    state = {
        roles: [], //所有的角色列表
        visible: 0,
        loading: false
    }
    // 创建ref容器对象
    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }
    // 初始化字段
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time, true)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: (auth_time) => formateDate(auth_time, true)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }
    // 获取所有角色列表
    getRoles = async () => {
        this.setState({ loading: true })
        const result = await reqRoles()
        this.setState({ loading: false })
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }
    // 更新角色权限
    updateRole = async () => {
        // 调用子组件的方法 获取最新的menus 和选中的角色
        const role = this.auth.current.getSelectRole()
        if (!role.name) {
            message.warning('请先选择角色')
        } 
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdate(role)
        if (result.status === 0) {
            message.success('角色权限更新成功！')
            this.setState({
                roles: [...this.state.roles]
            })
        }
    }
    // 取消选择
    handleCancel = () => {
        this.setState({ visible: 0 })
    }

    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, loading } = this.state
        const title = (
            <span style={{ marginBottom: 14, display: 'inline-block' }}>
                <Button
                    type='primary'
                    disabled={false}
                    style={{ marginLeft: 10 }}
                    onClick={() => { this.updateRole() }}
                >角色授权</Button>
            </span>
        )
        return (
            <SplitPane split="vertical" minSize={230} maxSize={300} style={{ position: 'unset' }}>
                <AuthForm roles={roles} ref={this.auth}></AuthForm>
                <Card>
                    {title}
                    <Table
                        rowKey='_id'
                        dataSource={roles}
                        columns={this.columns}
                        pagination={{ defaultPageSize: PAGE_SIZE }}
                        // rowSelection={{ type: "radio", selectedRowKeys: [role._id] }}
                        loading={loading}
                    />
                </Card>
            </SplitPane>
        )
    }
}
