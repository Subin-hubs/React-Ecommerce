import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import "./SignupPage.css";

export default function SignupPage({ isModal, switchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async e => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }
        if (!acceptTerms) {
            return setError('Please accept the terms and conditions');
        }

        setIsLoading(true);

        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            // 2. Update user profile with display name
            await updateProfile(user, {
                displayName: formData.name
            });

            // 3. Save additional user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: formData.name,
                email: formData.email,
                createdAt: new Date().toISOString(),
                role: "customer"
            });

            console.log('✅ User created in Auth and Firestore!');
            alert("Account created successfully!");

            // Switch to login
            switchToLogin();

        } catch (err) {
            console.error('❌ Signup error:', err);

            // Handle specific Firebase errors
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/operation-not-allowed':
                    setError('Email/password accounts are not enabled');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak');
                    break;
                default:
                    setError('Signup failed. Please try again');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={isModal ? "signup-modal-content" : "signup-page-wrapper"}>
            <div className="signup-container">
                <div className="signup-header">
                    <h1>Create Account</h1>
                    <p>Join Kathmandu Hub today</p>
                </div>

                <form onSubmit={handleSignup} className="signup-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <label className="terms-checkbox">
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={e => setAcceptTerms(e.target.checked)}
                        />
                        <span>
                            I accept the <span className="highlight">Terms of Service</span> and <span className="highlight">Privacy Policy</span>
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="submit-btn"
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="form-footer">
                    <p>
                        Already have an account?{' '}
                        <span onClick={switchToLogin} className="switch-link">
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}