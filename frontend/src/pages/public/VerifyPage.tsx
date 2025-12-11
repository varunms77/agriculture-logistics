import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Leaf,
    Shield,
    CheckCircle,
    XCircle,
    QrCode,
    MapPin,
    Calendar,
    Package,
    Truck,
    Factory,
    ShoppingBag,
    ExternalLink,
    Copy,
    ChevronDown,
    AlertTriangle,
    Cpu
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import './VerifyPage.css';

// Mock verification data
const mockBatchData = {
    batchId: 'ORG-2024-0847',
    isValid: true,
    blockchainVerified: true,
    product: {
        name: 'Organic Wheat',
        type: 'Grain',
        weight: 500,
        unit: 'kg',
        description: 'Premium quality organic wheat grown without pesticides or synthetic fertilizers.',
        image: '🌾'
    },
    origin: {
        farm: 'Golden Valley Farms',
        location: 'Punjab, India',
        harvestDate: '2024-12-05'
    },
    certifications: ['Organic Certified', 'Non-GMO', 'FSSAI Approved'],
    journey: [
        {
            id: 1,
            event: 'Harvested',
            description: 'Wheat harvested from fields',
            location: 'Golden Valley Farms, Punjab',
            date: '2024-12-05',
            icon: 'harvest',
            verified: true
        },
        {
            id: 2,
            event: 'Quality Checked',
            description: 'Passed quality inspection',
            location: 'Farm Testing Lab',
            date: '2024-12-06',
            icon: 'quality',
            verified: true
        },
        {
            id: 3,
            event: 'Processing',
            description: 'Cleaned and packaged',
            location: 'Green Mills Processing Unit',
            date: '2024-12-07',
            icon: 'process',
            verified: true
        },
        {
            id: 4,
            event: 'Shipped',
            description: 'Dispatched for distribution',
            location: 'Delhi Distribution Center',
            date: '2024-12-08',
            icon: 'ship',
            verified: true
        },
        {
            id: 5,
            event: 'Delivered',
            description: 'Received at retail outlet',
            location: 'Fresh Mart, Mumbai',
            date: '2024-12-09',
            icon: 'deliver',
            verified: true
        }
    ],
    blockchain: {
        hash: '0x8f4a2b7c9d3e1f6a0b5c8d2e4f7a1b3c5d7e9f1a2b4c6d8e0f2a4b6c8d0e2f4a',
        network: 'Ethereum',
        timestamp: '2024-12-05T10:30:00Z'
    }
};

const getEventIcon = (iconType: string) => {
    const icons: Record<string, JSX.Element> = {
        harvest: <Leaf size={20} />,
        quality: <CheckCircle size={20} />,
        process: <Factory size={20} />,
        ship: <Truck size={20} />,
        deliver: <ShoppingBag size={20} />
    };
    return icons[iconType] || <Package size={20} />;
};

