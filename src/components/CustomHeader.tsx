import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const CustomHeader = () => {
  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['products']}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Menu.Item key="products">
          <Link to="/products">Products</Link>
        </Menu.Item>
        <Menu.Item key="orders">
          <Link to="/orders">Orders</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default CustomHeader;
