import React, { Component } from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'
class AddForm extends Component {
    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }
    componentWillMount(){
        // 向父组件传递form对象
        this.props.setForm(this.props.form)
    }
    render() {
        const {categoryName} = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Form.Item>
                <p style={{marginBottom:0}}>请输入修改的分类名称：</p>
                {getFieldDecorator('categoryName', {
                   initialValue: categoryName,
                   rules: [{ required: true,whitespace:true,message: '分类名称必须输入!' },]
                  })(<Input placeholder='请输入分类名称'></Input>)} 
                    </Form.Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)