import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, FileText, Image,
  Award, Mail, Send, Settings, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import omLogo from '../../assets/om-packings.webp';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/inquiries',    icon: Mail,            label: 'Inquiries' },
  { to: '/admin/subscribers',  icon: Send,            label: 'Subscribers' },
  { to: '/admin/products',     icon: Package,         label: 'Products' },
  { to: '/admin/categories',   icon: Tag,             label: 'Categories' },
  { to: '/admin/blog',         icon: FileText,        label: 'Blog' },
  { to: '/admin/gallery',      icon: Image,           label: 'Gallery' },
  { to: '/admin/certificates', icon: Award,           label: 'Certificates' },
  { to: '/admin/settings',     icon: Settings,        label: 'Settings' },
];

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 h-10 rounded-lg text-[14px] font-medium transition-colors ${
        isActive
          ? 'bg-[#FFF7ED] text-orange border border-orange/20'
          : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#FFF7ED] border border-transparent'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon size={16} className={isActive ? 'text-orange' : 'text-[#6B7280]'} />
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out.');
    navigate('/admin/login');
  };

  const Sidebar = ({ onLinkClick }) => (
    <div className="flex flex-col h-full bg-white border-r border-[#E5E7EB] border-t-[3px] border-t-[#C0392B]">
      {/* Brand — minimal admin mark */}
      <div className="px-4 py-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <img
            src={omLogo}
            alt=""
            aria-hidden="true"
            width="22"
            height="22"
            decoding="async"
            className="w-[22px] h-[22px] object-contain flex-shrink-0"
            draggable={false}
          />
          <div className="min-w-0 leading-tight">
            <p className="font-[family-name:var(--font-heading)] text-[11px] tracking-[0.05em]">
              <span className="font-bold" style={{ color: '#C0392B' }}>OM</span>
              <span className="font-medium ml-1" style={{ color: '#1B2A4A' }}>PACKAGING</span>
            </p>
            <p className="text-[8px] text-[#6B7280] uppercase tracking-[0.16em] mt-[2px]">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => (
          <SidebarLink key={item.to} {...item} onClick={onLinkClick} />
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#FFF7ED] border border-orange/20 flex items-center justify-center flex-shrink-0">
            <span className="text-orange font-semibold text-[11px] uppercase">
              {user?.name?.[0] || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[#111827] truncate">{user?.name || 'Admin'}</p>
            <p className="text-[11px] text-[#6B7280] capitalize">{user?.role || 'editor'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 h-9 rounded-lg text-[13px] text-[#6B7280] hover:text-red hover:bg-[#FEF2F2] transition-colors"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-[#111827]/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-64 flex-shrink-0">
            <Sidebar onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white border-b border-[#E5E7EB] h-14 flex items-center px-4 gap-4">
          <button
            className="lg:hidden p-1.5 rounded-md text-[#111827] hover:bg-[#FFF7ED] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <span className="text-[12px] text-[#6B7280]">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </header>

        <main className="flex-1 p-5 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
