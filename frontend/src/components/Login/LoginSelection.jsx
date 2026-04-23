import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const LoginSelection = () => {
    return (
        <div className="login-page-container">
            <div className="login-glass-card">
                <h1 className="login-title">Duty Exchange System</h1>
                <p className="login-subtitle">Select your portal to securely access the platform.</p>
                
                <div className="portal-grid">
                    <Link to="/login/faculty" className="portal-card">
                        <div className="portal-icon">👨‍🏫</div>
                        <h3>Faculty Portal</h3>
                        <p>Submit and manage duty exchange requests</p>
                    </Link>
                    
                    <Link to="/login/hod" className="portal-card">
                        <div className="portal-icon">👑</div>
                        <h3>HOD Portal</h3>
                        <p>Review and approve faculty requests</p>
                    </Link>
                    
                    <Link to="/login/ceo" className="portal-card">
                        <div className="portal-icon">🏛️</div>
                        <h3>CEO Portal</h3>
                        <p>Final approval for higher-level duties</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginSelection;
