import React, { Component } from 'react'
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types'
const { Option } = Select;
class AddForm extends Component {
    static propType = {
        categorys:PropTypes.array.isRequired,//二级分类列表
        parentId:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }
    // 向父级传递form对象
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const {categorys,parentId} = this.props
        return (
            <Form>
                <Form.Item>
                <p style={{marginBottom:0}}>请选择所属分类：</p>
                {getFieldDecorator('parentId',{
            initialValue: parentId
          })(<Select>
                <Option value='0'>商品分类</Option>
                {
                    categorys.map(item=><Option value={item._id}>{item.name}</Option>)
                }
            </Select>)} 
                </Form.Item>
                <Form.Item>
                <p style={{marginBottom:0}}>请输入分类名称：</p>
                {getFieldDecorator('categoryName', {
            initialValue: '',
            rules: [{ required: true,whitespace:true,message: '分类名称必须输入!' },]
          })(<Input placeholder='请输入分类名称'></Input>)} 
                    </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)
