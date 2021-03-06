import React, { Component } from 'react'
//角色路由
import { Card, Button, Table, Modal, message } from 'antd'
import { reqRoles, reqAddRole, reqDeleteRole, reqUpdateRole } from '../../api'
import AddForm from '../../components/role-form/add-form'
import { formateDate } from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'

export default class Role extends Component {
    state = {
        roles: [], //所有的角色列表
        visible: 0,
        loading: false,
        role: {}
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
            {
                title: '操作',
                width: '15%',
                // dataIndex: 'address',
                key: 'address',
                render: (record) => {
                    return (
                        <span>
                            <Button type='link' onClick={() => { this.updateRole(record) }}>修改</Button>
                            <Button type='link' onClick={() => { this.deleteRole(record) }}>删除</Button>
                        </span>
                    )
                }
            },
        ]
    }
    updateRole = async (record) => {
        this.setState({ visible: 2, role: record })
    }
    deleteRole = async (record) => {
        const result = await reqDeleteRole(record._id)
        if (result.status === 0) {
            message.success('删除成功！')
            this.getRoles()
        } else {
            message.error('删除失败！')
        }
    }
    // 提交添加角色
    addRole = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                let { roleName } = values
                const { role } = this.state
                // 清除输入数据
                this.form.resetFields()
                if (role && role.name) {
                    // 如果存在 说明是修改
                    const result = await reqUpdateRole(role, roleName)
                    if (result.status === 0) {
                        message.success('修改成功！')
                        this.setState({ visible: 0, role: {} })
                        this.getRoles()
                    } else {
                        message.error('修改失败！')
                    }
                } else {
                    const result = await reqAddRole(roleName)
                    if (result.status === 0) {
                        message.success('添加成功！')
                        //    隐藏modal框
                        this.setState({ visible: 0 })
                        this.getRoles()
                    } else {
                        message.error('修改失败！')
                    }
                }
            }
        })
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
    // 取消选择
    handleCancel = () => {
        this.setState({ visible: 0, role: {} })
    }

    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, loading, role } = this.state
        const title = (
            <span style={{ marginBottom: 14, display: 'inline-block' }}>
                <Button
                    type='primary'
                    onClick={() => { this.setState({ visible: 2 }) }}
                >创建角色</Button>
            </span>
        )
        return (
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
                <Modal
                    title="创建角色"
                    visible={this.state.visible === 2 ? true : false}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        setForm={(form) => { this.form = form }}
                        role={role}
                    />
                </Modal>
            </Card>
        )
    }
}
