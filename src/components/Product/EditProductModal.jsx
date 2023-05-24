import { Button, Form, Input, Modal, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
const { Option } = Select;

const apiUrl =
  import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000';

const quantityOptions = Array.from({ length: 100 }, (_, index) => index);

const EditProductModal = ({ visible, onCancel, product, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(product);
  }, [product]);

  const updateProduct = (productId, values) => {
    axios
      .put(`${apiUrl}/api/products/${productId}`, values)
      .then((response) => {
        console.log('Product updated successfully:', response.data);
        form.resetFields();
        onSave();
      })
      .catch((error) => {
        console.error('Error updating product:', error);
      });
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const productId = product.id;
        updateProduct(productId, values);
      })
      .catch((errorInfo) => {
        console.log('Form validation failed:', errorInfo);
      });
  };

  return (
    <Modal
      title="Edit Product"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter the product name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[
            { required: true, message: 'Please enter the product price' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[
            { required: true, message: 'Please enter the product quantity' },
          ]}
        >
          <Select mode="Single" placeholder="Select quantities">
            {quantityOptions.map((quantity) => (
              <Option key={quantity} value={quantity}>
                {quantity}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
