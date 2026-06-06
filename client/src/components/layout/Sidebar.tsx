import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiViewGrid,
  HiClipboardList,
  HiExclamationCircle,
  HiClock,
  HiCog,
  HiLogout,
  HiShieldCheck,
  HiUserGroup,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard',     icon: HiViewGrid,          label: 'Dashboard' },
  { to: '/my-tasks',      icon: HiClipboardList,     label: 'My Tasks' },
  { to: '/high-priority', icon: HiExclamationCircle, label: 'High Priority' },
  { to: '/overdue',       icon: HiClock,             label: 'Overdue' },
  { to: '/settings',      icon: HiCog,               label: 'Settings' },
];

const adminNavItems = [
  { to: '/admin/users', icon: HiUserGroup, label: 'User Management' },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={[
          'fixed top-0 bottom-0 left-0 z-30',
          'w-[240px] flex flex-col',
          'bg-sidebar',
          'transition-transform duration-300 ease-in-out',
          'lg:static lg:z-auto lg:translate-x-0 lg:flex-shrink-0 lg:shadow-sidebar',
          isOpen ? 'translate-x-0 shadow-sidebar' : '-translate-x-full shadow-none',
        ].join(' ')}
      >
        {/* User info */}
        <div className="px-5 pt-8 pb-6 flex flex-col items-center gap-3 border-b border-sidebar-border">
          <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-primary-400/30">
            {initials}
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">{user?.name}</p>
            <p className="text-sidebar-text text-xs mt-0.5 truncate max-w-[180px]">
              {user?.email}
            </p>
            {user?.role === 'admin' && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
                <HiShieldCheck size={11} />
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {label}
            </NavLink>
          ))}

          {/* Admin section — visible to admins only */}
          {user?.role === 'admin' && (
            <div className="pt-4 mt-3 border-t border-sidebar-border">
              <p className="flex items-center gap-1.5 px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-text">
                <HiShieldCheck size={13} />
                Admin
              </p>
              {adminNavItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 pt-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="nav-item w-full text-left hover:!text-red-400"
          >
            <HiLogout size={18} className="flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
