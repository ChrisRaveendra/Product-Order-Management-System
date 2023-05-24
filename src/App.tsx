import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomHeader from './components/CustomHeader.jsx';
import ProductDashboard from './views/ProductDashboard.jsx';
import OrderDashboard from './views/OrderDashboard.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div
        style={{
          position: 'fixed',
          height: '64px',
          top: 0,
          left: 0,
        }}
      >
        <CustomHeader />
      </div>
      <div
        style={{
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          // width: '100%',
          // padding: '25px',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            width: 'calc(100vw-50px)',
            padding: '25px',
          }}
        >
          <Routes>
            <Route path="/products" element={<ProductDashboard />} />
            <Route path="/orders" element={<OrderDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
