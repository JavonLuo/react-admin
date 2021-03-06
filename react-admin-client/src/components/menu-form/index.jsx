import React, { Component } from 'react'
import { Form, Input } from 'antd';
import PropTypes from 'prop-types'
class MenuForm extends Component {
    static propType = {
        name: PropTypes.string,//二级分类列表
        url: PropTypes.string,
        icon: PropTypes.string,
        setForm: PropTypes.func.isRequired
    }
    // 向父级传递form对象
    componentWillMount() {
        this.props.setForm(this.props.form)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { url, icon, title } = this.props
        return (
            <Form>
                <Form.Item
                label={'菜单名称：'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                >
                    {getFieldDecorator('title', {
                        initialValue: title,
                        rules: [{ required: true, whitespace: true, message: '菜单名称必须输入!' },]
                    })(<Input placeholder='请输入菜单名称'></Input>)}
                </Form.Item>
                <Form.Item
                label={'路径URL：'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                >
                    {getFieldDecorator('url', {
                        initialValue: url,
                        rules: [{ required: true, whitespace: true, message: '路径URL必须输入!' },]
                    })(<Input placeholder='请输入路径URL'></Input>)}
                </Form.Item>
                <Form.Item
                label={'图标icon：'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                >
                    {getFieldDecorator('icon', {
                        initialValue: icon,
                        rules: [{ required: true, whitespace: true, message: '图标icon必须输入!' },]
                    })(<Input placeholder='请输入图标icon'></Input>)}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(MenuForm)
