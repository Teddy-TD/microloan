import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const BorrowerManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBorrower, setEditingBorrower] = useState(null);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Income',
      dataIndex: 'income',
      key: 'income',
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
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </>
      ),
    },
  ];

  const handleEdit = (borrower) => {
    setEditingBorrower(borrower);
    form.setFieldsValue(borrower);
    setIsModalVisible(true);
  };

  const handleDelete = (borrower) => {
    Modal.confirm({
      title: 'Delete Borrower',
      content: `Are you sure you want to delete ${borrower.name}?`,
      onOk: () => {
        // TODO: Implement delete borrower
        message.success('Borrower deleted successfully');
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingBorrower) {
        // TODO: Implement update borrower
        message.success('Borrower updated successfully');
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
        dataSource={[]} // TODO: Fetch borrowers from API
        rowKey="id"
      />

      <Modal
        title="Edit Borrower"
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
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please input a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="income"
            label="Monthly Income"
            rules={[{ required: true, message: 'Please input the income!' }]}
          >
            <Input type="number" />
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

export default BorrowerManagement; 