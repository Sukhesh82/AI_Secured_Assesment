import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  HelpCircle, 
  Activity, 
  BarChart3, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  UserCheck
} from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/exams', label: 'Exams Manager', icon: FileText },
    { to: '/admin/questions', label: 'Question Bank', icon: HelpCircle },
    { to: '/admin/monitoring', label: 'Live Monitoring', icon: Activity, badge: 'LIVE' },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: ShieldAlert },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/exams', label: 'Available Exams', icon: Clock },
    { to: '/student/results', label: 'My Exam Results', icon: CheckCircle2 },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-[#131316] border-r border-gray-800 p-4 min-h-[calc(100vh-4rem)] flex flex-col justify-between z-30 relative">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
            {isAdmin ? 'Administration' : 'Student Portal'}
          </p>
        </div>

        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin/dashboard' || item.to === '/student/dashboard'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1c1c1e] text-brand-500 border border-brand-500/30 shadow-glow-orange'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse shadow-glow-orange">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Security Status Footnote */}
      <div className="p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 text-xs text-gray-400 space-y-1">
        <div className="flex items-center gap-2 text-green-400 font-medium">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Anti-Malpractice Active</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-tight">
          Session protected by STOMP over WS, full-screen lock enforcement & biometric tracking.
        </p>
      </div>
    </aside>
  );
};
export default Sidebar;
