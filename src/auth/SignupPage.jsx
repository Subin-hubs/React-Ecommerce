import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
                role: "customer",
                provider: "email"
            });

            console.log('✅ User created in Auth and Firestore!');
            alert("Account created successfully!");

            // Switch to login
            switchToLogin();

        } catch (err) {
            console.error('❌ Signup error:', err);

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

    const handleGoogleSignUp = async () => {
        if (!acceptTerms) {
            return setError('Please accept the terms and conditions');
        }

        setIsLoading(true);
        setError('');

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user already exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));

            // If new user, save to Firestore
            if (!userDoc.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString(),
                    role: "customer",
                    provider: "google"
                });
                console.log('✅ New Google user saved to Firestore!');
            }

            alert("Account created successfully!");

            // Redirect to home page
            window.location.href = "/";

        } catch (err) {
            console.error('Google sign-up error:', err);

            switch (err.code) {
                case 'auth/popup-closed-by-user':
                    setError('Sign-up popup was closed');
                    break;
                case 'auth/popup-blocked':
                    setError('Popup was blocked by browser');
                    break;
                case 'auth/cancelled-popup-request':
                    setError('Sign-up was cancelled');
                    break;
                case 'auth/account-exists-with-different-credential':
                    setError('Account already exists with different sign-in method');
                    break;
                default:
                    setError('Google sign-up failed. Please try again');
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

                <div className="divider">
                    <span>OR</span>
                </div>

                <button
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                    className="google-btn"
                    type="button"
                >
                    <svg className="google-icon" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

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