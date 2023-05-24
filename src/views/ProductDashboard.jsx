import React, { useEffect, useState } from 'react';
import { Button, Modal, Pagination, Table } from 'antd';
import AddProductModal from '../components/Product/AddProductModal';
import EditProductModal from '../components/Product/EditProductModal';

const apiUrl =
  import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000';

const ProductDashboard = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch(`${apiUrl}/api/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error:', error));
  };

  // Pagination configuration
  const pageSize = 10; // Number of products to display per page
  const totalProducts = products.length;

  // Calculate indicies of products to display based on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddModalShow = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleProductCreated = () => {
    setIsAddModalVisible(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleProductUpdated = () => {
    setIsEditModalVisible(false);
    fetchProducts();
  };

  const productTableColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAddModalShow}>
        Add Product
      </Button>
      <AddProductModal
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        onProductCreated={() => {
          handleProductCreated();
        }}
      />
      <EditProductModal
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        onSave={handleProductUpdated}
        product={selectedProduct}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flex: '1',
          //   width: '100vw',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Table
            columns={productTableColumns}
            dataSource={displayProducts}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            total={totalProducts}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
