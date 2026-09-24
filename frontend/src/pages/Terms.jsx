import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-dark font-sans text-gray-200 selection:bg-brand-500/30 overflow-x-hidden flex flex-col">
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
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
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-brand-500 bg-transparent hover:bg-brand-500/10 border border-brand-500/50 px-6 py-2 rounded-xl transition-all"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 w-full text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Terms of Use</h1>
        <p className="text-brand-500 font-medium mb-12">Last updated: September 2026</p>

        <div className="space-y-8 text-gray-400 leading-relaxed text-sm md:text-base">
          <p>
            By using SecureAI ExamGuard, you agree to the following terms.
          </p>

          <div>
            <h2 className="text-xl font-bold text-white mb-3 tracking-tight">Purpose</h2>
            <p>
              This platform is a student-built academic project intended to showcase full-stack development and AI-based exam proctoring concepts. It is not a certified or commercial examination service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3 tracking-tight">Acceptable Use</h2>
            <p>
              You agree not to misuse the platform, attempt unauthorized access, or use it for any purpose other than demonstration and evaluation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3 tracking-tight">No Warranty</h2>
            <p>
              This platform is provided "as is" for demonstration purposes. No guarantees are made regarding uptime, data accuracy, or exam result validity.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3 tracking-tight">Limitation of Liability</h2>
            <p>
              The developer is not liable for any loss, data issues, or interruptions arising from use of this demo platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3 tracking-tight">Changes</h2>
            <p>
              These terms may be updated at any time as the project evolves.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3 tracking-tight">Contact</h2>
            <p>
              Questions can be directed via the Contact link in the footer.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0a0e14] pt-16 pb-8 border-t border-gray-800 text-center md:text-left mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8">
              <Shield className="w-full h-full text-brand-500 absolute" fill="currentColor" />
              <Check className="w-3 h-3 text-black absolute mt-0.5" strokeWidth={4} />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">SecureAI</span>
              <span className="text-brand-500 font-bold">ExamGuard</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-white transition-colors">Terms of Use</a>
            <a href="mailto:23h41a0582@bvcits.edu.in" className="hover:text-white transition-colors">Contact</a>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-gray-800/50 pt-8 text-center text-sm text-gray-600 font-medium">
          &copy; {new Date().getFullYear()} SecureAI ExamGuard System. All rights reserved. Built for fairness.
        </div>
      </footer>
    </div>
  );
};

export default Terms;
