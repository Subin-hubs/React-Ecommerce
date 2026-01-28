import { useState } from 'react'
import './App.css'

import { Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import Products from './components/Products.jsx'
import Product_Detail from './components/Product_Detail.jsx'
import Navbar from './components/Navbar.jsx'



function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/product/:id' element={<Product_Detail />} />
      </Routes>


    </>
  )
}

export default App
