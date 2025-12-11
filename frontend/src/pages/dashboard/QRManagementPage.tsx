import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    QrCode,
    Download,
    Share2,
    Plus,
    Search,
    Filter,
    Eye,
    Copy,
    CheckCircle,
    Printer,
    Package,
    RefreshCw,
    Clock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import './QRManagementPage.css';

// Mock QR data
const qrCodes = [
    {
        id: '1',
        batchId: 'ORG-2024-0847',
        type: 'static',
        product: 'Organic Wheat',
        createdAt: '2024-12-05',
        scans: 47,
        lastScanned: '2024-12-09T14:30:00Z',
        status: 'active',
        url: 'https://agritrace.com/verify?id=ORG-2024-0847',
    },
    {
        id: '2',
        batchId: 'ORG-2024-0846',
        type: 'static',
        product: 'Basmati Rice',
        createdAt: '2024-12-04',
        scans: 32,
        lastScanned: '2024-12-08T10:15:00Z',
        status: 'active',
        url: 'https://agritrace.com/verify?id=ORG-2024-0846',
    },
    {
        id: '3',
        batchId: 'ORG-2024-0845',
        type: 'dynamic',
        product: 'Organic Cotton',
        createdAt: '2024-12-03',
        scans: 1,
        lastScanned: '2024-12-07T16:45:00Z',
        status: 'used',
        url: 'https://agritrace.com/verify?id=ORG-2024-0845&t=abc123',
    },
    {
        id: '4',
        batchId: 'ORG-2024-0844',
        type: 'static',
        product: 'Fresh Mangoes',
        createdAt: '2024-12-02',
        scans: 0,
        lastScanned: null,
        status: 'active',
        url: 'https://agritrace.com/verify?id=ORG-2024-0844',
    },
];

const QRManagementPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQR, setSelectedQR] = useState<typeof qrCodes[0] | null>(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    const filteredQRs = qrCodes.filter(qr =>
        qr.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.product.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const copyUrl = (id: string, url: string) => {
        navigator.clipboard.writeText(url);
        setCopySuccess(id);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    const downloadQR = (batchId: string) => {
        const svg = document.querySelector(`#qr-${batchId} svg`);
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = `QR-${batchId}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    return (
        <div className="qr-management-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">QR Codes</h1>
                        <p className="page-subtitle">Generate and manage QR codes for product traceability</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowGenerateModal(true)}>
                        <Plus size={20} />
                        Generate QR
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="qr-stats">
                <div className="qr-stat-card">
                    <div className="qr-stat-icon">
                        <QrCode size={24} />
                    </div>
                    <div className="qr-stat-content">
                        <span className="qr-stat-value">{qrCodes.length}</span>
                        <span className="qr-stat-label">Total QR Codes</span>
                    </div>
                </div>
                <div className="qr-stat-card">
                    <div className="qr-stat-icon active">
                        <CheckCircle size={24} />
                    </div>
                    <div className="qr-stat-content">
                        <span className="qr-stat-value">{qrCodes.filter(q => q.status === 'active').length}</span>
                        <span className="qr-stat-label">Active Codes</span>
                    </div>
                </div>
                <div className="qr-stat-card">
                    <div className="qr-stat-icon scans">
                        <Eye size={24} />
                    </div>
                    <div className="qr-stat-content">
                        <span className="qr-stat-value">{qrCodes.reduce((sum, q) => sum + q.scans, 0)}</span>
                        <span className="qr-stat-label">Total Scans</span>
                    </div>
                </div>
                <div className="qr-stat-card">
                    <div className="qr-stat-icon dynamic">
                        <RefreshCw size={24} />
                    </div>
                    <div className="qr-stat-content">
                        <span className="qr-stat-value">{qrCodes.filter(q => q.type === 'dynamic').length}</span>
                        <span className="qr-stat-label">Dynamic QRs</span>
                    </div>
                </div>
            </div>

            {/* Search/Filter */}
            <div className="qr-toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by batch ID or product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="btn btn-outline">
                    <Filter size={18} />
                    Filter
                </button>
            </div>

            {/* QR Grid */}
            <div className="qr-grid">
                {filteredQRs.map((qr) => (
                    <div key={qr.id} className="qr-card">
                        <div className="qr-card-header">
                            <span className={`qr-type-badge ${qr.type}`}>
                                {qr.type === 'static' ? 'Static' : 'Dynamic'}
                            </span>
                            <span className={`qr-status-badge ${qr.status}`}>
                                {qr.status === 'active' ? 'Active' : 'Used'}
                            </span>
                        </div>

                        <div className="qr-card-body">
                            <div className="qr-preview" id={`qr-${qr.batchId}`}>
                                <QRCodeSVG
                                    value={qr.url}
                                    size={140}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div className="qr-info">
                                <span className="qr-batch-id font-mono">{qr.batchId}</span>
                                <span className="qr-product">{qr.product}</span>
                            </div>

                            <div className="qr-meta">
                                <div className="qr-meta-item">
                                    <Eye size={14} />
                                    <span>{qr.scans} scans</span>
                                </div>
                                <div className="qr-meta-item">
                                    <Clock size={14} />
                                    <span>{new Date(qr.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="qr-card-actions">
                            <button
                                className="action-btn"
                                onClick={() => setSelectedQR(qr)}
                                title="View Details"
                            >
                                <Eye size={18} />
                            </button>
                            <button
                                className="action-btn"
                                onClick={() => downloadQR(qr.batchId)}
                                title="Download"
                            >
                                <Download size={18} />
                            </button>
                            <button
                                className={`action-btn ${copySuccess === qr.id ? 'success' : ''}`}
                                onClick={() => copyUrl(qr.id, qr.url)}
                                title="Copy URL"
                            >
                                {copySuccess === qr.id ? <CheckCircle size={18} /> : <Copy size={18} />}
                            </button>
                            <button className="action-btn" title="Print">
                                <Printer size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* QR Detail Modal */}
            {selectedQR && (
                <div className="modal-overlay" onClick={() => setSelectedQR(null)}>
                    <div className="modal-content qr-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>QR Code Details</h3>
                            <button className="modal-close" onClick={() => setSelectedQR(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="qr-detail-grid">
                                <div className="qr-detail-preview">
                                    <QRCodeSVG
                                        value={selectedQR.url}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                                <div className="qr-detail-info">
                                    <div className="detail-row">
                                        <span className="label">Batch ID</span>
                                        <span className="value font-mono">{selectedQR.batchId}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Product</span>
                                        <span className="value">{selectedQR.product}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Type</span>
                                        <span className={`qr-type-badge ${selectedQR.type}`}>
                                            {selectedQR.type === 'static' ? 'Static QR' : 'Dynamic (One-Time)'}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Status</span>
                                        <span className={`qr-status-badge ${selectedQR.status}`}>
                                            {selectedQR.status}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Total Scans</span>
                                        <span className="value">{selectedQR.scans}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Created</span>
                                        <span className="value">{new Date(selectedQR.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {selectedQR.lastScanned && (
                                        <div className="detail-row">
                                            <span className="label">Last Scanned</span>
                                            <span className="value">{new Date(selectedQR.lastScanned).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="qr-url-box">
                                <label>Verification URL</label>
                                <div className="url-row">
                                    <code>{selectedQR.url}</code>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => copyUrl(selectedQR.id, selectedQR.url)}
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="qr-detail-actions">
                                <button className="btn btn-primary" onClick={() => downloadQR(selectedQR.batchId)}>
                                    <Download size={18} />
                                    Download PNG
                                </button>
                                <button className="btn btn-outline">
                                    <Printer size={18} />
                                    Print
                                </button>
                                <button className="btn btn-outline">
                                    <Share2 size={18} />
                                    Share
                                </button>
                            </div>

                            <Link
                                to={`/dashboard/batches/${selectedQR.id}`}
                                className="view-batch-link"
                            >
                                <Package size={16} />
                                View Batch Details
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Generate QR Modal */}
            {showGenerateModal && (
                <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
                    <div className="modal-content generate-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Generate QR Code</h3>
                            <button className="modal-close" onClick={() => setShowGenerateModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="generate-options">
                                <div className="generate-option">
                                    <div className="option-icon static">
                                        <QrCode size={32} />
                                    </div>
                                    <div className="option-content">
                                        <h4>Static QR Code</h4>
                                        <p>Permanent QR code for product verification. Contains batch ID and blockchain reference.</p>
                                        <ul>
                                            <li>✓ Unlimited scans</li>
                                            <li>✓ Consumer verification</li>
                                            <li>✓ Blockchain secured</li>
                                        </ul>
                                    </div>
                                    <button className="btn btn-primary btn-sm">Generate</button>
                                </div>

                                <div className="generate-option">
                                    <div className="option-icon dynamic">
                                        <RefreshCw size={32} />
                                    </div>
                                    <div className="option-content">
                                        <h4>Dynamic QR Code</h4>
                                        <p>One-time use QR for transfer events. Expires after first valid scan.</p>
                                        <ul>
                                            <li>✓ Single scan only</li>
                                            <li>✓ Transfer verification</li>
                                            <li>✓ Anti-counterfeit</li>
                                        </ul>
                                    </div>
                                    <button className="btn btn-outline btn-sm">Generate</button>
                                </div>
                            </div>

                            <div className="generate-form">
                                <h4>Select Batch</h4>
                                <select className="input select">
                                    <option value="">Choose a batch...</option>
                                    <option value="ORG-2024-0847">ORG-2024-0847 - Organic Wheat</option>
                                    <option value="ORG-2024-0846">ORG-2024-0846 - Basmati Rice</option>
                                    <option value="ORG-2024-0845">ORG-2024-0845 - Organic Cotton</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRManagementPage;
