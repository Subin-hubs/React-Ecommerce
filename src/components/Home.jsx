import React from 'react'
import { Link } from 'react-router-dom'
import "./CSS/Home.css"
import image from "../assets/home.png" 

export default function Home() {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome to Kathmandu Hub</h1>
                <p>Your one-stop shop for all your needs!</p>
                <button><Link to="/products">Browse Products</Link></button>
            </div>

            <div className="home-image">
                <img src={image} alt="Kathmandu Hub" />
            </div>
        </div>
    )
}