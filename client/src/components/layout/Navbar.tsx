import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { HiBell, HiSearch, HiMenuAlt2 } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDashboard = pathname === "/dashboard";
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.error("Please enter a search query.");
      return;
    }
    if (trimmed.length < 2) {
      toast.error("Search query must be at least 2 characters.");
      return;
    }
    navigate(`/my-tasks?search=${encodeURIComponent(trimmed)}`);
  }, [query, navigate]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  }, [handleSearch]);

  return (
    <header className="h-16 flex-shrink-0 bg-white dark:bg-[#13141f] border-b border-gray-200 dark:border-sidebar-border px-4 lg:px-6 flex items-center gap-4 z-10 shadow-sm">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-sidebar-light text-gray-500 dark:text-sidebar-text transition"
        aria-label="Open menu"
      >
        <HiMenuAlt2 size={22} />
      </button>

      {/* Logo */}
      <div className="font-extrabold text-xl select-none flex-shrink-0">
        <span className="text-primary-500">Task</span>
        <span className="text-gray-900 dark:text-white">flow</span>
      </div>

      {/* Search — only on dashboard, hidden on mobile */}
      <div className={`${isDashboard ? "hidden md:flex" : "hidden"} flex-1 max-w-lg mx-auto relative`}>
        <HiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={18}
        />
        <input
          type="text"
          placeholder="Search your task here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field pl-10 py-2.5 text-sm"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center hover:bg-primary-600 transition"
          aria-label="Search"
        >
          <HiSearch size={14} className="text-white" />
        </button>
      </div>

      {/* Right — bell */}
      <div className="ml-auto flex items-center gap-3">
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-primary-500 transition"
            aria-label="Notifications"
          >
            <HiBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-[#13141f]" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1a1b2e] border border-gray-200 dark:border-sidebar-border rounded-xl shadow-lg p-4 z-50">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Notifications</p>
              <div className="flex flex-col items-center justify-center py-6 gap-2 text-gray-400 dark:text-gray-500">
                <HiBell size={32} className="opacity-40" />
                <p className="text-sm text-center">All set — no new notifications yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
