import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check local storage or system preference on mount
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.body.classList.add('dark');
        } else {
            setDarkMode(false);
            document.body.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);

        if (newMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className="settings-container">
            <h1 className="settings-title">Settings</h1>

            <div className="settings-section">
                <h2 className="section-title">Appearance</h2>
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Dark Mode</h3>
                        <p>Switch between light and dark themes</p>
                    </div>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <h2 className="section-title">About System</h2>

                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Version</h3>
                        <p>Duty Exchange System v1.0.0</p>
                    </div>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Description</h3>
                        <p>A comprehensive platform designed to streamline the process of faculty duty exchanges, ensuring efficient management and tracking of requests.</p>
                    </div>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Key Features</h3>
                        <ul className="features-list">
                            <li>Secure Login & Authentication</li>
                            <li>Easy Duty Swapping Requests</li>
                            <li>Automated PDF Generation</li>
                            <li>Email Notifications</li>
                            <li>Real-time Status Tracking</li>
                        </ul>
                    </div>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Developed By</h3>
                        <p><strong>Lalan Mohto</strong></p>
                        <p><strong>Anil Kumar</strong></p>
                        <p className="developer-role">Full Stack Developers</p>
                    </div>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <h3>Contact Support</h3>
                        <p>Email: <a href="mailto:support@nmit.ac.in">support@nmit.ac.in</a></p>
                        <p>Phone: +91 12345 67890</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
