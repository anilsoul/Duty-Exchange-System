import React from 'react';
import './CEOPrintReport.css';

/**
 * CEOPrintReport
 * Renders a printable consolidated report of ALL faculty duty-exchange records.
 * Only accessible / visible when userRole === 'CEO'.
 *
 * Props:
 *   exchanges  – array of mapped exchange objects from DutyExchangeManagement
 *   onClose    – callback to hide the report overlay
 */
const CEOPrintReport = ({ exchanges, onClose }) => {
    React.useEffect(() => {
        document.body.classList.add('ceo-printing');
        return () => {
            document.body.classList.remove('ceo-printing');
        };
    }, []);

    const today = new Date();
    const printDate = today.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    // Extract plain date from "DutyType - YYYY-MM-DD" format
    const extractDate = (dutyString) => {
        if (!dutyString) return '—';
        const parts = dutyString.split(' - ');
        if (parts.length === 2) {
            return formatDate(parts[1]);
        }
        return dutyString;
    };

    // Extract department from exchangedWith duty info — stored on the exchange object
    const extractDept = (exchange) => {
        // The department comes from the backend via the allotted faculty's department field
        // We'll show allotted dept as "From Department"
        return exchange.department || '—';
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="ceo-report-overlay">
            {/* ── Screen version: action bar ── */}
            <div className="ceo-report-actions no-print">
                <span className="ceo-report-title-label">
                    📋 Consolidated Faculty Duty Exchange Report
                </span>
                <div className="ceo-report-btns">
                    <button className="btn-ceo-print" onClick={handlePrint}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                        </svg>
                        Print
                    </button>
                    <button className="btn-ceo-close" onClick={onClose}>
                        ✕ Close
                    </button>
                </div>
            </div>

            {/* ── Printable content ── */}
            <div className="ceo-report-page">
                {/* Header */}
                <div className="ceo-report-header">
                    <h1 className="ceo-report-institution">NMIT, BENGALURU</h1>
                    <h2 className="ceo-report-subtitle">
                        CONSOLIDATED FACULTY DUTY EXCHANGE REPORT
                    </h2>
                    <p className="ceo-report-meta">
                        <span>Printed By: CEO</span>
                        <span>Date: {printDate}</span>
                        <span>Total Records: {exchanges.length}</span>
                    </p>
                </div>

                {/* Table */}
                <table className="ceo-report-table">
                    <thead>
                        <tr>
                            <th className="col-sl">Sl. No.</th>
                            <th className="col-date">Request Date</th>
                            <th className="col-faculty">Faculty Name<br />(Requesting)</th>
                            <th className="col-dept">Department<br />(From)</th>
                            <th className="col-duty">Duty Type &amp;<br />Duty Date</th>
                            <th className="col-exchange-faculty">Exchange With<br />(Faculty)</th>
                            <th className="col-exchange-dept">Exchange<br />Department</th>
                            <th className="col-exchange-duty">Exchange Duty<br />Type &amp; Date</th>
                            <th className="col-hod">HOD<br />Status</th>
                            <th className="col-ceo">CEO<br />Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exchanges.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="ceo-no-data">
                                    No duty exchange records found.
                                </td>
                            </tr>
                        ) : (
                            exchanges.map((ex, index) => {
                                const allottedParts = (ex.allottedDuty || '').split(' - ');
                                const allottedType = allottedParts[0] || '—';
                                const allottedDate = allottedParts.length > 1 ? formatDate(allottedParts[1]) : '—';

                                const exchParts = (ex.exchangeDuty || '').split(' - ');
                                const exchType = exchParts[0] || '—';
                                const exchDate = exchParts.length > 1 ? formatDate(exchParts[1]) : '—';

                                const overallStatus = ex.status || 'pending';
                                const hodStatus = ex.hodApproval || 'pending';
                                const ceoStatus = ex.dutyType === 'MSE' ? 'N/A' : (ex.ceoApproval || 'pending');

                                return (
                                    <tr key={ex.id} className={`row-${overallStatus}`}>
                                        <td className="col-sl center">{index + 1}</td>
                                        <td className="col-date center">{formatDate(ex.date)}</td>
                                        <td className="col-faculty">{ex.requestedBy || '—'}</td>
                                        <td className="col-dept center">{ex.allottedDept || '—'}</td>
                                        <td className="col-duty center">
                                            <span className="duty-type-badge">{allottedType}</span>
                                            <br />
                                            <span className="duty-date">{allottedDate}</span>
                                        </td>
                                        <td className="col-exchange-faculty">{ex.exchangeWith || '—'}</td>
                                        <td className="col-exchange-dept center">{ex.exchangedWithDept || '—'}</td>
                                        <td className="col-exchange-duty center">
                                            <span className="duty-type-badge">{exchType}</span>
                                            <br />
                                            <span className="duty-date">{exchDate}</span>
                                        </td>
                                        <td className={`col-hod center status-${hodStatus.toLowerCase()}`}>
                                            {hodStatus.toUpperCase()}
                                        </td>
                                        <td className={`col-ceo center status-${ceoStatus.toLowerCase()}`}>
                                            {ceoStatus.toUpperCase()}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {/* Footer */}
                <div className="ceo-report-footer">
                    <div className="footer-sign-block">
                        <div className="footer-sign-line"></div>
                        <p>Signature of CEO</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CEOPrintReport;
