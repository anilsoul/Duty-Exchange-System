import React, { useState, useEffect, useRef } from 'react';
import '../Style/Profile.css';
import avatarImg from '../assets/profile/avatar.png';

const ROLE_FIELDS = {
    FACULTY: [
        { key: 'name', label: 'Full Name', type: 'text' },
        { key: 'email', label: 'Email / User ID', type: 'email' },
        { key: 'department', label: 'Department', type: 'text' },
        { key: 'designation', label: 'Designation', type: 'text' },
        { key: 'specialization', label: 'Specialization', type: 'text' },
        { key: 'experience', label: 'Experience (Years)', type: 'text' },
        { key: 'phone', label: 'Phone Number', type: 'text' },
    ],
    HOD: [
        { key: 'name', label: 'Full Name', type: 'text' },
        { key: 'email', label: 'Email ID', type: 'email' },
        { key: 'department', label: 'Department Management', type: 'text' },
        { key: 'designation', label: 'Designation', type: 'text' },
        { key: 'phone', label: 'Contact Number', type: 'text' },
    ],
    CEO: [
        { key: 'name', label: 'Full Name', type: 'text' },
        { key: 'email', label: 'Email ID', type: 'email' },
        { key: 'department', label: 'Organization Management', type: 'text' },
        { key: 'designation', label: 'Designation', type: 'text' },
        { key: 'phone', label: 'Contact Number', type: 'text' },
    ]
};

const DEFAULT_DATA = {
    FACULTY: {
        name: 'Faculty Member',
        email: 'faculty@nmit.ac.in',
        role: 'FACULTY',
        department: 'Computer Science & Engineering',
        designation: 'Assistant Professor',
        specialization: 'Cloud Computing',
        experience: '5',
        phone: '+91 9876543210'
    },
    HOD: {
        name: 'Department Head',
        email: 'hod@nmit.ac.in',
        role: 'HOD',
        department: 'Information Science',
        designation: 'Professor & Head',
        phone: '+91 8765432109'
    },
    CEO: {
        name: 'Executive Officer',
        email: 'ceo@nmit.ac.in',
        role: 'CEO',
        department: 'NMIT Institution',
        designation: 'Chief Executive Officer',
        phone: '+91 7654321098'
    }
};

const Profile = () => {
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRole, setCurrentRole] = useState('FACULTY');
    const [customAvatar, setCustomAvatar] = useState(null);
    const [profileData, setProfileData] = useState(DEFAULT_DATA.FACULTY);

    useEffect(() => {
        // Determine role
        const role = (localStorage.getItem('userRole') || 'Faculty').toUpperCase();
        const normalizedRole = role === 'HOD' || role === 'CEO' ? role : 'FACULTY';
        setCurrentRole(normalizedRole);

        // Load role-specific data
        const storageKey = `profile_data_${normalizedRole.toLowerCase()}`;
        const storedProfile = localStorage.getItem(storageKey);
        
        if (storedProfile) {
            const data = JSON.parse(storedProfile);
            setProfileData(data);
            if (data.customAvatar) {
                setCustomAvatar(data.customAvatar);
            }
        } else {
            // Seed with existing username/session if no profile exists
            const storedName = localStorage.getItem('username');
            setProfileData({
                ...DEFAULT_DATA[normalizedRole],
                email: storedName || DEFAULT_DATA[normalizedRole].email,
                name: storedName ? storedName.split('@')[0] : DEFAULT_DATA[normalizedRole].name
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        const storageKey = `profile_data_${currentRole.toLowerCase()}`;
        const fullData = {
            ...profileData,
            customAvatar: customAvatar
        };
        localStorage.setItem(storageKey, JSON.stringify(fullData));
        setIsEditing(false);
        window.dispatchEvent(new Event('profileUpdate'));
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setCustomAvatar(base64String);
                
                // Immediately save image for the specific role
                const storageKey = `profile_data_${currentRole.toLowerCase()}`;
                const currentData = JSON.parse(localStorage.getItem(storageKey) || '{}');
                localStorage.setItem(storageKey, JSON.stringify({
                    ...profileData,
                    ...currentData,
                    customAvatar: base64String
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const fields = ROLE_FIELDS[currentRole] || ROLE_FIELDS.FACULTY;

    return (
        <div className={`profile-container ${currentRole.toLowerCase()}`}>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar-container" onClick={handleAvatarClick} title="Click to change photo">
                        <img src={customAvatar || avatarImg} alt="Profile" className="profile-avatar" />
                        <div className="avatar-overlay">Change Photo</div>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                    />
                    <div className="profile-title-section">
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="name" 
                                value={profileData.name} 
                                onChange={handleChange}
                                className="detail-input"
                                style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                            />
                        ) : (
                            <h1 className="profile-name">{profileData.name}</h1>
                        )}
                        <div className="profile-role-badge">{currentRole}</div>
                    </div>
                </div>

                <div className="profile-details-grid">
                    {fields.map(field => (
                        <div className="detail-item" key={field.key} style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}>
                            <label className="detail-label">{field.label}</label>
                            {isEditing ? (
                                field.type === 'textarea' ? (
                                    <textarea 
                                        name={field.key}
                                        value={profileData[field.key] || ''}
                                        onChange={handleChange}
                                        className="detail-input"
                                        style={{ minHeight: '100px', resize: 'vertical', width: '100%' }}
                                    />
                                ) : (
                                    <input 
                                        type={field.type} 
                                        name={field.key} 
                                        value={profileData[field.key] || ''} 
                                        onChange={handleChange}
                                        className="detail-input"
                                    />
                                )
                            ) : (
                                <div className="detail-value" style={field.type === 'textarea' ? { whiteSpace: 'pre-wrap' } : {}}>
                                    {profileData[field.key] || 'Not specified'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button className="btn-profile btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button className="btn-profile btn-save" onClick={handleSave}>Save Changes</button>
                        </>
                    ) : (
                        <button className="btn-profile btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
