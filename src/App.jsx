import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import Products from './components/Products.jsx'
import Product_Detail from './components/Product_Detail.jsx'
import Cart from './components/Cart.jsx'
import Navbar from './components/Navbar.jsx'
import Login from "./auth/LoginPage.jsx";
import Signup from "./auth/SignupPage.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/product/:id' element={<Product_Detail />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />  {/* FIXED */}
      </Routes>
    </>
  )
}

export default App
