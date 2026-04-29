import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './DutyExchangeForm.css';

const DutyExchangeForm = () => {
    const navigate = useNavigate();



    const [formData, setFormData] = useState({
        allotted: {
            name: '',
            email: '',
            dutyType: '',
            department: '',
            date: '',
        },
        exchangedWith: {
            name: '',
            email: '',
            dutyType: '',
            department: '',
            date: '',
        },
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user info from localStorage
        const fullName = localStorage.getItem('fullName') || '';
        const email = localStorage.getItem('username') || '';
        
        // Try to get department from profile data
        let dept = '';
        try {
            const role = (localStorage.getItem('userRole') || 'Faculty').toUpperCase();
            const normalizedRole = role === 'HOD' || role === 'CEO' ? role : 'FACULTY';
            const profileKey = `profile_data_${normalizedRole.toLowerCase()}`;
            const storedProfile = localStorage.getItem(profileKey);
            if (storedProfile) {
                const profileData = JSON.parse(storedProfile);
                dept = profileData.department || '';
            }
        } catch (e) {
            console.error("Error fetching department from profile", e);
        }

        setFormData(prev => ({
            ...prev,
            allotted: {
                ...prev.allotted,
                name: fullName,
                email: email,
                department: dept || prev.allotted.department
            }
        }));
        setIsLoading(false);
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('info'); // 'success', 'error', 'info'

    const showCustomAlert = (message, type = 'info') => {
        setModalMessage(message);
        setModalType(type);
        setShowModal(true);
        // Auto-hide after 1.5 seconds
        setTimeout(() => setShowModal(false), 1500);
    };

    const handleChange = (section, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleFileChange = (section, field, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: reader.result } }));
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    const validateForm = () => {
        const sections = ['allotted', 'exchangedWith'];
        for (const section of sections) {
            for (const key in formData[section]) {
                if (key === 'department' && formData[section].dutyType === 'MSE') {
                    continue;
                }
                if (!formData[section][key]) {
                    showCustomAlert(`Required: ${formatLabel(key)} (${section === 'allotted' ? 'Allotted Duty' : 'Duty Exchanged With'})`, 'error');
                    return false;
                }
            }
        }
        return true;
    };



    const handlePrint = async () => {
        if (!validateForm()) return;

        try {
            // Send data to backend before printing
            const response = await fetch('https://duty-exchange-system.onrender.com/api/duty-exchange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Data saved to backend');
                showCustomAlert('Request saved successfully! Generating print...', 'success');
                setTimeout(() => {
                    window.print();
                }, 1000);
            } else {
                console.error('Failed to save data');
                showCustomAlert('Failed to save data to backend, but printing will proceed.', 'error');
                // Optional: still allow print?
                window.print();
            }
        } catch (error) {
            console.error('Error saving data:', error);
            showCustomAlert('Error connecting to backend.', 'error');
            // Allow print anyway?
            window.print();
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        console.log('File Uploaded:', file.name);

        // Create a blob URL for the file
        const fileUrl = URL.createObjectURL(file);

        // Save to localStorage for the preview page to access later
        localStorage.setItem('previewFileUrl', fileUrl);
        localStorage.setItem('previewFileName', file.name);

        showCustomAlert(`File "${file.name}" uploaded successfully! You can view it in 'View Timetable'.`, 'success');
    };

    return (
        <div className="form-container">
            <header className="form-header">
                <h2>NMIT, BENGALURU</h2>
                <h3>{formData.allotted.dutyType === 'SEE' ? 'SEE' : 'MSE'} DUTY EXCHANGE FORM</h3>
            </header>

            <div className="form-grid">
                {/* Allotted Duty Section */}
                <div className="form-section">
                    <h4 className="section-title">ALLOTTED DUTY</h4>
                    {Object.keys(formData.allotted).map((key) => {
                        if (key === 'department' && formData.allotted.dutyType === 'MSE') return null;
                        return (
                            <div key={`allotted-${key}`} className="form-group">
                                <label>{formatLabel(key)}</label>
                                {key === 'dutyType' ? (
                                    <select
                                        value={formData.allotted[key]}
                                        onChange={(e) => handleChange('allotted', key, e.target.value)}
                                    >
                                        <option value="">Select Duty Type</option>
                                        <option value="MSE">MSE</option>
                                        <option value="SEE">SEE</option>
                                    </select>
                                ) : key === 'department' ? (
                                    <select
                                        value={formData.allotted[key]}
                                        onChange={(e) => handleChange('allotted', key, e.target.value)}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="CSE">CSE</option>
                                        <option value="ISE">ISE</option>
                                        <option value="AIML">AIML</option>
                                        <option value="AIDS">AIDS</option>
                                        <option value="CSBS">CSBS</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EEE">EEE</option>
                                        <option value="Civil">Civil</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Aeronautical">Aeronautical</option>
                                        <option value="VLSI">VLSI</option>
                                        <option value="Robotics & AI">Robotics & AI</option>
                                    </select>
                                ) : (
                                    <input
                                        type={key === 'date' ? 'date' : key === 'email' ? 'email' : 'text'}
                                        value={formData.allotted[key]}
                                        onChange={(e) => handleChange('allotted', key, e.target.value)}
                                        placeholder={`Enter ${formatLabel(key)}`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Duty Exchanged With Section */}
                <div className="form-section">
                    <h4 className="section-title">DUTY EXCHANGED WITH</h4>
                    {Object.keys(formData.exchangedWith).map((key) => {
                        if (key === 'department' && formData.exchangedWith.dutyType === 'MSE') return null;
                        return (
                            <div key={`exchangedWith-${key}`} className="form-group">
                                <label>{formatLabel(key)}</label>
                                {key === 'dutyType' ? (
                                    <select
                                        value={formData.exchangedWith[key]}
                                        onChange={(e) => handleChange('exchangedWith', key, e.target.value)}
                                    >
                                        <option value="">Select Duty Type</option>
                                        <option value="MSE">MSE</option>
                                        <option value="SEE">SEE</option>
                                    </select>
                                ) : key === 'department' ? (
                                    <select
                                        value={formData.exchangedWith[key]}
                                        onChange={(e) => handleChange('exchangedWith', key, e.target.value)}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="CSE">CSE</option>
                                        <option value="ISE">ISE</option>
                                        <option value="AIML">AIML</option>
                                        <option value="AIDS">AIDS</option>
                                        <option value="CSBS">CSBS</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EEE">EEE</option>
                                        <option value="Civil">Civil</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Aeronautical">Aeronautical</option>
                                        <option value="VLSI">VLSI</option>
                                        <option value="Robotics & AI">Robotics & AI</option>
                                    </select>
                                ) : (
                                    <input
                                        type={key === 'date' ? 'date' : key === 'email' ? 'email' : 'text'}
                                        value={formData.exchangedWith[key]}
                                        onChange={(e) => handleChange('exchangedWith', key, e.target.value)}
                                        placeholder={`Enter ${formatLabel(key)}`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Print-Only Table Layout */}
            <div className="printable-form">
                <table className="print-table">
                    <thead>
                        <tr>
                            <th colSpan="4" className="print-header-main">NMIT, BENGALURU</th>
                        </tr>
                        <tr>
                            <th colSpan="4" className="print-header-sub">{formData.allotted.dutyType === 'SEE' ? 'SEE' : 'MSE'} DUTY EXCHANGE FORM</th>
                        </tr>
                        <tr>
                            <th colSpan="2">ALLOTTED DUTY</th>
                            <th colSpan="2">DUTY EXCHANGED WITH</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="label-cell">Name of the Faculty</td>
                            <td className="value-cell">{formData.allotted.name}</td>
                            <td className="label-cell">Name of the Faculty</td>
                            <td className="value-cell">{formData.exchangedWith.name}</td>
                        </tr>
                        {formData.allotted.dutyType !== 'MSE' && (
                            <tr>
                                <td className="label-cell">Department</td>
                                <td className="value-cell">{formData.allotted.department}</td>
                                <td className="label-cell">Department</td>
                                <td className="value-cell">{formData.exchangedWith.department}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="label-cell">Type of Duty</td>
                            <td className="value-cell">{formData.allotted.dutyType}</td>
                            <td className="label-cell">Type of Duty</td>
                            <td className="value-cell">{formData.exchangedWith.dutyType}</td>
                        </tr>
                        <tr>
                            <td className="label-cell">Date of Exchange</td>
                            <td className="value-cell">{formatDate(formData.allotted.date)}</td>
                            <td className="label-cell">Date of Exchange</td>
                            <td className="value-cell">{formatDate(formData.exchangedWith.date)}</td>
                        </tr>

                        <tr className="signature-row">
                            <td className="label-cell">Signature of the HOD</td>
                            <td className="value-cell">
                                {formData.allotted && formData.allotted.hodSignature && (
                                    <img src={formData.allotted.hodSignature} alt="Sign" className="print-signature" />
                                )}
                            </td>
                            <td className="label-cell">Signature of the HOD</td>
                            <td className="value-cell">
                                {formData.exchangedWith && formData.exchangedWith.hodSignature && (
                                    <img src={formData.exchangedWith.hodSignature} alt="Sign" className="print-signature" />
                                )}
                            </td>
                        </tr>

                        {formData.allotted.dutyType !== 'MSE' && (
                            <tr className="signature-row">
                                <td className="label-cell">Signature of the CEO</td>
                                <td className="value-cell">
                                    {formData.allotted && formData.allotted.ceoSignature && (
                                        <img src={formData.allotted.ceoSignature} alt="Sign" className="print-signature" />
                                    )}
                                </td>
                                <td className="label-cell">Signature of the CEO</td>
                                <td className="value-cell">
                                    {formData.exchangedWith && formData.exchangedWith.ceoSignature && (
                                        <img src={formData.exchangedWith.ceoSignature} alt="Sign" className="print-signature" />
                                    )}
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>

            <div className="action-buttons">
                <button className="btn-print" onClick={handlePrint}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                    </svg>
                    Print
                </button>
                <div className="upload-wrapper">
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleUpload}
                        hidden
                        accept="application/pdf,image/*"
                    // To validate BEFORE opening dialog, we would need to not use <label> for input
                    // but a button that triggers click programmatically.
                    // But validating on change is also fine.
                    />
                    <label
                        htmlFor="file-upload"
                        className="btn-upload"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7-7 7z" />
                        </svg>
                        Upload
                    </label>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className={`modal-content ${modalType}`}>
                        <p>{modalMessage}</p>
                        <button className="btn-close" onClick={() => setShowModal(false)} title="Close">
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const formatLabel = (key) => {
    const labels = {
        name: 'Name of the Faculty',
        email: 'Email ID',
        department: 'Department',
        dutyType: 'Type of Duty',
        date: 'Date of Exchange',
    };
    return labels[key] || key;
};

export default DutyExchangeForm;
