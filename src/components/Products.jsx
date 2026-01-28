import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('https://fakestoreapi.com/products').then(res => res.json()),
            fetch('https://fakestoreapi.com/products/categories').then(res => res.json())
        ])
            .then(([productsData, categoriesData]) => {
                setProducts(productsData);
                setFilteredProducts(productsData);
                setCategories(categoriesData);
                setLoading(false);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    // Filter logic
    const handleFilter = (category) => {
        setActiveCategory(category);
        if (category === 'all') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(p => p.category === category);
            setFilteredProducts(filtered);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Discover Our Products</h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => handleFilter('all')}
                    style={getBtnStyle(activeCategory === 'all')}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleFilter(cat)}
                        style={getBtnStyle(activeCategory === cat)}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-card" style={cardStyle}>
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', marginTop: '15px' }}>{product.category}</p>
                        <h3 style={{ fontSize: '1rem', height: '40px', overflow: 'hidden', margin: '10px 0' }}>{product.title}</h3>
                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#2575fc' }}>${product.price}</p>
                        <Link to={`/product/${product.id}`} style={linkStyle}>
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

const getBtnStyle = (isActive) => ({
    padding: '8px 20px',
    borderRadius: '20px',
    border: '1px solid #2575fc',
    cursor: 'pointer',
    backgroundColor: isActive ? '#2575fc' : 'transparent',
    color: isActive ? 'white' : '#2575fc',
    transition: '0.3s',
    fontWeight: '500'
});

const cardStyle = {
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '20px',
    transition: 'box-shadow 0.3s',
    backgroundColor: '#fff'
};

const linkStyle = {
    display: 'block',
    marginTop: '15px',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#f5f7fa',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500'
};
