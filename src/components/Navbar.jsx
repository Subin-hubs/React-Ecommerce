import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import "./CSS/Navbar.css"
import image from "../assets/cart.png"
import { CartContext } from '../context/CartContext'

export default function Navbar() {
    const { cart } = useContext(CartContext)

    return (
        <>
            <nav>
                <h2 className="logo"><Link to="/">Kathmandu Hub</Link></h2>
                <div className="center-links-wrapper">
                    <div className="center-links">
                        <Link to="/">Home</Link>
                        <Link to="/products">Products</Link>
                    </div>
                </div>
                <div className="right-links">
                    <div className="cart-icon-wrapper">
                        <Link to="/cart">
                            <img src={image} alt="Cart" className="cart-icon" />
                            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                        </Link>
                    </div>

                    <button className="login-btn">Login</button>

                </div>
            </nav>

        </>
    )
}
