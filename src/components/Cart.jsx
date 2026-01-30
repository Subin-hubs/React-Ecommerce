import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CSS/Cart.css';

export default function Cart() {
    const { cart, setCart } = useContext(CartContext);

    const removeFromCart = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, product) => total + product.price, 0).toFixed(2);
    };

    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <h1>Your Cart is Empty</h1>
                <p>Start shopping to add items to your cart!</p>
                <Link to="/products" className="continue-shopping-btn">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>
            
            <div className="cart-content">
                <div className="cart-items">
                    {cart.map((product, index) => (
                        <div key={index} className="cart-item">
                            <div className="item-image">
                                <img src={product.image} alt={product.title} />
                            </div>
                            
                            <div className="item-details">
                                <h3>{product.title}</h3>
                                <p className="category">{product.category}</p>
                                <p className="description">{product.description.substring(0, 100)}...</p>
                            </div>
                            
                            <div className="item-price">
                                <h3>${product.price}</h3>
                            </div>
                            
                            <button 
                                className="remove-btn" 
                                onClick={() => removeFromCart(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-item">
                        <span>Subtotal ({cart.length} items)</span>
                        <span>${getTotalPrice()}</span>
                    </div>
                    <div className="summary-item">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-item total">
                        <span>Total</span>
                        <span>${getTotalPrice()}</span>
                    </div>
                    <button className="checkout-btn">Proceed to Checkout</button>
                    <Link to="/products" className="continue-shopping">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