const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<typeof mockBatchData | null>(null);
    const [showFullHash, setShowFullHash] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');

    // Get batch ID from URL query
    const batchId = searchParams.get('id') || 'ORG-2024-0847';

    useEffect(() => {
        // Simulate API verification
        const verifyBatch = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setData(mockBatchData);
            setIsLoading(false);
        };

        verifyBatch();
    }, [batchId]);

    const copyHash = () => {
        if (data?.blockchain.hash) {
            navigator.clipboard.writeText(data.blockchain.hash);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const truncateHash = (hash: string) => {
        return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
    };

    return (
        <div className="verify-page">
            {/* Header */}
            <nav className="verify-nav">
                <div className="container">
                    <Link to="/" className="nav-logo">
                        <div className="logo-icon">
                            <Leaf size={22} />
                        </div>
                        <span>AgriTrace</span>
                    </Link>
                    <span className="verify-badge">
                        <QrCode size={16} />
                        Product Verification
                    </span>
                </div>
            </nav>

            <main className="verify-main">
                <div className="container">
                    {isLoading ? (
                        <div className="verify-loading">
                            <div className="loading-spinner"></div>
                            <h3>Verifying Product</h3>
                            <p>Checking blockchain records...</p>
                        </div>
                    ) : data?.isValid ? (
                        <div className="verify-content">
                            {/* Verification Status */}
                            <div className="verify-status verified">
                                <div className="status-icon">
                                    <CheckCircle size={48} />
                                </div>
                                <div className="status-content">
                                    <h1>Authentic Product</h1>
                                    <p>This product has been verified on the blockchain</p>
                                </div>
                                <div className="status-badges">
                                    <span className="badge badge-success">
                                        <Shield size={14} />
                                        Verified
                                    </span>
                                    {data.blockchainVerified && (
                                        <span className="badge badge-blockchain">
                                            <Cpu size={14} />
                                            Blockchain Secured
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="verify-tabs">
                                <button
                                    className={`tab ${activeSection === 'overview' ? 'active' : ''}`}
                                    onClick={() => setActiveSection('overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    className={`tab ${activeSection === 'journey' ? 'active' : ''}`}
                                    onClick={() => setActiveSection('journey')}
                                >
                                    Journey
                                </button>
                                <button
                                    className={`tab ${activeSection === 'blockchain' ? 'active' : ''}`}
                                    onClick={() => setActiveSection('blockchain')}
                                >
                                    Blockchain
                                </button>
                            </div>

                            {/* Overview Section */}
                            {activeSection === 'overview' && (
                                <div className="verify-section animate-fadeIn">
                                    <div className="product-card">
                                        <div className="product-image">
                                            <span>{data.product.image}</span>
                                        </div>
                                        <div className="product-details">
                                            <span className="batch-id font-mono">{data.batchId}</span>
                                            <h2>{data.product.name}</h2>
                                            <p className="product-desc">{data.product.description}</p>

                                            <div className="product-meta">
                                                <div className="meta-item">
                                                    <span className="meta-label">Weight</span>
                                                    <span className="meta-value">{data.product.weight} {data.product.unit}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-label">Type</span>
                                                    <span className="meta-value">{data.product.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="info-cards">
                                        <div className="info-card">
                                            <div className="info-card-icon">
                                                <MapPin size={22} />
                                            </div>
                                            <div className="info-card-content">
                                                <span className="info-label">Origin</span>
                                                <span className="info-value">{data.origin.farm}</span>
                                                <span className="info-sub">{data.origin.location}</span>
                                            </div>
                                        </div>

                                        <div className="info-card">
                                            <div className="info-card-icon">
                                                <Calendar size={22} />
                                            </div>
                                            <div className="info-card-content">
                                                <span className="info-label">Harvest Date</span>
                                                <span className="info-value">
                                                    {new Date(data.origin.harvestDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="certifications-section">
                                        <h3>Certifications</h3>
                                        <div className="cert-list">
                                            {data.certifications.map((cert, index) => (
                                                <div key={index} className="cert-item">
                                                    <CheckCircle size={18} />
                                                    <span>{cert}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Journey Section */}
                            {activeSection === 'journey' && (
                                <div className="verify-section animate-fadeIn">
                                    <h3 className="section-title">Product Journey</h3>
                                    <p className="section-desc">Track this product's complete journey from farm to your hands</p>

                                    <div className="journey-timeline">
                                        {data.journey.map((event, index) => (
                                            <div key={event.id} className="journey-item">
                                                <div className="journey-line"></div>
                                                <div className={`journey-dot ${event.verified ? 'verified' : ''}`}>
                                                    {getEventIcon(event.icon)}
                                                </div>
                                                <div className="journey-content">
                                                    <div className="journey-header">
                                                        <h4>{event.event}</h4>
                                                        {event.verified && (
                                                            <span className="verified-badge">
                                                                <CheckCircle size={12} />
                                                                Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="journey-desc">{event.description}</p>
                                                    <div className="journey-meta">
                                                        <span className="journey-location">
                                                            <MapPin size={12} />
                                                            {event.location}
                                                        </span>
                                                        <span className="journey-date">
                                                            <Calendar size={12} />
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Blockchain Section */}
                            {activeSection === 'blockchain' && (
                                <div className="verify-section animate-fadeIn">
                                    <h3 className="section-title">Blockchain Verification</h3>
                                    <p className="section-desc">Immutable record stored on {data.blockchain.network}</p>

                                    <div className="blockchain-card">
                                        <div className="blockchain-visual">
                                            <div className="blockchain-icon">
                                                <Cpu size={40} />
                                            </div>
                                            <div className="blockchain-status">
                                                <CheckCircle size={20} />
                                                <span>Verified on Chain</span>
                                            </div>
                                        </div>

                                        <div className="blockchain-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Transaction Hash</span>
                                                <div className="hash-container">
                                                    <code className="hash-value">
                                                        {showFullHash ? data.blockchain.hash : truncateHash(data.blockchain.hash)}
                                                    </code>
                                                    <button
                                                        className="hash-toggle"
                                                        onClick={() => setShowFullHash(!showFullHash)}
                                                    >
                                                        <ChevronDown size={16} style={{ transform: showFullHash ? 'rotate(180deg)' : 'none' }} />
                                                    </button>
                                                    <button
                                                        className={`copy-btn ${copySuccess ? 'success' : ''}`}
                                                        onClick={copyHash}
                                                    >
                                                        {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="detail-row">
                                                <span className="detail-label">Network</span>
                                                <span className="detail-value">{data.blockchain.network}</span>
                                            </div>

                                            <div className="detail-row">
                                                <span className="detail-label">Timestamp</span>
                                                <span className="detail-value">
                                                    {new Date(data.blockchain.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <a href="#" className="blockchain-explorer">
                                            <ExternalLink size={16} />
                                            View on Block Explorer
                                        </a>
                                    </div>

                                    <div className="qr-section">
                                        <h4>Shareable QR Code</h4>
                                        <div className="qr-container-wrapper">
                                            <div className="qr-box">
                                                <QRCodeSVG
                                                    value={`https://agritrace.com/verify?id=${data.batchId}`}
                                                    size={160}
                                                    level="H"
                                                    includeMargin={true}
                                                />
                                            </div>
                                            <p>Scan to verify this product</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Report Section */}
                            <div className="report-section">
                                <AlertTriangle size={18} />
                                <span>See something wrong?</span>
                                <a href="#report">Report an issue</a>
                            </div>
                        </div>
                    ) : (
                        <div className="verify-status invalid">
                            <div className="status-icon">
                                <XCircle size={48} />
                            </div>
                            <div className="status-content">
                                <h1>Verification Failed</h1>
                                <p>This product could not be verified. It may be counterfeit or not registered in our system.</p>
                            </div>
                            <div className="status-actions">
                                <Link to="/" className="btn btn-primary">
                                    Go to Homepage
                                </Link>
                                <a href="#report" className="btn btn-outline">
                                    Report Issue
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="verify-footer">
                <div className="container">
                    <p>Powered by <strong>AgriTrace</strong> - Building trust in agriculture</p>
                </div>
            </footer>
        </div>
    );
};

export default VerifyPage;
