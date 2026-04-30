import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const RoleSignUp = () => {
    const { role } = useParams();
    const navigate = useNavigate();

    const normalizedRole = role ? role.toUpperCase() : 'FACULTY';
    const displayRole =
        normalizedRole === 'HOD' || normalizedRole === 'CEO'
            ? normalizedRole
            : 'Faculty';

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedUsername = username.trim();

        if (!trimmedName || !trimmedUsername || !password || !confirmPassword) {
            setError('Please fill out all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedUsername)) {
            setError('Invalid user id (mail id)');
            return;
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!passwordRegex.test(password)) {
            setError(
                'Password must be at least 6 characters, include uppercase, lowercase, number, and special character.'
            );
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setError('');

        const registeredUsers = JSON.parse(
            localStorage.getItem('registered_users') || '[]'
        );

        const userExists = registeredUsers.some(
            (u) => u.email === trimmedUsername && u.role === normalizedRole
        );

        if (userExists) {
            setError('An account with this email already exists for this role.');
            return;
        }

        const newUser = {
            name: trimmedName,
            email: trimmedUsername,
            password,
            role: normalizedRole,
        };

        registeredUsers.push(newUser);
        localStorage.setItem(
            'registered_users',
            JSON.stringify(registeredUsers)
        );

        setTimeout(() => {
            setSuccess(true);
            setTimeout(() => {
                navigate(`/login/${normalizedRole.toLowerCase()}`);
            }, 1000);
        }, 600);
    };

    return (
        <div className="login-page-container">
            <div className="login-glass-card narrow">
                <div style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
                    <button
                        type="button"
                        className="btn-back-top"
                        onClick={() => navigate('/login')}
                    >
                        ← Back to Portals
                    </button>
                </div>

                <h1 className="login-title">Register as {displayRole}</h1>
                <p className="login-subtitle">
                    Create your account to access the portal.
                </p>

                {success ? (
                    <div
                        style={{
                            padding: '2rem',
                            textAlign: 'center',
                            color: '#fff',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '3rem',
                                marginBottom: '1rem',
                                color: '#4ade80',
                            }}
                        >
                            ✓
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>
                            Registration Successful!
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Redirecting to login...
                        </p>
                    </div>
                ) : (
                    <form className="login-form" onSubmit={handleSignUp}>
                        {error && <div className="login-error">{error}</div>}

                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Username / ID</label>
                            <input
                                type="text"
                                placeholder={`Enter your ${displayRole.toLowerCase()} ID`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a secure password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <span
                                    className="eye-icon"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                                <span
                                    className="eye-icon"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-login"
                            style={{ marginTop: '0.5rem' }}
                        >
                            Sign Up
                        </button>

                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: '1.5rem',
                            }}
                        >
                            <span
                                style={{
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '0.9rem',
                                }}
                            >
                                Already have an account?{' '}
                            </span>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(
                                        `/login/${normalizedRole.toLowerCase()}`
                                    );
                                }}
                                style={{
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                }}
                            >
                                Sign in here
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RoleSignUp;