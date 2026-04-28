import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Login.css';

const ForgotPassword = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    
    // Normalize role string
    const normalizedRole = role ? role.toUpperCase() : 'FACULTY';
    const displayRole = normalizedRole === 'HOD' || normalizedRole === 'CEO' 
        ? normalizedRole 
        : 'Faculty';

    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleReset = (e) => {
        e.preventDefault();
        
        const trimmedUsername = username.trim();
        
        if (!trimmedUsername || !newPassword || !confirmPassword) {
            setError('Please fill out all fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedUsername)) {
            setError('invalid user id(mail id)');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('Password must be at least 6 characters, include uppercase, lowercase, number, and special character.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Check if user exists
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const userIndex = registeredUsers.findIndex(u => u.email === trimmedUsername && u.role === normalizedRole);
        
        if (userIndex === -1) {
            setError(`Account with this email not found for ${displayRole} role.`);
            return;
        }

        // Update password
        registeredUsers[userIndex].password = newPassword;
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

        setError('');
        setSuccess(true);
        
        setTimeout(() => {
            navigate(`/login/${normalizedRole.toLowerCase()}`);
        }, 2000);
    };

    return (
        <div className="login-page-container">
            <div className="login-glass-card narrow">
                <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                    <button 
                        type="button" 
                        className="btn-back-top" 
                        onClick={() => navigate(`/login/${normalizedRole.toLowerCase()}`)}
                    >
                        ← Back to Login
                    </button>
                </div>
                <h1 className="login-title">Reset Password</h1>
                <p className="login-subtitle">Reset your {displayRole} account password.</p>
                
                {success ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#4ade80' }}>✓</div>
                        <h2 style={{ marginBottom: '1rem' }}>Password Reset Successful!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Redirecting to login...</p>
                    </div>
                ) : (
                    <form className="login-form" onSubmit={handleReset}>
                        {error && <div className="login-error">{error}</div>}
                        
                        <div className="form-group">
                            <label>Username / Email</label>
                            <input 
                                type="text" 
                                placeholder="Enter your registered email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>New Password</label>
                            <input 
                                type="password" 
                                placeholder="Enter new secure password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input 
                                type="password" 
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        
                        <button type="submit" className="btn-login" style={{ marginTop: '0.5rem' }}>
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
