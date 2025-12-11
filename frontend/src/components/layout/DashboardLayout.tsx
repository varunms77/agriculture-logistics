import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Leaf,
    LayoutDashboard,
    Package,
    Plus,
    History,
    QrCode,
    ScanLine,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    ChevronDown,
    User as UserIcon
} from 'lucide-react';
import './DashboardLayout.css';

const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Package size={20} />, label: 'Batches', path: '/dashboard/batches' },
    { icon: <Plus size={20} />, label: 'Create Batch', path: '/dashboard/batches/create' },
    { icon: <History size={20} />, label: 'Events', path: '/dashboard/events' },
    { icon: <QrCode size={20} />, label: 'QR Codes', path: '/dashboard/qr' },
    { icon: <ScanLine size={20} />, label: 'QR Scanner', path: '/dashboard/qr/scan' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/dashboard/analytics' },
];

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Mock user data
    const user = {
        name: 'Rajesh Kumar',
        email: 'rajesh@goldenvalley.com',
        role: 'Farmer',
        organization: 'Golden Valley Farms',
        avatar: null
    };

    const handleLogout = () => {
        navigate('/');
    };

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="nav-logo">
                        <div className="logo-icon">
                            <Leaf size={22} />
                        </div>
                        <span>AgriTrace</span>
                    </Link>
                    <button
                        className="sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        <span className="sidebar-section-title">Main Menu</span>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="sidebar-section mt-8">
                        <span className="sidebar-section-title">Settings</span>
                        <Link to="/dashboard/settings" className="sidebar-link">
                            <Settings size={20} />
                            <span>Settings</span>
                        </Link>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="user-avatar">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <span>{user.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Top Navbar */}
                <header className="dashboard-topbar">
                    <div className="topbar-left">
                        <button
                            className="menu-toggle"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search batches, events..."
                            />
                        </div>
                    </div>

                    <div className="topbar-right">
                        <button className="topbar-icon-btn">
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </button>

                        <div className="user-menu-container">
                            <button
                                className="user-menu-trigger"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div className="user-avatar small">
                                    <span>{user.name.charAt(0)}</span>
                                </div>
                                <span className="user-name-short">{user.name.split(' ')[0]}</span>
                                <ChevronDown size={16} />
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div
                                        className="user-menu-overlay"
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className="user-menu">
                                        <div className="user-menu-header">
                                            <div className="user-avatar">
                                                <span>{user.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <span className="user-menu-name">{user.name}</span>
                                                <span className="user-menu-email">{user.email}</span>
                                            </div>
                                        </div>
                                        <div className="user-menu-divider"></div>
                                        <Link to="/dashboard/profile" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                                            <UserIcon size={18} />
                                            <span>Profile</span>
                                        </Link>
                                        <Link to="/dashboard/settings" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                                            <Settings size={18} />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="user-menu-divider"></div>
                                        <button className="user-menu-item logout" onClick={handleLogout}>
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
