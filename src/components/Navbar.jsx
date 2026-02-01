import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import "./CSS/Navbar.css"
import image from "../assets/cart.png"
import { CartContext } from '../context/CartContext'

// Import the auth components
import LoginPage from "../auth/LoginPage"
import SignupPage from "../auth/SignupPage"

export default function Navbar() {
    const { cart } = useContext(CartContext)

    // State to handle which modal is open
    const [activeModal, setActiveModal] = useState(null); // 'login' or 'signup'

    const closeModal = () => setActiveModal(null);

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

                    {/* Trigger Login Modal instead of navigating */}
                    <button
                        className="login-btn"
                        onClick={() => setActiveModal('login')}
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* Modal Logic */}
            {activeModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-x" onClick={closeModal}>&times;</button>

                        {activeModal === 'login' ? (
                            <LoginPage
                                isModal={true}
                                switchToSignup={() => setActiveModal('signup')}
                            />
                        ) : (
                            <SignupPage
                                isModal={true}
                                switchToLogin={() => setActiveModal('login')}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}