import { Link } from 'react-router-dom';
import {
    Package,
    TrendingUp,
    QrCode,
    CheckCircle,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Eye,
    Clock,
    MapPin,
    ChevronRight,
    Cpu
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import './DashboardHome.css';

// Mock data
const stats = [
    {
        label: 'Total Batches',
        value: '1,284',
        change: +12.5,
        icon: <Package size={24} />,
        color: 'primary'
    },
    {
        label: 'Active Batches',
        value: '342',
        change: +8.2,
        icon: <TrendingUp size={24} />,
        color: 'accent'
    },
    {
        label: 'QR Scans Today',
        value: '2,847',
        change: +23.1,
        icon: <QrCode size={24} />,
        color: 'info'
    },
    {
        label: 'Verification Rate',
        value: '99.2%',
        change: +0.3,
        icon: <CheckCircle size={24} />,
        color: 'success'
    }
];

const chartData = [
    { name: 'Jan', batches: 120, scans: 1800 },
    { name: 'Feb', batches: 150, scans: 2200 },
    { name: 'Mar', batches: 180, scans: 2800 },
    { name: 'Apr', batches: 220, scans: 3100 },
    { name: 'May', batches: 280, scans: 3800 },
    { name: 'Jun', batches: 340, scans: 4200 },
    { name: 'Jul', batches: 420, scans: 5100 },
];

const pieData = [
    { name: 'Created', value: 25, color: '#3b82f6' },
    { name: 'In Transit', value: 35, color: '#f59e0b' },
    { name: 'Processing', value: 20, color: '#8b5cf6' },
    { name: 'Completed', value: 20, color: '#10b981' }
];

const recentBatches = [
    {
        id: '1',
        batchId: 'ORG-2024-0847',
        product: 'Organic Wheat',
        origin: 'Golden Valley Farm, Punjab',
        status: 'in_transit',
        date: '2024-12-09'
    },
    {
        id: '2',
        batchId: 'ORG-2024-0846',
        product: 'Basmati Rice',
        origin: 'Green Fields, Haryana',
        status: 'processing',
        date: '2024-12-08'
    },
    {
        id: '3',
        batchId: 'ORG-2024-0845',
        product: 'Organic Cotton',
        origin: 'Pure Cotton Farms, Gujarat',
        status: 'completed',
        date: '2024-12-07'
    },
    {
        id: '4',
        batchId: 'ORG-2024-0844',
        product: 'Fresh Mangoes',
        origin: 'Tropical Orchards, Maharashtra',
        status: 'created',
        date: '2024-12-07'
    }
];

const recentActivity = [
    {
        id: '1',
        type: 'batch_created',
        message: 'New batch ORG-2024-0847 created',
        time: '2 hours ago'
    },
    {
        id: '2',
        type: 'qr_scanned',
        message: 'QR code scanned for ORG-2024-0845',
        time: '3 hours ago'
    },
    {
        id: '3',
        type: 'event_added',
        message: 'Shipping event added to ORG-2024-0846',
        time: '5 hours ago'
    },
    {
        id: '4',
        type: 'batch_split',
        message: 'Batch ORG-2024-0842 split into 3 sub-batches',
        time: '6 hours ago'
    },
    {
        id: '5',
        type: 'blockchain_verified',
        message: 'Blockchain verification completed',
        time: '8 hours ago'
    }
];

const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; label: string }> = {
        created: { class: 'badge-info', label: 'Created' },
        in_transit: { class: 'badge-warning', label: 'In Transit' },
        processing: { class: 'badge-primary', label: 'Processing' },
        completed: { class: 'badge-success', label: 'Completed' }
    };
    return styles[status] || styles.created;
};

const getActivityIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
        batch_created: <Package size={16} />,
        qr_scanned: <QrCode size={16} />,
        event_added: <Clock size={16} />,
        batch_split: <TrendingUp size={16} />,
        blockchain_verified: <Cpu size={16} />
    };
    return icons[type] || <Package size={16} />;
};

const DashboardHome = () => {
    return (
        <div className="dashboard-home">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-subtitle">Welcome back! Here's what's happening with your supply chain.</p>
                    </div>
                    <Link to="/dashboard/batches/create" className="btn btn-primary">
                        <Plus size={20} />
                        Create Batch
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className={`stats-card stat-${stat.color}`}>
                        <div className={`stats-icon stats-icon-${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="stats-content">
                            <span className="stats-value">{stat.value}</span>
                            <span className="stats-label">{stat.label}</span>
                        </div>
                        <div className={`stats-change ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                            {stat.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            <span>{Math.abs(stat.change)}%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                <div className="chart-card chart-card-main">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Batch Activity</h3>
                            <p className="chart-subtitle">Monthly overview of batches and scans</p>
                        </div>
                        <div className="chart-legend">
                            <span className="legend-item">
                                <span className="legend-dot primary"></span>
                                Batches
                            </span>
                            <span className="legend-item">
                                <span className="legend-dot accent"></span>
                                QR Scans
                            </span>
                        </div>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBatches" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="batches"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorBatches)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="scans"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorScans)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Batch Status</h3>
                            <p className="chart-subtitle">Current distribution</p>
                        </div>
                    </div>
                    <div className="chart-body pie-chart-body">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pie-legend">
                            {pieData.map((item, index) => (
                                <div key={index} className="pie-legend-item">
                                    <span className="pie-legend-dot" style={{ background: item.color }}></span>
                                    <span className="pie-legend-label">{item.name}</span>
                                    <span className="pie-legend-value">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-row">
                {/* Recent Batches */}
                <div className="card recent-batches-card">
                    <div className="card-header">
                        <h3>Recent Batches</h3>
                        <Link to="/dashboard/batches" className="view-all-link">
                            View All
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="recent-batches-list">
                        {recentBatches.map((batch) => (
                            <Link
                                key={batch.id}
                                to={`/dashboard/batches/${batch.id}`}
                                className="recent-batch-item"
                            >
                                <div className="batch-icon">
                                    <Package size={20} />
                                </div>
                                <div className="batch-info">
                                    <div className="batch-header">
                                        <span className="batch-id font-mono">{batch.batchId}</span>
                                        <span className={`badge ${getStatusBadge(batch.status).class}`}>
                                            {getStatusBadge(batch.status).label}
                                        </span>
                                    </div>
                                    <span className="batch-product">{batch.product}</span>
                                    <div className="batch-meta">
                                        <span className="batch-origin">
                                            <MapPin size={12} />
                                            {batch.origin}
                                        </span>
                                    </div>
                                </div>
                                <div className="batch-action">
                                    <Eye size={18} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card activity-card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                    </div>
                    <div className="activity-list">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className="activity-icon">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="activity-content">
                                    <span className="activity-message">{activity.message}</span>
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
