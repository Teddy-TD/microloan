import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ user, onLogout }) => {
  const getMenuItems = () => {
    const baseItems = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: <Link to="/dashboard">Dashboard</Link>,
      },
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: <Link to="/dashboard/profile">My Profile</Link>,
      },
    ];

    if (user.role === 'admin') {
      baseItems.push(
        {
          key: 'users',
          icon: <TeamOutlined />,
          label: <Link to="/dashboard/users">Manage Users</Link>,
        },
        {
          key: 'loans',
          icon: <FileTextOutlined />,
          label: <Link to="/dashboard/loans">Manage Loans</Link>,
        }
      );
    }

    if (user.role === 'loan_officer') {
      baseItems.push(
        {
          key: 'borrowers',
          icon: <TeamOutlined />,
          label: <Link to="/dashboard/borrowers">Manage Borrowers</Link>,
        },
        {
          key: 'loans',
          icon: <FileTextOutlined />,
          label: <Link to="/dashboard/loans">Manage Loans</Link>,
        }
      );
    }

    if (user.role === 'client') {
      baseItems.push(
        {
          key: 'my-loans',
          icon: <FileTextOutlined />,
          label: <Link to="/dashboard/my-loans">My Loans</Link>,
        }
      );
    }

    return baseItems;
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/dashboard/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/dashboard/settings">Settings</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Microloan System</h2>
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={getMenuItems()}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ marginLeft: '8px' }}>{user.name}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '20px', padding: '20px', background: '#fff', minHeight: '280px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout; 