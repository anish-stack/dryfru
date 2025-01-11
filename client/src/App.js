import './App.css';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import ProductPage from './pages/ProductPage/ProductPage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';

function App(){
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About/>} />
      <Route path='/productpage/:_id' element={<ProductPage/>} />
      <Route path='/contact' element={<Contact/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>} />
      <Route path='/forgetpassword' element={<ForgetPassword/>}/>
    </Routes>
  );
}
export default App;