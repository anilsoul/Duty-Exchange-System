import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FilePreviewPage.css';

const FilePreviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Try to get file from navigation state, otherwise check localStorage
    const fileUrl = location.state?.fileUrl || localStorage.getItem('previewFileUrl');
    const fileName = location.state?.fileName || localStorage.getItem('previewFileName');

    if (!fileUrl) {
        return (
            <div className="preview-container">
                <div className="error-message">
                    <h2>No file to preview</h2>

                </div>
            </div>
        );
    }

    return (
        <div className="preview-container">
            <div className="preview-header">
                <h2>Duty Exchange Form Preview</h2>

            </div>
            <div className="preview-content">
                <iframe
                    src={fileUrl}
                    title="File Preview"
                    className="pdf-viewer"
                />
            </div>
        </div>
    );
};

export default FilePreviewPage;
