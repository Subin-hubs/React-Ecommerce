import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./CSS/ProductDetail.css";
import { CartContext } from '../context/CartContext';


export default function Product_Detail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = React.useState(null);
    const [addedToCart, setAddedToCart] = useState(false);

    const { addToCart, cart } = useContext(CartContext);

    React.useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (!product) {
        return <div className="loading"><h1>Loading product details...</h1></div>;
    }

    return (
        <div className="detail-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                &larr; Back to Products
            </button>

            <div className="detail-content">
                <div className="detail-image">
                    <img src={product.image} alt={product.title} />
                </div>

                <div className="detail-info">
                    <span className="category-tag">{product.category}</span>
                    <h1>{product.title}</h1>
                    <p className="description">{product.description}</p>
                    <h2 className="price">${product.price}</h2>

                    <div className="action-area">
                        <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
                        {addedToCart && <span className="success-msg">Item added to cart!</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}