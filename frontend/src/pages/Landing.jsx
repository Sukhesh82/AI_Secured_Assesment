import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, BrainCircuit, Lock, BarChart3, ChevronRight, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-brand-500" />,
      title: 'AI-Based Proctoring',
      description: 'Advanced behavioral analysis and computer vision to detect suspicious activities in real-time.'
    },
    {
      icon: <Shield className="w-8 h-8 text-brand-500" />,
      title: 'Anti-Malpractice',
      description: 'Multi-layered protection against tab switching, screen sharing, and unauthorized devices.'
    },
    {
      icon: <Lock className="w-8 h-8 text-brand-500" />,
      title: 'Secure & Encrypted',
      description: 'End-to-end encryption for all exam data, ensuring integrity and strict confidentiality.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-brand-500" />,
      title: 'Instant Analytics',
      description: 'Comprehensive reporting and deep insights generated immediately upon exam completion.'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-dark font-sans text-gray-200 selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#131316]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
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

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-6 max-w-7xl mx-auto text-center min-h-[75vh]">
        <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wider backdrop-blur-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>THE PLATFORM OF ASSESSMENTS</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-500 leading-[1.1] mb-6">
          Secure Exam System
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Empowering educational institutions and enterprises with an ultra-secure, AI-powered online examination platform designed to eliminate malpractice and streamline results.
        </p>

        <div className="flex items-center justify-center">
          <button 
            onClick={() => navigate('/register')}
            className="flex items-center justify-center px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-glow-orange transition-all hover:-translate-y-1 group"
          >
            Get Started
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 w-full text-left">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-[#131316]/80 backdrop-blur-md border border-gray-800 hover:border-brand-500/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 group hover:shadow-[0_10px_40px_-10px_rgba(255,107,0,0.15)]"
            >
              <div className="bg-[#1c1c1e] w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-800">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-20 py-8 text-center">
        <p className="text-sm text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} Secure Exam System. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

export default Landing;
