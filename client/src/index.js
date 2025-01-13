import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import store from './store/Store';
import {Toaster} from 'react-hot-toast'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
   
      <BrowserRouter>
        <Header />
        <App />
        <Toaster/>
        <Footer />
      </BrowserRouter>
  
  </Provider>
);


reportWebVitals();
