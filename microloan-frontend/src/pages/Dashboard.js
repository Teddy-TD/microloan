import React from 'react';
import { Row, Col, Card, Statistic, Table } from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined
} from '@ant-design/icons';

const Dashboard = ({ user }) => {
  const getAdminStats = () => [
    {
      title: 'Total Users',
      value: 0,
      icon: <TeamOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Active Loans',
      value: 0,
      icon: <FileTextOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Pending Approvals',
      value: 0,
      icon: <DollarOutlined />,
      color: '#faad14'
    }
  ];

  const getLoanOfficerStats = () => [
    {
      title: 'Active Borrowers',
      value: 0,
      icon: <TeamOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Pending Loans',
      value: 0,
      icon: <FileTextOutlined />,
      color: '#faad14'
    },
    {
      title: 'Approved Loans',
      value: 0,
      icon: <DollarOutlined />,
      color: '#52c41a'
    }
  ];

  const getClientStats = () => [
    {
      title: 'Active Loans',
      value: 0,
      icon: <FileTextOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Pending Applications',
      value: 0,
      icon: <DollarOutlined />,
      color: '#faad14'
    },
    {
      title: 'Total Repayments',
      value: 0,
      icon: <DollarOutlined />,
      color: '#52c41a'
    }
  ];

  const getStats = () => {
    switch (user.role) {
      case 'admin':
        return getAdminStats();
      case 'loan_officer':
        return getLoanOfficerStats();
      case 'client':
        return getClientStats();
      default:
        return [];
    }
  };

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
      
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        {getStats().map((stat, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {user.role === 'admin' && (
        <Card title="Recent Activities">
          <Table
            columns={[
              { title: 'User', dataIndex: 'user' },
              { title: 'Action', dataIndex: 'action' },
              { title: 'Date', dataIndex: 'date' }
            ]}
            dataSource={[]}
          />
        </Card>
      )}

      {user.role === 'loan_officer' && (
        <Card title="Recent Loan Applications">
          <Table
            columns={[
              { title: 'Borrower', dataIndex: 'borrower' },
              { title: 'Amount', dataIndex: 'amount' },
              { title: 'Status', dataIndex: 'status' },
              { title: 'Action', dataIndex: 'action' }
            ]}
            dataSource={[]}
          />
        </Card>
      )}

      {user.role === 'client' && (
        <Card title="My Recent Loans">
          <Table
            columns={[
              { title: 'Loan ID', dataIndex: 'id' },
              { title: 'Amount', dataIndex: 'amount' },
              { title: 'Status', dataIndex: 'status' },
              { title: 'Due Date', dataIndex: 'dueDate' }
            ]}
            dataSource={[]}
          />
        </Card>
      )}
    </div>
  );
};

export default Dashboard; 