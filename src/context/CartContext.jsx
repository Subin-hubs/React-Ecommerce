import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const addToCart = (product) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart, product];
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    }

    const removeFromCart = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    const increaseQuantity = (index) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity += 1;
        setCart(updatedCart);
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, increaseQuantity }}>
            {children}
        </CartContext.Provider>
    );
}
