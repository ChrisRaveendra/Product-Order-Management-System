import { Button, Form, Modal, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
const { Option } = Select;

const apiUrl =
  import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000';

const quantityOptions = Array.from({ length: 100 }, (_, index) => index);

interface AddOrderModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({
  visible,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [productLines, setProductLines] = useState([
    { product: null, quantity: null },
  ]);
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    axios
      .get(`${apiUrl}/api/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const order = {
          products: productLines.map((productLine, idx) => ({
            product_id: values[`products[${idx}]`][0],
            quantity: values[`quantities[${idx}]`],
          })),
        };

        axios
          .post(`${apiUrl}/api/orders`, order)
          .then((response) => {
            console.log('Order created successfully:', response.data);
            onSave();
            form.resetFields();
            setProductLines([{ product: null, quantity: null }]);
          })
          .catch((error) => {
            console.error('Error creating order:', error);
          });
      })
      .catch((errorInfo) => {
        console.log('Form validation failed:', errorInfo);
      });
  };

  const handleAddProductLine = () => {
    setProductLines([...productLines, { product: null, quantity: null }]);
  };

  const handleRemoveProductLine = (index) => {
    const updatedProductLines = [...productLines];
    updatedProductLines.splice(index, 1);
    setProductLines(updatedProductLines);
  };

  return (
    <Modal
      title="Create Order"
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
      <Form form={form} layout="vertical">
        {productLines.map((productLine, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '16px' }}>
            <Form.Item
              name={`products[${index}]`}
              label="Product"
              rules={[{ required: true, message: 'Please select a product' }]}
              style={{ marginRight: '16px' }}
            >
              <Select mode="multiple" placeholder="Select a product">
                {products.map((product) => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={`quantities[${index}]`}
              label="Quantity"
              rules={[{ required: true, message: 'Please select a quantity' }]}
              style={{ marginRight: '16px' }}
            >
              <Select placeholder="Select a quantity">
                {quantityOptions.map((quantity) => (
                  <Option key={quantity} value={quantity}>
                    {quantity}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              danger
              onClick={() => handleRemoveProductLine(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="dashed"
          onClick={handleAddProductLine}
          style={{ width: '100%' }}
        >
          Add Product
        </Button>
      </Form>
    </Modal>
  );
};

export default AddOrderModal;
