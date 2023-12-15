import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Row, Col } from 'antd';
import { useRouter } from 'next/router';


const App = () => {
  const router = useRouter();

  // Predefined username and password (example, use secure authentication methods in a real application)
  const validUsername = 'user';
  const validPassword = 'password';

  const onFinish = (values) => {
    const { username, password } = values;

    // Check username and password
    if (username === validUsername && password === validPassword) {
      console.log('Login successful!');
      // Successful login, navigate to the main page
      router.push('/MainPage');
    } else {
      console.log('Login failed!');
      // Failed login, display error message
      message.error('Invalid username or password');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
   
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col span={8}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            {/* <a className="login-form-forgot" href="">
              Forgot password
            </a> */}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </Col>
    </Row>  
    </main>
    
  );
};

export default App;
