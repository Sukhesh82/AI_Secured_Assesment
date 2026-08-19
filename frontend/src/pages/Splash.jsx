import React from 'react';
import { ShieldCheck, Camera, User, FileText, Clock } from 'lucide-react';

const Splash = () => {
  return (
    <div className="min-h-screen bg-bg-dark font-sans text-gray-200 selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* Dark background */}
      <div className="fixed inset-0 z-0 bg-[#0f0f11]">
        {/* Subtle orange glow behind the logo */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        {/* Central Graphic */}
        <div className="relative w-[340px] h-[340px] flex items-center justify-center mb-10">
          
          {/* Concentric Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] border border-brand-500/20 rounded-full border-dashed"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border border-brand-500/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border border-brand-500/5 rounded-full border-dashed"></div>

          {/* The logo image */}
          <div className="relative z-20 flex items-center justify-center">
            <img 
              src="/custom_center_logo.png" 
              alt="Secure Exam Logo" 
              className="w-32 h-auto object-contain drop-shadow-[0_0_30px_rgba(255,107,0,0.4)]"
            />
          </div>

          {/* Orbiting Icons */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#131316] p-2 rounded-full border border-brand-500/20 shadow-[0_0_10px_rgba(255,107,0,0.1)]">
              <Camera className="w-4 h-4 text-brand-500" />
            </div>
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 bg-[#131316] p-2 rounded-full border border-brand-500/20 shadow-[0_0_10px_rgba(255,107,0,0.1)]">
              <User className="w-4 h-4 text-brand-500" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#131316] p-2 rounded-full border border-brand-500/20 shadow-[0_0_10px_rgba(255,107,0,0.1)]">
              <FileText className="w-4 h-4 text-brand-500" />
            </div>
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 bg-[#131316] p-2 rounded-full border border-brand-500/20 shadow-[0_0_10px_rgba(255,107,0,0.1)]">
              <Clock className="w-4 h-4 text-brand-500" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center space-x-3 mb-10">
          <ShieldCheck className="w-8 h-8 text-brand-500" strokeWidth={2.5} />
          <h1 className="text-3xl font-extrabold tracking-widest text-white uppercase">
            Secure Exam <span className="text-brand-500">System</span>
          </h1>
        </div>

        {/* Divider / Glow Line */}
        <div className="w-64 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent mb-8"></div>

        {/* Taglines */}
        <h2 className="text-xl font-bold text-gray-200 mb-4 tracking-wide">
          Safe. Reliable. Fair.
        </h2>
        <p className="text-[#888] text-sm md:text-base max-w-xs mx-auto leading-relaxed mb-16">
          Empowering the future<br/>of assessments.
        </p>

        {/* Footer */}
        <p className="text-xs text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} Secure Exam System. All rights reserved.
        </p>

      </main>

    </div>
  );
};

export default Splash;
