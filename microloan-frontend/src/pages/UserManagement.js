import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

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
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role.charAt(0).toUpperCase() + role.slice(1),
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

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (user) => {
    Modal.confirm({
      title: 'Delete User',
      content: `Are you sure you want to delete ${user.name}?`,
      onOk: () => {
        // TODO: Implement delete user
        message.success('User deleted successfully');
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // TODO: Implement update user
        message.success('User updated successfully');
      } else {
        // TODO: Implement create user
        message.success('User created successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('An error occurred');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleAdd}
        >
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={[]} // TODO: Fetch users from API
        rowKey="id"
      />

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
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
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              <Option value="client">Client</Option>
              <Option value="loan_officer">Loan Officer</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input the password!' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 