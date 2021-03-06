import React, { Component } from 'react'
import { Card, Button, Icon, Table, message, Modal } from 'antd'
import { reqAddMenu, reqUpdateMenu, reqDeleteMenu } from '../../api'
import MenuForm from '../../components/menu-form'
import { PAGE_SIZE } from '../../utils/constants'
import SearchTree from './search-tree'
import SplitPane from 'react-split-pane'
export default class Menu extends Component {
  state = {
    tableData: [],
    addComponentCategorys: [],
    loading: false,
    isUpdate: false,
    confirmLoading: false,
    visible: 0, //0代表modal框不显示 1代表显示修改的modal框 2代表显示修改的
    menu: {}, // 当前操作的menu
    _id: undefined,  // 当前点击的菜单分类
  }
  // 初始化表字段
  initColumns() {
    this.columns = [
      {
        title: '菜单名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '路径URL',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: '图标Icon',
        dataIndex: 'icon',
        key: 'icon',
      },
      {
        title: '操作',
        width: '15%',
        // dataIndex: 'address',
        key: 'address',
        render: (menu) => {
          return (
            <span>
              <Button type='link' onClick={this.showUpteModal.bind(null, menu)}>修改</Button>
              <Button type='link' onClick={() => { this.deleteMenu(menu) }}>删除</Button>
            </span>
          )
        }
      },
    ];
  }
  deleteMenu = async (record) => {
    let res = {}
    if (record._id) {
       res = await reqDeleteMenu(record._id)
    } else {
       res = await reqDeleteMenu(this.state._id, record.key)
    }
    if (res.status === 0) {
      message.success(res.msg)
      this.setState({ isUpdate: Math.random()*100 })
    } else {
      message.error(res.msg)
    }
  }
  // 显示修改modal
  showUpteModal = (menu) => {
    this.setState({ visible: 1 })
    // this.menu = menu
    this.setState({ menu })
  }
  // 显示添加modal
  showAddModal = () => {
    this.setState({ visible: 2 })
  }
  // 取消修改和添加
  handleCancel = () => {
    // 清除输入数据
    this.form.resetFields()
    // 隐藏弹话框
    this.setState({ visible: 0, menu: {} })
  }
  // 确定新增
  addMenu = () => {
    // 校验数据
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 准备数据发送请求
        values.key = values.url
        // 数据发送的圆圈
        this.setState({ confirmLoading: true })
        const result = await reqAddMenu(values, this.state._id)
        if (result.status === 0) {
          message.success('新增成功！')
          this.setState({ confirmLoading: false })
          // 隐藏掉弹框
          this.setState({ visible: 0, isUpdate: Math.random() * 100 })
          // 清除输入数据
          this.form.resetFields()
        } else {
          message.error('新增失败！')
        }

      }
    })
  }
  // 确定修改
  updateMenu = () => {
    // 校验数据
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 准备发送的数据
        values.key = values.url
        this.setState({ confirmLoading: true })
        const result = await reqUpdateMenu(values, this.state.menu._id)
        if (result.status === 0) {
          message.success('修改成功！')
          this.setState({ confirmLoading: false })
          // 隐藏掉弹框
          this.setState({ visible: 0, isUpdate: Math.random() * 100 })
          // 清除输入数据
          this.form.resetFields()
        } else {
          message.error('修改失败！')
        }
      }
    })
  }
  getTableData = (tableData, loading, _id) => {
    if (!tableData) {
      this.setState({ loading: loading, _id })
    } else {
      this.setState({ tableData, loading: loading, _id })
    }
  }
  resetIsUpdate = () => {
    this.setState({ isUpdate: false })
  }
  componentDidMount() {
  }
  componentWillMount() {
    // 初始化字段数组
    this.initColumns()
  }
  render() {
    let { loading, tableData, confirmLoading, isUpdate, menu } = this.state
    const category = this.category || {}
    return (
      <SplitPane split="vertical" minSize={230} maxSize={300} style={{ position: 'unset' }}>
        <SearchTree getTableData={this.getTableData} isUpdate={isUpdate ? this.resetIsUpdate : null} />
        <Card>
          <div style={{ marginBottom: 14 }}>
            <Button type="primary"
              onClick={this.showAddModal}
            >
              <Icon type='plus'></Icon>
            添加</Button>
          </div>
          <Table
            dataSource={tableData}
            columns={this.columns}
            loading={loading}
            rowKey='_id'
            pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
          />
          <Modal
            title={this.state.visible === 1 ? "修改菜单" : "新增菜单"}
            visible={this.state.visible !== 0}
            onOk={this.state.visible === 1 ?  this.updateCategory : this.addMenu}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <MenuForm categoryName={category.name} { ...menu }
              setForm={(form) => { this.form = form }}
            />
          </Modal>
        </Card>
      </SplitPane>
    )
  }
}
