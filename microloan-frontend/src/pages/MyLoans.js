import React from 'react';
import { Table, Button, Tag } from 'antd';
import { FileTextOutlined, DollarOutlined } from '@ant-design/icons';

const MyLoans = () => {
  const columns = [
    {
      title: 'Loan ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        switch (status) {
          case 'approved':
            color = 'success';
            break;
          case 'pending':
            color = 'warning';
            break;
          case 'rejected':
            color = 'error';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          {record.status === 'approved' && (
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={() => handleMakePayment(record)}
            >
              Make Payment
            </Button>
          )}
        </>
      ),
    },
  ];

  const handleMakePayment = (loan) => {
    // TODO: Implement payment functionality
    console.log('Making payment for loan:', loan.id);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          icon={<FileTextOutlined />}
          onClick={() => {
            // TODO: Implement apply for loan
            console.log('Apply for new loan');
          }}
        >
          Apply for Loan
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={[]} // TODO: Fetch user's loans from API
        rowKey="id"
      />
    </div>
  );
};

export default MyLoans; 