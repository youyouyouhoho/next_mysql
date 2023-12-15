import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  EditOutlined,
  FileSearchOutlined,SearchOutlined,TableOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import AdvisorExcel from './components/AdvisorExcel';
import CommitteeMembersExcel from './components/CommitteeMembersExcel';
import StudentExcel from './components/StudentExcel';
import PreDefenseExcel from './components/PreDefenseExcel';
import ReviewInfoExcel from './components/ReviewInfoExcel';
import DefenseInfoExcel from './components/DefenseInfoExcel';
import SelectFromTest from './select';

const { Header, Sider, Content } = Layout;

const MainPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('1'); // Default selected menu item

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '1',
      icon: <TableOutlined />,
      label: '导师信息表',
      component: <AdvisorExcel />,
    },
    {
      key: '2',
      icon: <TableOutlined />,
      label: '委员信息表',
      component: <CommitteeMembersExcel />,
    },
    {
      key: '3',
      icon: <TableOutlined />,
      label: '学生信息表',
      component: <StudentExcel />,
    },
    {
      key: '4',
      icon: <TableOutlined />,
      label: '预答辩场次信息表',
      component: <PreDefenseExcel />,
    },
    {
      key: '5',
      icon: <TableOutlined />,
      label: '评阅场次信息表',
      component: <ReviewInfoExcel />,
    },
    {
      key: '6',
      icon: <TableOutlined />,
      label: '答辩场次信息表',
      component: <DefenseInfoExcel />,
    },
    {
      key: '7',
      icon: <div><SearchOutlined /><EditOutlined />
        </div>,
      label: '查询/编辑',
      component: <SelectFromTest />,
    },
  ];

  const handleMenuClick = ({ key }) => {
    setSelectedMenuItem(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedMenuItem]}
          onClick={handleMenuClick}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {menuItems.find((item) => item.key === selectedMenuItem)?.component}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainPage;