import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DutyExchangeManagement.css';
import CEOPrintReport from './CEOPrintReport';



const DutyExchangeManagement = () => {
    const navigate = useNavigate();

    // State for exchanges
    const [exchanges, setExchanges] = useState([]);
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'Faculty');
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('username') || '');

    React.useEffect(() => {
        const handleRoleChange = () => {
            setUserRole(localStorage.getItem('userRole') || 'Faculty');
            setLoggedInUser(localStorage.getItem('username') || '');
        };
        window.addEventListener('roleChange', handleRoleChange);
        return () => window.removeEventListener('roleChange', handleRoleChange);
    }, []);

    // Fetch data from backend on component mount
    React.useEffect(() => {
        const fetchExchanges = async () => {
            try {
                const response = await fetch('https://duty-exchange-system.onrender.com/api/duty-exchange');
                if (response.ok) {
                    const data = await response.json();
                    // Transformation might be needed if backend field names differ slightly
                    // Assuming backend returns matching structure or we map it here
                    const mappedData = data.map((item, index) => ({
                        id: item.id,
                        readableId: index + 1,
                        requestedBy: item.allotted?.name || 'Unknown',
                        requestedByEmail: item.allotted?.email || '',
                        allottedDuty: `${item.allotted?.dutyType || ''} - ${item.allotted?.date || ''}`,
                        allottedDept: item.allotted?.department || '—',
                        exchangeWith: item.exchangedWith?.name || 'Unknown',
                        exchangeWithEmail: item.exchangedWith?.email || '',
                        exchangeDuty: `${item.exchangedWith?.dutyType || ''} - ${item.exchangedWith?.date || ''}`,
                        exchangedWithDept: item.exchangedWith?.department || '—',
                        dutyType: item.allotted?.dutyType?.toUpperCase() || '',
                        status: item.status?.toLowerCase() || 'pending',
                        date: item.requestDate || '',
                        hodApproval: item.hodApproval?.toLowerCase() || 'pending',
                        ceoApproval: item.ceoApproval?.toLowerCase() || 'pending'
                    }));
                    setExchanges(mappedData);
                } else {
                    console.error('Failed to fetch exchanges');
                }
            } catch (error) {
                console.error('Error fetching exchanges:', error);
            }
        };

        fetchExchanges();
    }, []);

    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedExchange, setSelectedExchange] = useState(null);
    const [readNotificationIds, setReadNotificationIds] = useState(new Set());
    const [activeTab, setActiveTab] = useState('All');

    const [showOptions, setShowOptions] = useState(false);
    const [showCeoReport, setShowCeoReport] = useState(false);

    // Disable background scrolling when modal is open
    React.useEffect(() => {
        const content = document.querySelector('.management-content');
        if (showModal) {
            document.body.style.overflow = 'hidden';
            if (content) content.style.overflowY = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            if (content) content.style.overflowY = 'auto';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
            if (content) content.style.overflowY = 'auto';
        };
    }, [showModal]);

    const handleApprove = async (id, role) => {
        const endpoint = role === 'ceo' ? `approve-ceo` : `approve-hod`;
        try {
            const response = await fetch(`https://duty-exchange-system.onrender.com/api/duty-exchange/${id}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'X-User-Role': userRole.toUpperCase()
                }
            });
            if (response.ok) {
                setExchanges(exchanges.map(ex =>
                    ex.id === id ? {
                        ...ex,
                        status: role === 'ceo' ? 'approved' : ex.status,
                        hodApproval: role === 'hod' ? 'approved' : ex.hodApproval,
                        ceoApproval: role === 'ceo' ? 'approved' : ex.ceoApproval
                    } : ex
                ));
                showNotification('Exchange request approved successfully!', 'success');
            } else {
                showNotification('Failed to approve request', 'error');
            }
        } catch (error) {
            console.error('Error approving request:', error);
            showNotification('Error approving request', 'error');
        }
    };

    const handleReject = async (id, role) => {
        const endpoint = role === 'ceo' ? `reject-ceo` : `reject-hod`;
        try {
            const response = await fetch(`https://duty-exchange-system.onrender.com/api/duty-exchange/${id}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'X-User-Role': userRole.toUpperCase()
                }
            });
            if (response.ok) {
                setExchanges(exchanges.map(ex =>
                    ex.id === id ? {
                        ...ex,
                        status: 'rejected',
                        hodApproval: role === 'hod' ? 'rejected' : ex.hodApproval,
                        ceoApproval: role === 'ceo' ? 'rejected' : ex.ceoApproval
                    } : ex
                ));
                showNotification('Exchange request rejected.', 'error');
            } else {
                showNotification('Failed to reject request', 'error');
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            showNotification('Error rejecting request', 'error');
        }
    };

    const handleViewDetails = (exchange) => {
        setSelectedExchange(exchange);
        setShowModal(true);
        markAsRead(exchange.id);
    };

    const markAsRead = (id) => {
        setReadNotificationIds(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    };

    const markAllAsRead = () => {
        const allPendingIds = exchanges
            .filter(ex => ex.status === 'pending')
            .map(ex => ex.id);

        setReadNotificationIds(prev => {
            const newSet = new Set(prev);
            allPendingIds.forEach(id => newSet.add(id));
            return newSet;
        });
        setShowOptions(false);
    };

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        if (showNotifications) setShowOptions(false);
    };

    const showNotification = (message, type) => {
        // You can implement a toast notification here
        alert(message);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    // Filter notifications based on active tab
    const getFilteredNotifications = () => {
        const pendingExchanges = exchanges.filter(ex => ex.status === 'pending');
        if (activeTab === 'Unread') {
            return pendingExchanges.filter(ex => !readNotificationIds.has(ex.id));
        }
        return pendingExchanges;
    };

    const roleFilteredExchanges = exchanges.filter(ex => {
        if (userRole.toUpperCase() === 'FACULTY' && loggedInUser) {
            const userEmail = loggedInUser.toLowerCase().trim();
            const requestedByEmail = (ex.requestedByEmail || '').toLowerCase().trim();
            // Only show requests created BY this faculty member
            return requestedByEmail === userEmail;
        }
        if (userRole.toUpperCase() === 'CEO' && ex.dutyType === 'MSE') {
            return false;
        }
        return true;
    });

    const unreadCount = roleFilteredExchanges.filter(ex => ex.status === 'pending' && !readNotificationIds.has(ex.id)).length;

    const filteredExchanges = roleFilteredExchanges.filter(ex => {
        const statusMatch = filter === 'all' || ex.status === filter;

        let searchMatch = true;
        if (searchQuery !== '') {
            const query = searchQuery.toLowerCase().trim();
            const requestedBy = (ex.requestedBy || '').toLowerCase();
            const exchangeWith = (ex.exchangeWith || '').toLowerCase();
            const date = (ex.date || '').toLowerCase();
            const formattedDate = formatDate(ex.date).toLowerCase();

            searchMatch = requestedBy.includes(query) ||
                exchangeWith.includes(query) ||
                date.includes(query) ||
                formattedDate.includes(query);
        }

        return statusMatch && searchMatch;
    });



    const formatDuty = (dutyString) => {
        // Format: "MSE - 2024-02-20" -> "MSE - 20-02-2024"
        const parts = dutyString.split(' - ');
        if (parts.length === 2) {
            const [year, month, day] = parts[1].split('-');
            return `${parts[0]} - ${day}-${month}-${year}`;
        }
        return dutyString;
    };

    const getStatusBadge = (status, overallStatus) => {
        if (!status) return null;
        if (status.toLowerCase() === 'not_required') {
            if (overallStatus && overallStatus.toLowerCase() === 'rejected') {
                return <span className="status-badge rejected">N/A</span>;
            }
            return <span className="status-badge approved">N/A</span>;
        }
        const statusClasses = {
            pending: 'status-badge pending',
            approved: 'status-badge approved',
            rejected: 'status-badge rejected'
        };
        const className = statusClasses[status.toLowerCase()] || 'status-badge pending';
        return <span className={className}>{status.toUpperCase()}</span>;
    };

    return (
        <div className="management-container">
            <header className="management-header">
                <div className="header-content">
                    <h1>DUTY EXCHANGE SYSTEM</h1>
                    <p className="subtitle">Faculty Exchange Management Portal</p>
                </div>
                <div className="header-actions" style={{ position: 'relative' }}>
                    <button
                        className="btn-new-request"
                        onClick={() => navigate('/form')}
                    >
                        + New Exchange Request
                    </button>
                    {/* CEO-only: Print filtered faculty details */}
                    {userRole.toUpperCase() === 'CEO' && (
                        <button
                            className="btn-ceo-print-all"
                            onClick={() => setShowCeoReport(true)}
                            title="Print filtered faculty duty exchange details"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                            </svg>
                            Print Report
                        </button>
                    )}
                    <button
                        className="btn-notification"
                        onClick={handleNotificationClick}
                        title="Notifications"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="notification-badge">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">
                            <div className="notification-header">
                                <h3>Notifications</h3>
                                <div style={{ position: 'relative' }}>
                                    <button
                                        className="btn-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowOptions(!showOptions);
                                        }}
                                    >
                                        •••
                                    </button>
                                    {showOptions && (
                                        <div className="options-menu">
                                            <button
                                                className="options-item"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAllAsRead();
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                Mark all as read
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="notification-tabs">
                                <button
                                    className={activeTab === 'All' ? 'active' : ''}
                                    onClick={() => setActiveTab('All')}
                                >
                                    All
                                </button>
                                <button
                                    className={activeTab === 'Unread' ? 'active' : ''}
                                    onClick={() => setActiveTab('Unread')}
                                >
                                    Unread
                                </button>
                            </div>
                            <div className="notification-list">
                                {getFilteredNotifications().length === 0 ? (
                                    <div className="no-notifications">No {activeTab === 'Unread' ? 'unread' : 'new'} notifications</div>
                                ) : (
                                    getFilteredNotifications().map(ex => (
                                        <div key={ex.id} className="notification-item" onClick={() => {
                                            handleViewDetails(ex);
                                            setShowNotifications(false);
                                        }}>
                                            <div className="notification-avatar">
                                                {ex.requestedBy.charAt(0)}
                                            </div>
                                            <div className="notification-content">
                                                <p>
                                                    <strong>{ex.requestedBy}</strong> requested a duty exchange.
                                                </p>
                                                <span className="notification-time">{ex.date}</span>
                                            </div>
                                            {!readNotificationIds.has(ex.id) && (
                                                <div className="notification-indicator"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="management-content">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon pending-icon">📋</div>
                        <div className="stat-info">
                            <h3>{roleFilteredExchanges.filter(ex => ex.status === 'pending').length}</h3>
                            <p>Pending Requests</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon approved-icon">✓</div>
                        <div className="stat-info">
                            <h3>{roleFilteredExchanges.filter(ex => ex.status === 'approved').length}</h3>
                            <p>Approved</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon rejected-icon">✕</div>
                        <div className="stat-info">
                            <h3>{roleFilteredExchanges.filter(ex => ex.status === 'rejected').length}</h3>
                            <p>Rejected</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon total-icon">📊</div>
                        <div className="stat-info">
                            <h3>{roleFilteredExchanges.length}</h3>
                            <p>Total Requests</p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs & Search */}
                <div className="filter-search-container">
                    <div className="filter-tabs">
                        <button
                            className={filter === 'all' ? 'tab active' : 'tab'}
                            onClick={() => setFilter('all')}
                        >
                            All ({roleFilteredExchanges.length})
                        </button>
                        <button
                            className={filter === 'pending' ? 'tab active' : 'tab'}
                            onClick={() => setFilter('pending')}
                        >
                            Pending ({roleFilteredExchanges.filter(ex => ex.status === 'pending').length})
                        </button>
                        <button
                            className={filter === 'approved' ? 'tab active' : 'tab'}
                            onClick={() => setFilter('approved')}
                        >
                            Approved ({roleFilteredExchanges.filter(ex => ex.status === 'approved').length})
                        </button>
                        <button
                            className={filter === 'rejected' ? 'tab active' : 'tab'}
                            onClick={() => setFilter('rejected')}
                        >
                            Rejected ({roleFilteredExchanges.filter(ex => ex.status === 'rejected').length})
                        </button>
                    </div>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by name or date..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>

                {/* Exchanges Table */}
                <div className="table-container">
                    <table className="exchanges-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Requested By</th>
                                <th>Allotted Duty</th>
                                <th>Exchange With</th>
                                <th>Exchange Duty</th>
                                <th>Request Date</th>
                                <th>HOD Status</th>
                                <th>CEO Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExchanges.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="no-data">
                                        No exchange requests found
                                    </td>
                                </tr>
                            ) : (
                                filteredExchanges.map((exchange) => (
                                    <tr key={exchange.id}>
                                        <td>{exchange.readableId}</td>
                                        <td>{exchange.requestedBy}</td>
                                        <td>{formatDuty(exchange.allottedDuty)}</td>
                                        <td>{exchange.exchangeWith}</td>
                                        <td>{formatDuty(exchange.exchangeDuty)}</td>
                                        <td>{formatDate(exchange.date)}</td>
                                        <td>{getStatusBadge(exchange.hodApproval, exchange.status)}</td>
                                        <td>{exchange.dutyType === 'MSE' ? getStatusBadge('not_required', exchange.status) : getStatusBadge(exchange.ceoApproval, exchange.status)}</td>
                                        <td className="actions-cell">
                                            <button
                                                className="btn-view"
                                                onClick={() => handleViewDetails(exchange)}
                                                title="View Details"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-11 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </button>
                                            {/* HOD Actions */}
                                            {exchange.hodApproval === 'pending' && userRole.toUpperCase() === 'HOD' && (
                                                <>
                                                    <button
                                                        className="btn-approve"
                                                        onClick={() => handleApprove(exchange.id, 'hod')}
                                                        title="HOD Approve"
                                                    >
                                                        HOD ✓
                                                    </button>
                                                    <button
                                                        className="btn-reject"
                                                        onClick={() => handleReject(exchange.id, 'hod')}
                                                        title="HOD Reject"
                                                    >
                                                        HOD ✕
                                                    </button>
                                                </>
                                            )}
                                            {/* CEO Actions - Only if HOD Approved and CEO Pending and Duty is SEE */}
                                            {exchange.hodApproval === 'approved' && exchange.ceoApproval === 'pending' && exchange.dutyType === 'SEE' && userRole.toUpperCase() === 'CEO' && (
                                                <>
                                                    <button
                                                        className="btn-approve"
                                                        onClick={() => handleApprove(exchange.id, 'ceo')}
                                                        title="CEO Approve"
                                                    >
                                                        CEO ✓
                                                    </button>
                                                    <button
                                                        className="btn-reject"
                                                        onClick={() => handleReject(exchange.id, 'ceo')}
                                                        title="CEO Reject"
                                                    >
                                                        CEO ✕
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {showModal && selectedExchange && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Exchange Request Details</h2>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Request ID:</span>
                                <span className="detail-value">{selectedExchange.readableId}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Requested By:</span>
                                <span className="detail-value">{selectedExchange.requestedBy}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Allotted Duty:</span>
                                <span className="detail-value">{formatDuty(selectedExchange.allottedDuty)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Exchange With:</span>
                                <span className="detail-value">{selectedExchange.exchangeWith}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Exchange Duty:</span>
                                <span className="detail-value">{formatDuty(selectedExchange.exchangeDuty)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Request Date:</span>
                                <span className="detail-value">{formatDate(selectedExchange.date)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">HOD Approval:</span>
                                <span className="detail-value">{getStatusBadge(selectedExchange.hodApproval, selectedExchange.status)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">CEO Approval:</span>
                                <span className="detail-value">{selectedExchange.dutyType === 'MSE' ? getStatusBadge('not_required', selectedExchange.status) : getStatusBadge(selectedExchange.ceoApproval, selectedExchange.status)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Current Status:</span>
                                <span className="detail-value">{getStatusBadge(selectedExchange.status, selectedExchange.status)}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {selectedExchange.hodApproval === 'pending' && userRole.toUpperCase() === 'HOD' && (
                                <>
                                    <button
                                        className="btn-modal-approve"
                                        onClick={() => {
                                            handleApprove(selectedExchange.id, 'hod');
                                            setShowModal(false);
                                        }}
                                    >
                                        HOD Approve
                                    </button>
                                    <button
                                        className="btn-modal-reject"
                                        onClick={() => {
                                            handleReject(selectedExchange.id, 'hod');
                                            setShowModal(false);
                                        }}
                                    >
                                        HOD Reject
                                    </button>
                                </>
                            )}
                            {selectedExchange.hodApproval === 'approved' && selectedExchange.ceoApproval === 'pending' && selectedExchange.dutyType === 'SEE' && userRole.toUpperCase() === 'CEO' && (
                                <>
                                    <button
                                        className="btn-modal-approve"
                                        onClick={() => {
                                            handleApprove(selectedExchange.id, 'ceo');
                                            setShowModal(false);
                                        }}
                                    >
                                        CEO Approve
                                    </button>
                                    <button
                                        className="btn-modal-reject"
                                        onClick={() => {
                                            handleReject(selectedExchange.id, 'ceo');
                                            setShowModal(false);
                                        }}
                                    >
                                        CEO Reject
                                    </button>
                                </>
                            )}
                            {userRole.toUpperCase() === 'CEO' && (
                                <button
                                    className="btn-modal-approve"
                                    style={{ backgroundColor: '#10b981' }}
                                    onClick={() => window.open(`https://duty-exchange-system.onrender.com/api/duty-exchange/${selectedExchange.id}/pdf`, '_blank')}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginRight: '6px', verticalAlign: 'text-bottom'}}>
                                        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                                    </svg>
                                    Print Form
                                </button>
                            )}
                            <button
                                className="btn-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CEO Consolidated Print Report */}
            {showCeoReport && userRole.toUpperCase() === 'CEO' && (
                <CEOPrintReport
                    exchanges={filteredExchanges.filter(ex => ex.status === 'approved')}
                    onClose={() => setShowCeoReport(false)}
                />
            )}
        </div>
    );
};

export default DutyExchangeManagement;
