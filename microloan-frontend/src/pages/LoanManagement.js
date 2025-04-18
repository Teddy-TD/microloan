import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { FileTextOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

const LoanManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);

  const columns = [
    {
      title: 'Loan ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Borrower',
      dataIndex: 'borrower',
      key: 'borrower',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record)}
          />
          <Button
            type="text"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleReject(record)}
          />
        </>
      ),
    },
  ];

  const handleEdit = (loan) => {
    setEditingLoan(loan);
    form.setFieldsValue(loan);
    setIsModalVisible(true);
  };

  const handleApprove = (loan) => {
    Modal.confirm({
      title: 'Approve Loan',
      content: `Are you sure you want to approve loan ${loan.id}?`,
      onOk: () => {
        // TODO: Implement approve loan
        message.success('Loan approved successfully');
      },
    });
  };

  const handleReject = (loan) => {
    Modal.confirm({
      title: 'Reject Loan',
      content: `Are you sure you want to reject loan ${loan.id}?`,
      onOk: () => {
        // TODO: Implement reject loan
        message.success('Loan rejected successfully');
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingLoan) {
        // TODO: Implement update loan
        message.success('Loan updated successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('An error occurred');
    }
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={[]} // TODO: Fetch loans from API
        rowKey="id"
      />

      <Modal
        title="Edit Loan"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please input the amount!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status!' }]}
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoanManagement; 