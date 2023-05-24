import { Button, Form, Modal, Select, Input } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
const { Option } = Select;

const apiUrl =
  import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000';

const statusOptions = ['Processing', 'Cancelled', 'Delivered'];
const quantityOptions = Array.from({ length: 100 }, (_, index) => index);

const EditOrderModal = ({ visible, onCancel, onSave, order }) => {
  const [form] = Form.useForm();
  const [productLines, setProductLines] = useState(order.products);

  useEffect(() => {
    form.setFieldsValue({
      products: productLines.map((productLine) => productLine.id),
      quantities: productLines.map((productLine) => productLine.quantity),
      status: order.status,
      trackingNumber: order.tracking_number,
    });
  }, [form, order, productLines]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const { products, quantities, status, trackingNumber } = values;

        const updatedOrder = {
          id: order.id,
          products: products.map((productId, index) => ({
            product_id: productId,
            quantity: quantities[index],
          })),
          status,
          tracking: trackingNumber,
        };

        axios
          .put(`${apiUrl}/api/orders/${order.id}`, updatedOrder)
          .then((response) => {
            console.log('Order updated successfully:', response.data);
            form.resetFields();
            onSave();
          })
          .catch((error) => {
            console.error('Error updating order:', error);
          });
      })
      .catch((errorInfo) => {
        console.log('Form validation failed:', errorInfo);
      });
  };

  const handleAddProductLine = () => {
    setProductLines([...productLines, { product_id: null, quantity: null }]);
  };

  const handleRemoveProductLine = (index) => {
    const updatedProductLines = [...productLines];
    updatedProductLines.splice(index, 1);
    setProductLines(updatedProductLines);
  };

  return (
    <Modal
      title="Edit Order"
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
              name={['products', index]}
              label="Product"
              rules={[{ required: true, message: 'Please select a product' }]}
              style={{ marginRight: '16px' }}
            >
              <Select placeholder="Select a product">
                {order.products.map((product) => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={['quantities', index]}
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
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select placeholder="Select a status">
            {statusOptions.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="trackingNumber" label="Tracking Number">
          <Input placeholder="Enter tracking number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditOrderModal;
