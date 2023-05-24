import { useEffect, useState } from 'react';
import { Button, Pagination, Table } from 'antd';
import AddOrderModal from '../components/Order/AddOrderModal';
import EditOrderModal from '../components/Order/EditOrderModal';
import axios from 'axios';

const apiUrl =
  import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000';

const OrderDashboard = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get(`${apiUrl}/api/orders`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  };

  // Pagination configuration
  const pageSize = 10; // Number of products to display per page
  const totalOrders = orders.length;

  // Calculate indices of products to display based on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddModalOpen = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalVisible(false);
  };

  const handleOrderCreated = () => {
    setIsAddModalVisible(false);
    fetchOrders();
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedOrder(null);
  };

  const handleOrderUpdated = () => {
    setIsEditModalVisible(false);
    fetchOrders();
  };

  const orderTableColumns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Number of Products',
      dataIndex: 'products',
      key: 'products',
      render: (products) => products.length,
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Tracking', dataIndex: 'tracking', key: 'tracking' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type="link" onClick={() => handleEditOrder(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAddModalOpen}>
        Add Order
      </Button>
      <AddOrderModal
        visible={isAddModalVisible}
        onCancel={handleAddModalClose}
        onSave={handleOrderCreated}
      />
      {selectedOrder && (
        <EditOrderModal
          visible={isEditModalVisible}
          onCancel={handleEditModalClose}
          onSave={handleOrderUpdated}
          order={selectedOrder}
        />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flex: '1',
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
            columns={orderTableColumns}
            dataSource={displayOrders}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            total={totalOrders}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;
