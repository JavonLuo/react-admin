import React, { Component } from 'react'
import { Card, Button, Icon, Table, message, Modal } from 'antd'
import { reqCategory, reqUpdateCategory, reqAddCategory, reqDelCategory } from '../../api'
import AddForm from '../../components/category-form/add-form'
import UpdateForm from '../../components/category-form/update-form'
import { PAGE_SIZE } from '../../utils/constants'
export default class Category extends Component {
  state = {
    categorys: [],
    loading: false,
    parentId: '0',
    subCategorys: [],
    subName: '',
    confirmLoading: false,
    visible: 0, //0代表modal框不显示 1代表显示修改的modal框 2代表显示修改的

  }
  // 初始化表字段
  initColumns() {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width: '20%',
        // dataIndex: 'address',
        key: 'address',
        render: (category) => {
          return (
            <span>
              <Button type='link' onClick={this.showUpteModal.bind(null, category)}>修改</Button>
              {this.state.parentId === '0' ?
                <Button type='link' onClick={this.showSubCategorys.bind(null, category)}>子分类</Button>
                : null}
              <Button type='link' onClick={() => { this.deleteCategory(category) }}>删除</Button>
            </span>
          )
        }
      },
    ];
  }
  deleteCategory = async (category) => {
    const res = await reqDelCategory(category._id)
    if (res.status === 0) {
      message.success(res.msg)
      // 更新parrentId和subName的值
      this.setState({ parentId: category.parentId }, () => {
        //再发送ajax请求 获取子分类列表
        this.getCategorys()
        // console.log(this.state.parentId);
      })
    } else {
      message.error(res.msg)
    }
  }
  // 显示二级分类列表
  showSubCategorys = (category) => {
    // console.log(category);
    // 更新parrentId和subName的值
    this.setState({ parentId: category._id, subName: category.name }, () => {
      //再发送ajax请求 获取子分类列表
      this.getCategorys()
      // console.log(this.state.parentId);
    })
  }
  // 显示一级分类列表
  showCategorys = () => {
    this.setState({
      parentId: '0',
      subCategorys: [],
      subName: ''
    })
  }
  // 获取一级二级分类列表
  getCategorys = async (parentId) => {
    parentId = parentId || this.state.parentId
    //获取一级分类
    this.setState({ loading: true })
    const result = await reqCategory(parentId)
    this.setState({ loading: false })
    if (result.status === 0) {
      // 如果prentId===0表示更新一级分类列表 否则更新二级分类列表
      if (parentId === '0') {
        this.setState({ categorys: result.data })
      } else {
        this.setState({ subCategorys: result.data })
      }
    } else {
      message.error('获取分类列表失败！')
    }
  }
  // 显示修改modal
  showUpteModal = (category) => {
    this.setState({ visible: 1 })
    this.category = category
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
    this.setState({ visible: 0 })
  }
  // 确定修改
  updateCategory = () => {
    // 校验数据
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 准备数据发送请求
        const categoryId = this.category._id
        // 根据子组件传递过来的form对象下的getFieldValue获取分类名称
        const { categoryName } = values
        // 数据发送的圆圈
        this.setState({ confirmLoading: true })
        const result = await reqUpdateCategory(categoryId, categoryName)
        if (result.status === 0) {
          this.setState({ confirmLoading: false })
          // 隐藏掉弹框
          this.setState({ visible: 0 })
          // 清除输入数据
          this.form.resetFields()
          // 修改成功 重新刷新列表
          this.getCategorys()
        }

      }
    })
  }
  // 确定添加
  addCategory = () => {
    // 校验数据
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 准备发送的数据
        const { parentId, categoryName } = values
        this.setState({ confirmLoading: true })
        const result = await reqAddCategory(parentId, categoryName)
        if (result.status === 0) {
          this.setState({ confirmLoading: false })
          // 隐藏掉弹框
          this.setState({ visible: 0 })
          // 清除输入数据
          this.form.resetFields()
          console.log(parentId, this.state.parentId);
          if (parentId === this.state.parentId) {
            // 如果是当前页就刷新当前列表页
            this.getCategorys()
            // 如果当前页是在二级列表页添加一级列表页 那就刷新一级列表页
          } else if (parentId === '0') {
            this.getCategorys('0')
          }
        }
      }
    })
  }
  componentDidMount() {
    // 异步请求数据
    this.getCategorys()
  }
  componentWillMount() {
    // 初始化字段数组
    this.initColumns()
  }
  render() {
    let { loading, categorys, parentId, subCategorys, subName, confirmLoading } = this.state
    const category = this.category || {}
    let title = parentId === '0' ? '商品分类' : (
      <span>
        <Button type='link' style={{ paddingRight: 0 }}
          onClick={
            this.showCategorys
          }
        >商品分类</Button>
        <Icon type='right' style={{ margin: '0px 5px' }}></Icon>
        {subName}
      </span>
    )
    return (
      <Card title={title} extra={<Button type="primary"
        onClick={this.showAddModal}
      >
        <Icon type='plus'></Icon>
            添加</Button>}>
        <Table
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}
          bordered
          loading={loading}
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
        />;
        <Modal
          title="修改分类"
          visible={this.state.visible === 1 ? true : false}
          onOk={this.updateCategory}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <UpdateForm categoryName={category.name}
            setForm={(form) => { this.form = form }}
          />
        </Modal>
        <Modal
          title="添加分类"
          visible={this.state.visible === 2 ? true : false}
          onOk={this.addCategory}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => { this.form = form }}
          />
        </Modal>
      </Card>

    )
  }
}
