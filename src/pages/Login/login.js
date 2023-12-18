import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Input, notification } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import userApi from "../../apis/userApi";
import './login.css'; // Use a proper naming convention for CSS files


const Login = () => {
  const [isLogin, setLogin] = useState(true);
  const history = useHistory();

  const onFinish = async (values) => {
    try {
      const response = await userApi.login(values.email, values.password);
      if(response.status == 0){
        notification.error({
          message: 'Thông báo',
          description: 'Bạn không có quyền truy cập vào hệ thống',
        });
        return
      }
      if (!response.role) {
       return setLogin(false);
      } 
      if (response.role === "trưởng nhóm") {
        return history.push('/campaign-management');
      }

      if (response.role === "trưởng ban kế hoạch") {
        return history.push('/campaign-management');
      }

      if (response.role === "trưởng ban sự kiện") {
        return history.push('/task-reports-management');
      }

      if (response.role === "kế toán") {
        return history.push('/task-reports-management');
      }

      if (response.role === "Admin") {
        history.push('/account-management');
      } else {
        notification.error({
          message: 'Thông báo',
          description: 'Bạn không có quyền truy cập vào hệ thống',
        });
      }
    } catch (error) {
      console.log('Failed to fetch ping role: ' + error);
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <Form
          className="login-form"
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <div className="form-header">
            <Divider orientation="center">Welcome to Volunteer Campaign!</Divider>
            <p className="form-subtitle">Đăng nhập để vào hệ thống quản lý</p>
          </div>
          {!isLogin && (
            <Alert message="Tài khoản hoặc mật khẩu sai" type="error" showIcon />
          )}
          <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập password!' }]}>
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button className="login-button" type="primary" htmlType="submit">
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Login;