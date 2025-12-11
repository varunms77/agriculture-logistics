import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Package,
    MapPin,
    Calendar,
    Weight,
    QrCode,
    Download,
    Share2,
    MoreVertical,
    CheckCircle,
    Clock,
    Truck,
    Factory,
    ShoppingBag,
    Leaf,
    FileText,
    Shield,
    Cpu,
    Copy,
    ExternalLink,
    GitBranch,
    Plus
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import './BatchDetailPage.css';

// Mock batch data
const mockBatch = {
    id: '1',
    batchId: 'ORG-2024-0847',
    product: {
        name: 'Organic Wheat',
        type: 'Grain',
        variety: 'Lokwan',
        description: 'Premium quality organic wheat grown without pesticides or synthetic fertilizers. Certified under India Organic standards.',
    },
    weight: 500,
    weightUnit: 'kg',
    quantity: 20,
    quantityUnit: 'bags',
    status: 'in_transit',
    origin: {
        farm: 'Golden Valley Farms',
        farmerId: 'F-2024-001',
        location: 'Jalandhar, Punjab, India',
        coordinates: { lat: 31.3260, lng: 75.5762 },
        harvestDate: '2024-12-05',
    },
    certifications: [
        { name: 'India Organic', issuer: 'APEDA', validUntil: '2025-12-31', verified: true },
        { name: 'Non-GMO Verified', issuer: 'Non-GMO Project', validUntil: '2025-06-30', verified: true },
        { name: 'FSSAI Approved', issuer: 'FSSAI', validUntil: '2026-01-15', verified: true },
    ],
    blockchain: {
        hash: '0x8f4a2b7c9d3e1f6a0b5c8d2e4f7a1b3c5d7e9f1a2b4c6d8e0f2a4b6c8d0e2f4a',
        network: 'Polygon',
        contractAddress: '0x1234...5678',
        gasUsed: '45,230',
        timestamp: '2024-12-05T10:30:00Z',
        blockNumber: 52847392,
    },
    currentCustodian: {
        name: 'GreenMart Logistics',
        role: 'Distributor',
        location: 'Delhi NCR',
        since: '2024-12-08',
    },
    events: [
        {
            id: 1,
            type: 'harvested',
            title: 'Harvested',
            description: 'Wheat harvested from organic certified fields',
            location: 'Golden Valley Farms, Punjab',
            timestamp: '2024-12-05T06:00:00Z',
            actor: 'Rajesh Kumar (Farmer)',
            verified: true,
            txHash: '0xabc...123',
        },
        {
            id: 2,
            type: 'quality_checked',
            title: 'Quality Inspection',
            description: 'Passed quality tests - Moisture: 12%, Purity: 99.2%',
            location: 'Farm Testing Lab',
            timestamp: '2024-12-05T14:00:00Z',
            actor: 'Quality Inspector',
            verified: true,
            txHash: '0xdef...456',
            documents: ['quality_report.pdf'],
        },
        {
            id: 3,
            type: 'processed',
            title: 'Processing Complete',
            description: 'Cleaned, sorted, and packaged into 25kg bags',
            location: 'Green Mills Processing Unit',
            timestamp: '2024-12-06T10:00:00Z',
            actor: 'Green Mills Ltd.',
            verified: true,
            txHash: '0xghi...789',
        },
        {
            id: 4,
            type: 'shipped',
            title: 'Dispatched',
            description: 'Loaded onto truck TN-01-AB-1234 for distribution',
            location: 'Green Mills Dispatch Center',
            timestamp: '2024-12-07T08:00:00Z',
            actor: 'GreenMart Logistics',
            verified: true,
            txHash: '0xjkl...012',
            temperature: '24°C',
            humidity: '45%',
        },
        {
            id: 5,
            type: 'received',
            title: 'In Transit',
            description: 'Currently in transit to Delhi distribution center',
            location: 'En route - Haryana',
            timestamp: '2024-12-08T16:00:00Z',
            actor: 'GreenMart Logistics',
            verified: true,
            txHash: '0xmno...345',
        },
    ],
    childBatches: [
        { id: 'ORG-2024-0847-A', weight: 200, status: 'processing' },
        { id: 'ORG-2024-0847-B', weight: 150, status: 'in_transit' },
    ],
    parentBatch: null,
    documents: [
        { name: 'Organic Certificate', type: 'pdf', size: '245 KB', url: '#' },
        { name: 'Quality Report', type: 'pdf', size: '128 KB', url: '#' },
        { name: 'Transport Manifest', type: 'pdf', size: '89 KB', url: '#' },
    ],
    qrScans: 47,
    lastScanned: '2024-12-09T14:30:00Z',
};

