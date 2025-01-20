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
import ViewOrder from './Pages/Orders/ViewOrder'
import Settings from './Pages/settings/Settings'
import Hero from './Pages/Hero/Hero'
import Pages from './Pages/Dynamic_Pages/Pages'
import Support from './Pages/Support/Support'
import Reports from './Pages/Reports/Reports'
import Announcements from './components/Announcements/Announcements'
import Coupon from './Pages/Coupons/Coupon'
import { AuthProvider } from './context/AuthContext'
import Login from './Pages/Auth/Login'
import { ProtectedRoute } from './context/ProtectedRoute'
import Categories from './Pages/Categories/Categories'



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/login" element={<Login />} />
        
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products/manage" element={<Products />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            
            <Route path="users" element={<AllUsers />} />
            <Route path="orders" element={<Manage_Order />} />
            <Route path="order/:id" element={<ViewOrder />} />
            <Route path="settings" element={<Settings />} />
            <Route path="hero-section" element={<Hero />} />
            <Route path="pages/:page" element={<Pages />} />
            <Route path="announcements" element={<Announcements />} />


            <Route path="Categories" element={<Categories />} />


            <Route path="coupons" element={<Coupon />} />
            <Route path="reports" element={<Reports />} />
            <Route path="support" element={<Support />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
