import React from 'react'
import { Link } from 'react-router-dom'
import "./CSS/Navbar.css"

export default function Navbar() {
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
            </nav>

        </>
    )
}