const getEventIcon = (type: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
        harvested: <Leaf size={20} />,
        quality_checked: <CheckCircle size={20} />,
        stored: <Package size={20} />,
        processed: <Factory size={20} />,
        shipped: <Truck size={20} />,
        received: <ShoppingBag size={20} />,
        split: <GitBranch size={20} />,
    };
    return icons[type] || <Clock size={20} />;
};

const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; label: string }> = {
        created: { class: 'badge-info', label: 'Created' },
        in_transit: { class: 'badge-warning', label: 'In Transit' },
        processing: { class: 'badge-primary', label: 'Processing' },
        split: { class: 'badge-blockchain', label: 'Split' },
        completed: { class: 'badge-success', label: 'Completed' },
    };
    return styles[status] || { class: 'badge-neutral', label: status };
};

const BatchDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('timeline');
    const [showQRModal, setShowQRModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const batch = mockBatch; // In real app, fetch by id

    const copyHash = () => {
        navigator.clipboard.writeText(batch.blockchain.hash);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    // Unused but keeping for potential future use
    void copySuccess; // Referenced in JSX

    return (
        <div className="batch-detail-page">
            {/* Header */}
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    Back to Batches
                </button>

                <div className="header-content">
                    <div className="header-left">
                        <div className="batch-icon-large">
                            <Package size={32} />
                        </div>
                        <div className="header-info">
                            <div className="header-title-row">
                                <h1 className="batch-title">{batch.product.name}</h1>
                                <span className={`badge ${getStatusBadge(batch.status).class}`}>
                                    {getStatusBadge(batch.status).label}
                                </span>
                            </div>
                            <span className="batch-id-large font-mono">{batch.batchId}</span>
                            <div className="header-meta">
                                <span><MapPin size={14} /> {batch.origin.location}</span>
                                <span><Calendar size={14} /> Harvested {new Date(batch.origin.harvestDate).toLocaleDateString()}</span>
                                <span><Weight size={14} /> {batch.weight} {batch.weightUnit}</span>
                            </div>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="btn btn-outline" onClick={() => setShowQRModal(true)}>
                            <QrCode size={18} />
                            View QR
                        </button>
                        <Link to={`/dashboard/batches/${id}/add-event`} className="btn btn-primary">
                            <Plus size={18} />
                            Add Event
                        </Link>
                        <button className="btn btn-ghost btn-icon">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-box">
                    <span className="stat-label">Current Location</span>
                    <span className="stat-value">{batch.currentCustodian.location}</span>
                    <span className="stat-sub">{batch.currentCustodian.name}</span>
                </div>
                <div className="stat-box">
                    <span className="stat-label">QR Scans</span>
                    <span className="stat-value">{batch.qrScans}</span>
                    <span className="stat-sub">Last: {new Date(batch.lastScanned).toLocaleDateString()}</span>
                </div>
                <div className="stat-box">
                    <span className="stat-label">Events Logged</span>
                    <span className="stat-value">{batch.events.length}</span>
                    <span className="stat-sub">All verified on chain</span>
                </div>
                <div className="stat-box blockchain">
                    <span className="stat-label">Blockchain</span>
                    <span className="stat-value">{batch.blockchain.network}</span>
                    <span className="stat-sub">Block #{batch.blockchain.blockNumber}</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="detail-tabs">
                <button
                    className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
                    onClick={() => setActiveTab('timeline')}
                >
                    <Clock size={18} />
                    Timeline
                </button>
                <button
                    className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                >
                    <FileText size={18} />
                    Details
                </button>
                <button
                    className={`tab ${activeTab === 'blockchain' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blockchain')}
                >
                    <Cpu size={18} />
                    Blockchain
                </button>
                <button
                    className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
                    onClick={() => setActiveTab('documents')}
                >
                    <FileText size={18} />
                    Documents
                </button>
                {batch.childBatches && batch.childBatches.length > 0 && (
                    <button
                        className={`tab ${activeTab === 'lineage' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lineage')}
                    >
                        <GitBranch size={18} />
                        Lineage
                    </button>
                )}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                    <div className="timeline-container animate-fadeIn">
                        <div className="timeline-header">
                            <h3>Event Timeline</h3>
                            <p>Complete journey from farm to current location</p>
                        </div>
                        <div className="event-timeline">
                            {batch.events.map((event, index) => (
                                <div key={event.id} className="event-item">
                                    <div className="event-connector">
                                        <div className={`event-dot ${event.verified ? 'verified' : ''}`}>
                                            {getEventIcon(event.type)}
                                        </div>
                                        {index < batch.events.length - 1 && <div className="event-line"></div>}
                                    </div>
                                    <div className="event-content">
                                        <div className="event-header">
                                            <h4>{event.title}</h4>
                                            <div className="event-badges">
                                                {event.verified && (
                                                    <span className="verified-tag">
                                                        <Shield size={12} />
                                                        Verified
                                                    </span>
                                                )}
                                                <span className="event-time">
                                                    {new Date(event.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="event-desc">{event.description}</p>
                                        <div className="event-meta">
                                            <span className="meta-item">
                                                <MapPin size={12} />
                                                {event.location}
                                            </span>
                                            <span className="meta-item">
                                                👤 {event.actor}
                                            </span>
                                            {event.temperature && (
                                                <span className="meta-item">🌡️ {event.temperature}</span>
                                            )}
                                            {event.humidity && (
                                                <span className="meta-item">💧 {event.humidity}</span>
                                            )}
                                        </div>
                                        {event.txHash && (
                                            <div className="event-tx">
                                                <span className="tx-label">Tx:</span>
                                                <code className="tx-hash">{event.txHash}</code>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <div className="details-container animate-fadeIn">
                        <div className="details-grid">
                            <div className="detail-card">
                                <h4>Product Information</h4>
                                <div className="detail-list">
                                    <div className="detail-row">
                                        <span className="label">Product Name</span>
                                        <span className="value">{batch.product.name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Type</span>
                                        <span className="value">{batch.product.type}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Variety</span>
                                        <span className="value">{batch.product.variety}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Weight</span>
                                        <span className="value">{batch.weight} {batch.weightUnit}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Quantity</span>
                                        <span className="value">{batch.quantity} {batch.quantityUnit}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-card">
                                <h4>Origin Details</h4>
                                <div className="detail-list">
                                    <div className="detail-row">
                                        <span className="label">Farm</span>
                                        <span className="value">{batch.origin.farm}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Farmer ID</span>
                                        <span className="value font-mono">{batch.origin.farmerId}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Location</span>
                                        <span className="value">{batch.origin.location}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Harvest Date</span>
                                        <span className="value">{new Date(batch.origin.harvestDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-card full-width">
                                <h4>Certifications</h4>
                                <div className="cert-grid">
                                    {batch.certifications.map((cert, index) => (
                                        <div key={index} className="cert-card">
                                            <div className="cert-icon">
                                                <Shield size={24} />
                                            </div>
                                            <div className="cert-info">
                                                <span className="cert-name">{cert.name}</span>
                                                <span className="cert-issuer">Issued by {cert.issuer}</span>
                                                <span className="cert-validity">Valid until {new Date(cert.validUntil).toLocaleDateString()}</span>
                                            </div>
                                            {cert.verified && (
                                                <span className="cert-verified">
                                                    <CheckCircle size={16} />
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Blockchain Tab */}
                {activeTab === 'blockchain' && (
                    <div className="blockchain-container animate-fadeIn">
                        <div className="blockchain-card-dark">
                            <div className="blockchain-header">
                                <div className="blockchain-icon">
                                    <Cpu size={32} />
                                </div>
                                <div className="blockchain-status">
                                    <CheckCircle size={20} />
                                    <span>Verified on {batch.blockchain.network}</span>
                                </div>
                            </div>

                            <div className="blockchain-details">
                                <div className="bc-row">
                                    <span className="bc-label">Transaction Hash</span>
                                    <div className="bc-hash-row">
                                        <code className="bc-hash">{batch.blockchain.hash}</code>
                                        <button
                                            className={`btn btn-ghost btn-sm ${copySuccess ? 'success' : ''}`}
                                            onClick={copyHash}
                                        >
                                            {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="bc-grid">
                                    <div className="bc-item">
                                        <span className="bc-label">Network</span>
                                        <span className="bc-value">{batch.blockchain.network}</span>
                                    </div>
                                    <div className="bc-item">
                                        <span className="bc-label">Block Number</span>
                                        <span className="bc-value">#{batch.blockchain.blockNumber}</span>
                                    </div>
                                    <div className="bc-item">
                                        <span className="bc-label">Gas Used</span>
                                        <span className="bc-value">{batch.blockchain.gasUsed}</span>
                                    </div>
                                    <div className="bc-item">
                                        <span className="bc-label">Timestamp</span>
                                        <span className="bc-value">{new Date(batch.blockchain.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>

                                <a href="#" className="bc-explorer-link">
                                    <ExternalLink size={16} />
                                    View on Block Explorer
                                </a>
                            </div>
                        </div>

                        <div className="event-hashes">
                            <h4>Event Transaction Hashes</h4>
                            <div className="hash-list">
                                {batch.events.filter(e => e.txHash).map((event) => (
                                    <div key={event.id} className="hash-item">
                                        <span className="hash-event">{event.title}</span>
                                        <code className="hash-value">{event.txHash}</code>
                                        <span className="hash-date">{new Date(event.timestamp).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                    <div className="documents-container animate-fadeIn">
                        <div className="docs-header">
                            <h3>Attached Documents</h3>
                            <button className="btn btn-outline btn-sm">
                                <Plus size={16} />
                                Upload Document
                            </button>
                        </div>
                        <div className="docs-list">
                            {batch.documents.map((doc, index) => (
                                <div key={index} className="doc-item">
                                    <div className="doc-icon">
                                        <FileText size={24} />
                                    </div>
                                    <div className="doc-info">
                                        <span className="doc-name">{doc.name}</span>
                                        <span className="doc-meta">{doc.type.toUpperCase()} • {doc.size}</span>
                                    </div>
                                    <div className="doc-actions">
                                        <button className="btn btn-ghost btn-sm">
                                            <Download size={16} />
                                        </button>
                                        <button className="btn btn-ghost btn-sm">
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lineage Tab */}
                {activeTab === 'lineage' && (
                    <div className="lineage-container animate-fadeIn">
                        <div className="lineage-header">
                            <h3>Batch Lineage</h3>
                            <p>View parent and child batch relationships</p>
                        </div>

                        <div className="lineage-tree">
                            <div className="lineage-node parent">
                                <div className="node-content">
                                    <GitBranch size={20} />
                                    <div className="node-info">
                                        <span className="node-id font-mono">{batch.batchId}</span>
                                        <span className="node-weight">{batch.weight} {batch.weightUnit} (Parent)</span>
                                    </div>
                                    <span className={`badge ${getStatusBadge(batch.status).class}`}>
                                        {getStatusBadge(batch.status).label}
                                    </span>
                                </div>
                            </div>

                            <div className="lineage-branches">
                                {batch.childBatches?.map((child) => (
                                    <div key={child.id} className="lineage-node child">
                                        <div className="branch-line"></div>
                                        <div className="node-content">
                                            <Package size={18} />
                                            <div className="node-info">
                                                <span className="node-id font-mono">{child.id}</span>
                                                <span className="node-weight">{child.weight} {batch.weightUnit}</span>
                                            </div>
                                            <span className={`badge ${getStatusBadge(child.status).class}`}>
                                                {getStatusBadge(child.status).label}
                                            </span>
                                            <Link to={`/dashboard/batches/${child.id}`} className="btn btn-ghost btn-sm">
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="split-action">
                                <Link to={`/dashboard/batches/${id}/split`} className="btn btn-outline">
                                    <GitBranch size={18} />
                                    Split This Batch
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* QR Modal */}
            {showQRModal && (
                <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
                    <div className="modal-content qr-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Batch QR Code</h3>
                            <button className="modal-close" onClick={() => setShowQRModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="qr-display">
                                <QRCodeSVG
                                    value={`https://agritrace.com/verify?id=${batch.batchId}`}
                                    size={220}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <div className="qr-info">
                                <span className="qr-batch-id font-mono">{batch.batchId}</span>
                                <p>Scan to verify product authenticity</p>
                            </div>
                            <div className="qr-actions">
                                <button className="btn btn-primary">
                                    <Download size={18} />
                                    Download QR
                                </button>
                                <button className="btn btn-outline">
                                    <Share2 size={18} />
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BatchDetailPage;
