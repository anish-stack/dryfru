import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/Auth/LoginPage'
import DashboardLayout from './components/Layout/DashboardLayout'
import DashboardPage from './Pages/Dashboard/DashboardPage'
import CreateProduct from './Pages/Product/CreateProduct'
import Products from './Pages/Product/Products'
import EditProduct from './Pages/Product/EditProduct'
import AllUsers from './Pages/Users/AllUsers'
import Manage_Order from './Pages/Orders/Manage_Order'


const Banners = () => <div>Banners Page</div>
const Reports = () => <div>Reports Page</div>
const Support = () => <div>Support Page</div>

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/products/manage" element={<Products />} />
          <Route path="/products/create" element={<CreateProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="banners" element={<Banners />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="orders" element={<Manage_Order />} />
          <Route path="reports" element={<Reports />} />
          <Route path="support" element={<Support />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App