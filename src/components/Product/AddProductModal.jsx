import { Button, Form, Input, Modal, Select } from 'antd';
import axios from 'axios';
const { Option } = Select;

const apiUrl =
  import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000';

const quantityOptions = Array.from({ length: 100 }, (_, index) => index);

const AddProductModal = ({ visible, onCancel, onProductCreated }) => {
  const [form] = Form.useForm();

  const saveProduct = (values) => {
    axios
      .post(`${apiUrl}/api/products`, values)
      .then((response) => {
        console.log('Product created successfully:', response.data);
        form.resetFields();
        onProductCreated();
      })
      .catch((error) => {
        console.error('Error creating product:', error);
      });
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        saveProduct(values);
      })
      .catch((errorInfo) => {
        console.log('Form validation failed:', errorInfo);
      });
  };

  return (
    <Modal
      title="Add Product"
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

export default AddProductModal;
