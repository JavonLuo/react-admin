import React, { Component } from "react";
import style from "./login.module.less";
import logo from "../../assets/images/logo.png";
import { Form, Icon, Input, Button, message } from "antd";
import { reqLogin } from "../../api/index";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { Redirect } from "react-router-dom";
class Login extends Component {
  handleSubmit = (e) => {
    //阻止事件的默认行为
    e.preventDefault();
    // 校验和获取表单的值
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let { username, password } = values;
        let result = await reqLogin(username, password);
        if (result.status === 0) {
          message.success("登录成功！");
          // 将登录信息保存到内存
          memoryUtils.user = result.data;
          // 将登录信息保存到本地
          storageUtils.saveUser(result.data);
          // 路由跳转
          this.props.history.replace("/");
        } else {
          message.error(result.msg);
        }
      }
    });
  };
  render() {
    if (memoryUtils.user._id) {
      return <Redirect to="/"></Redirect>;
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={style.login}>
        <header className={style.loginHeader}>
          <img src={logo} alt="" />
          <h1 style={{ margin: 0 }}>React后台管理系统</h1>
        </header>
        <section className={style.loginContent}>
          <h2>
            <Icon type="twitter" style={{ "margin-right": "15px" }} />
            欢迎登录
          </h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "用户名必须输入!",
                  },
                ],
                initialValue: "admin",
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="默认用户：admin"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "密码必须输入!",
                  },
                  { min: 4, message: "密码最少4位!" },
                  { max: 12, message: "密码最多十二位!" },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: "密码必须是英文、数字或者下划线组成!",
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="默认密码：admin"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ width: "100%" }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
// 高阶组件处理 返回给Login组件props中有一个form属性
// form属性下有很多校验的方法
const WrapLogin = Form.create()(Login);
export default WrapLogin;
/*
用户名/密码的合法要求
1.必须输入
2.必须大于4位
3.必须小于12位
4.必须是英文、数字或者下划线组成
*/
