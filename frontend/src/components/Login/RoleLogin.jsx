import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Login.css';

const RoleLogin = ({ onLogin }) => {
    const { role } = useParams();
    const navigate = useNavigate();

    // Normalize role string for display and logic
    const normalizedRole = role ? role.toUpperCase() : 'FACULTY';
    const displayRole = normalizedRole === 'HOD' || normalizedRole === 'CEO'
        ? normalizedRole
        : 'Faculty';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        const trimmedUsername = username.trim();

        // Mock authentication check
        if (!trimmedUsername || !password) {
            setError('Please enter both username and password.');
            return;
        }

        if (password.length < 6) {
            setError('Invalid password length (must be at least 6 characters).');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedUsername)) {
            setError('invalid user id(mail id)');
            return;
        }

        // Registration check logic
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const user = registeredUsers.find(u => u.email === trimmedUsername && u.role === normalizedRole);

        if (!user) {
            setError('User not found. Please register as ' + displayRole + ' first.');
            return;
        }

        if (user.password !== password) {
            setError('Incorrect password. Please try again.');
            return;
        }

        // Simulating processing delay for effect
        setTimeout(() => {
            // Set session details in localStorage
            localStorage.setItem('userRole', displayRole);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', user.email);
            localStorage.setItem('fullName', user.name);

            // Dispatch event so other components know (like our App/Menubar if needed)
            window.dispatchEvent(new Event('roleChange'));

            // Call optional prop
            if (onLogin) onLogin();

            // Redirect to dashboard
            navigate('/');
        }, 600);
    };

    return (
        <div className="login-page-container">
            <div className="login-glass-card narrow">
                <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                    <button
                        type="button"
                        className="btn-back-top"
                        onClick={() => navigate('/login')}
                    >
                        ← Back to Portals
                    </button>
                </div>
                <h1 className="login-title">{displayRole} Login</h1>
                <p className="login-subtitle">Enter your credentials to access the secure portal.</p>

                <form className="login-form" onSubmit={handleLogin}>
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder={`Enter your ${displayRole.toLowerCase()} ID`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>Password</label>
                            <a 
                                href="#" 
                                className="forgot-password" 
                                onClick={(e) => { 
                                    e.preventDefault(); 
                                    navigate(`/forgot-password/${normalizedRole.toLowerCase()}`); 
                                }}
                            >
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter your secure password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-login">
                        Login to Portal
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Don't have an account? </span>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate(`/signup/${normalizedRole.toLowerCase()}`); }}
                            style={{ color: '#fff', fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            Sign up here
                        </a>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default RoleLogin;
