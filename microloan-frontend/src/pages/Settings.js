import React, { useState } from 'react';
import { Card, Form, Switch, Button, message } from 'antd';
import { BellOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // TODO: Implement settings update
      message.success('Settings updated successfully');
    } catch (error) {
      message.error('An error occurred while updating settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card title="Account Settings">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            emailNotifications: true,
            smsNotifications: false,
            twoFactorAuth: false,
          }}
        >
          <Form.Item
            name="emailNotifications"
            label="Email Notifications"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<MailOutlined />}
              unCheckedChildren={<MailOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="smsNotifications"
            label="SMS Notifications"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<BellOutlined />}
              unCheckedChildren={<BellOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="twoFactorAuth"
            label="Two-Factor Authentication"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<LockOutlined />}
              unCheckedChildren={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 