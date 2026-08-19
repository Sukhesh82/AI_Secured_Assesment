import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Check, LogOut, User, Bell, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-bg-dark border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 group-hover:scale-105 transition-transform">
            <Shield className="w-8 h-8 text-brand-500 absolute" fill="currentColor" />
            <Check className="w-4 h-4 text-black absolute mt-0.5" strokeWidth={4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                SecureAI
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
                ExamGuard
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">Anti-Malpractice Platform</p>
          </div>
        </Link>

        {/* User Actions */}
        {user ? (
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                to="/admin/monitoring"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-all radar-live"
              >
                <Activity className="w-3.5 h-3.5" />
                Live Proctoring
              </Link>
            )}

            <div className="flex items-center gap-3 pl-3 border-l border-gray-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <div className="flex items-center justify-end gap-1.5 text-xs text-gray-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-brand-500 shadow-glow-orange' : 'bg-green-500 shadow-glow-green'}`}></span>
                  <span>{user.role}</span>
                  {user.studentId && <span className="font-mono text-[11px] text-gray-500">({user.studentId})</span>}
                </div>
              </div>

              <div className="h-9 w-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-200 font-semibold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-lg shadow-glow-orange transition-all"
            >
              Register Student
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
export default Navbar;
