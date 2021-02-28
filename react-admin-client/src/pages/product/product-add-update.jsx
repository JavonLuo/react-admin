import React, { Component } from 'react'
import { Card, Form, Input, Button, Icon, Cascader, message } from 'antd'
import { reqCategory, reqAddOrUpdateProduct } from '../../api'
import PicturesWall from '../../components/product-pictures-wall/pictures-wall'
import RichTextEditor from '../../components/rich-text-editor'

const { Item } = Form
const { TextArea } = Input
class ProductAddUpdate extends Component {
    constructor(props) {
        super(props)
        this.pw = React.createRef() //创建一个容器对象 用来保存子组件的实例对象
        this.editor = React.createRef()  //富文本编辑器
    }
    state = {
        options: []
    }
    loadData = async selectedOptions => {
        // 点击的每一项
        const targetOption = selectedOptions[0]
        // 开启loading
        targetOption.loading = true;
        // 异步获取二级分类
        const data = await this.getCategory(targetOption.value)
        // 判断是否有二级分类
        if (data && data.length > 0) {
            // 处理chidOption
            const childOption = data.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }))
            targetOption.children = childOption
        } else {
            // 没有就是叶子
            targetOption.isLeaf = true
        }
        // 隐藏loading
        targetOption.loading = false;

        // 更新状态
        this.setState({
            options: [...this.state.options],
        })
    }
    // 自定义验证价格输入必须大于0
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback()
        } else {
            callback('用户名必须大于0！')
        }
    }
    // 添加商品提交
    submit = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // 收集数据
                let { name, desc, price, categoryIds } = values
                let pCategoryId;
                let categoryId
                if (categoryIds.length > 1) {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                } else {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                }
                let _id = this.product._id
                // 调用子组件的方法 获取imgs（图片的名称）
                const imgs = this.pw.current.getImgs()
                // 调用子组件的方法获取富文本编辑器的内容
                const detail = this.editor.current.getDetail()
                // 封装成product对象
                let product = { name, desc, price, pCategoryId, categoryId, imgs, detail, _id }
                // 发送请求
                const result = await reqAddOrUpdateProduct(product)
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '修改' : '添加'}商品成功！`)
                    this.props.history.go(-1)
                } else {
                    message.error(`${this.isUpdate ? '修改' : '添加'}商品失败！`)
                }
            }
        })
    }
    // 获取一级/二级分类列表
    getCategory = async (pCategoryId) => {
        const result = await reqCategory(pCategoryId)
        if (result.status === 0) {
            // 如果等于0 说明是一级分类
            if (pCategoryId === '0') {
                this.initOption(result.data)
            } else {
                // 否则就是二级列表
                return result.data
            }
        }
    }
    // 初始化一级分类列表
    initOption = async (categorys) => {
        // 处理数据
        const options = categorys.map(item => ({
            value: item._id,
            label: item.name,
            isLeaf: false,
        }))
        // 如果是二级分类的商品更新
        const { pCategoryId } = this.product
        const { isUpdate } = this
        if (isUpdate && pCategoryId !== '0') {
            const subCategorys = await this.getCategory(pCategoryId)
            // 生成下拉列表的options
            const childOption = subCategorys.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true,
            }))
            // 关联到一级options上面
            const targetOption = options.find(item => item.value === pCategoryId)
            targetOption.children = childOption
        }
        // 更新状态
        this.setState({ options })
    }
    componentDidMount() {
        this.getCategory('0')
    }
    componentWillMount() {
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}

    }
    render() {
        const { isUpdate, product } = this
        const { getFieldDecorator } = this.props.form
        const { categoryId, pCategoryId, imgs, detail } = product
        // 分类的初始值
        const categoryIds = []
        // 如果父分类id等于0 说明是一级分类
        if (pCategoryId === '0') {
            categoryIds.push(categoryId)
            // 否则就有二级分类
        } else {
            categoryIds.push(pCategoryId)
            categoryIds.push(categoryId)
        }
        // 表单的layout布局 默认24格
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        }
        // Card标题
        const title = (
            <span style={{ fontSize: 20 }}>
                <Button type='link'
                    style={{ fontSize: 20 }}
                    onClick={() => {
                        this.props.history.go(-1)
                    }}
                >
                    <Icon type="left-circle" />
                </Button>
                {isUpdate ? '修改商品' : '添加商品'}
            </span>
        )
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [{ required: true, message: '商品名称必须输入！' }],
                        })(
                            <Input></Input>
                        )}
                    </Item>
                    <Item label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [{ required: true, message: '商品描述必须输入！' }],
                        })(
                            <TextArea
                                autosize={{ minRows: 2, maxRows: 6 }}
                            />
                        )}
                    </Item>
                    <Item label="商品价格">
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [{ required: true, message: '商品价格必须输入！' },
                            { validator: this.validatePrice }],
                        })(
                            <Input prefix="￥" addonAfter="RMB" type='number' />
                        )}
                    </Item>
                    <Item label="商品分类">
                        {getFieldDecorator('categoryIds', {
                            initialValue: categoryIds,
                            rules: [{ required: true, message: '商品分类必须指定！' }],
                        })(
                            <Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                                onChange={this.onChange}
                                changeOnSelect
                            />
                        )}
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
                    </Item>
                    <Item
                        label="商品详情"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
                    </Item>
                </Form>
                <Button
                    type='primary'
                    style={{ marginLeft: 35 }}
                    onClick={this.submit}
                >提交</Button>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)

/*
1.子组件调用父组件的方法：将父组件的方法以函数属性的方式传递给子组件 子组件就可以调用
2.父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
*/