import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, BrainCircuit, Lock, BarChart3, ChevronRight, CheckCircle2, LogIn, Laptop, FileText, MonitorPlay, ClipboardCheck, Monitor, Camera, Wifi, RefreshCw, KeyRound, FileLock2, Video, Database, Headset } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [sysCheckStatus, setSysCheckStatus] = useState('idle');

  const runSystemCheck = async () => {
    setSysCheckStatus('checking');
    try {
      if (!navigator.onLine) throw new Error('Offline');
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      // In a real app we'd stop the tracks immediately to turn off the camera light
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        stream.getTracks().forEach(track => track.stop());
      }).catch(()=>{});
      setSysCheckStatus('success');
    } catch (error) {
      setSysCheckStatus('error');
    }
  };

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

  const steps = [
    { icon: <LogIn className="w-6 h-6 text-brand-500" />, title: 'Login', desc: 'Secure portal access' },
    { icon: <Laptop className="w-6 h-6 text-brand-500" />, title: 'System Check', desc: 'Verify hardware' },
    { icon: <FileText className="w-6 h-6 text-brand-500" />, title: 'Read Instructions', desc: 'Accept exam rules' },
    { icon: <MonitorPlay className="w-6 h-6 text-brand-500" />, title: 'Take Proctored Exam', desc: 'AI monitored session' },
    { icon: <ClipboardCheck className="w-6 h-6 text-brand-500" />, title: 'Auto-Submit', desc: 'Instant result generation' }
  ];

  const compliance = [
    { icon: <KeyRound className="w-6 h-6 text-brand-500" />, title: 'JWT Authenticated' },
    { icon: <FileLock2 className="w-6 h-6 text-brand-500" />, title: 'End-to-End Encrypted' },
    { icon: <Video className="w-6 h-6 text-brand-500" />, title: 'Session Monitoring' },
    { icon: <Database className="w-6 h-6 text-brand-500" />, title: 'Secure Data Storage' }
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
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
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
        
        {/* 1. How the Exam Works */}
        <div className="w-full mt-32 text-left">
          <h2 className="text-3xl font-extrabold text-white mb-10 text-center tracking-tight">How the Exam Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="bg-[#131316]/80 backdrop-blur-md border border-gray-800 p-6 rounded-3xl relative hover:border-brand-500/30 transition-colors">
                <div className="absolute -top-3 -left-3 bg-[#1c1c1e] border border-gray-800 text-brand-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="bg-[#1c1c1e] w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-gray-800">
                  {step.icon}
                </div>
                <h4 className="text-white font-bold mb-2">{step.title}</h4>
                <p className="text-xs text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. System Requirements */}
        <div className="w-full mt-32 bg-[#131316]/80 backdrop-blur-md border border-gray-800 p-10 rounded-3xl text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight">Before You Begin</h2>
              <p className="text-gray-400 mb-8 max-w-lg">Please ensure your system meets the requirements to take a proctored exam smoothly without interruptions.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-[#1c1c1e] p-3 rounded-xl border border-gray-800"><Monitor className="w-5 h-5 text-brand-500"/></div>
                  <div>
                    <h5 className="text-white font-bold text-sm">Supported Browser</h5>
                    <p className="text-gray-500 text-xs">Chrome, Firefox, Edge, Safari (latest versions)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#1c1c1e] p-3 rounded-xl border border-gray-800"><Camera className="w-5 h-5 text-brand-500"/></div>
                  <div>
                    <h5 className="text-white font-bold text-sm">Webcam & Microphone</h5>
                    <p className="text-gray-500 text-xs">Required for AI Proctoring & Identity Verification</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#1c1c1e] p-3 rounded-xl border border-gray-800"><Wifi className="w-5 h-5 text-brand-500"/></div>
                  <div>
                    <h5 className="text-white font-bold text-sm">Internet Speed</h5>
                    <p className="text-gray-500 text-xs">Minimum 1 Mbps stable connection</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1c1c1e] p-8 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center w-full md:w-auto min-w-[300px]">
              <Shield className="w-16 h-16 text-brand-500 mb-4 opacity-80" />
              <h4 className="text-white font-bold mb-2">Check Your System</h4>
              <p className="text-sm text-gray-400 mb-6 max-w-[250px]">Verify your camera, microphone, and internet connection.</p>
              
              <button 
                onClick={runSystemCheck}
                disabled={sysCheckStatus === 'checking'}
                className="flex items-center justify-center px-6 py-3 w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
              >
                {sysCheckStatus === 'checking' ? (
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                )}
                {sysCheckStatus === 'checking' ? 'Checking...' : sysCheckStatus === 'success' ? 'All Systems Go!' : 'Run System Check'}
              </button>
              
              {sysCheckStatus === 'error' && (
                <p className="text-red-400 text-xs mt-3">Check failed. Ensure camera/mic permissions are granted and you are online.</p>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* 3. Security & Compliance strip */}
      <div className="relative z-10 w-full bg-[#0a0e14] border-y border-gray-800 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {compliance.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
              <div className="bg-brand-500/10 p-4 rounded-full border border-brand-500/20">
                {item.icon}
              </div>
              <span className="text-gray-400 font-semibold text-sm tracking-wide">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Live Interface Preview */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight">See the Exam Interface</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">Experience a clean, distraction-free environment that looks and feels exactly like leading professional assessment platforms.</p>
        
        <div className="relative rounded-3xl border border-gray-800 bg-[#1c1c1e] p-2 md:p-4 shadow-2xl mx-auto max-w-5xl overflow-hidden group">
          <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
          {/* Static placeholder for the asset they will upload */}
          <div className="aspect-[16/9] w-full rounded-2xl bg-[#131316] border border-gray-800 flex items-center justify-center overflow-hidden relative">
            <img 
              src="/placeholder-interface.png" 
              alt="Exam Interface Preview" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 flex-col items-center justify-center text-gray-500 hidden">
              <MonitorPlay className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">Exam Interface Preview Image</p>
              <p className="text-xs opacity-50">(Replace /placeholder-interface.png in public folder)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Support Bar */}
      <div className="relative z-10 w-full bg-brand-500/10 border-y border-brand-500/20 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <Headset className="w-5 h-5 text-brand-400" />
          <span className="text-gray-300 font-medium text-sm">Need help during your exam?</span>
          <a href="mailto:23h41a0582@bvcits.edu.in" className="text-brand-400 hover:text-brand-300 font-bold text-sm transition-colors border-b border-brand-400/30 hover:border-brand-400">
            Contact Support
          </a>
        </div>
      </div>

      {/* 6. Footer */}
      <footer className="relative z-10 bg-[#0a0e14] pt-16 pb-8 text-center md:text-left">
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
            <a href="/terms" className="hover:text-white transition-colors">Terms of Use</a>
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

export default Landing;
