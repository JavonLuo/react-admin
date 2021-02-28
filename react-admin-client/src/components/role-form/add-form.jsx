import React, { Component } from 'react'
import { Form, Input } from 'antd';
import PropTypes from 'prop-types'
class AddForm extends Component {
    static propType = {
        setForm:PropTypes.func.isRequired
    }
    // 向父级传递form对象
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Form.Item 
                label="角色名称" 
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 15 }}
                >
                {getFieldDecorator('roleName', {
            initialValue: '',
            rules: [{ required: true,whitespace:true,message: '角色名称必须输入!' },]
          })(<Input placeholder='请输入角色名称'></Input>)} 
                    </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)
