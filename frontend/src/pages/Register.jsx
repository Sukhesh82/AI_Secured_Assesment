import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Eye, EyeOff, Camera, FileText, Clock, Key, ShieldCheck, CheckCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid Email address.');
      return;
    }

    setLoading(true);
    
    try {
      await register(name, email, password, 'STUDENT');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        login(email, password)
          .then(() => navigate('/student/dashboard'))
          .catch(() => navigate('/login', { state: { mode: 'STUDENT' } }));
      }, 2500);
    } catch (err) {
      let errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      
      if (errorMsg.toLowerCase().includes('already registered') || errorMsg.toLowerCase().includes('already exists') || errorMsg.toLowerCase().includes('duplicate')) {
        errorMsg = 'This account already exists. Please login.';
      } else if (typeof errorMsg === 'string' && errorMsg.startsWith('{') && errorMsg.endsWith('}')) {
        const matches = errorMsg.match(/=([^,}]+)/g);
        if (matches) {
          errorMsg = matches.map(m => m.substring(1)).join(', ');
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex font-sans text-gray-200 relative overflow-hidden">
      
      {/* Success Popup (Toast) */}
      {success && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-green-500/10 backdrop-blur-md text-green-400 px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.2)] flex items-center space-x-3 border border-green-500/30" style={{ animation: 'fade-in-down 0.3s ease-out forwards' }}>
          <CheckCircle className="w-6 h-6" />
          <span className="font-bold">Account created successfully. Welcome</span>
        </div>
      )}

      {/* Dynamic Background Elements - subtle */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="flex w-full max-w-7xl mx-auto z-10">
        
        {/* Left Side Graphic */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center items-center relative">
          
          <div className="relative flex flex-col items-center">
            
            <div className="relative w-[400px] h-[400px] flex items-center justify-center mb-12">
              
              {/* Thin orange concentric circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] border border-brand-500/20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-brand-500/10 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] border border-brand-500/5 rounded-full"></div>

              {/* Central Glowing Orb */}
              <div className="relative z-20 flex items-center justify-center w-[140px] h-[140px] bg-gradient-to-tr from-brand-600 to-brand-400 rounded-full shadow-[0_0_60px_rgba(255,107,0,0.6)]">
                <ShieldCheck className="w-16 h-16 text-[#111]" strokeWidth={2} />
              </div>

              {/* Orbiting Icons */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                {/* Top Left - Camera */}
                <div className="absolute top-[10%] left-[10%] bg-[#1a1a1c] p-3 rounded-full border border-gray-800 shadow-md">
                  <Camera className="w-5 h-5 text-brand-500" strokeWidth={2} />
                </div>
                {/* Top Right - User */}
                <div className="absolute top-[10%] right-[10%] bg-[#1a1a1c] p-3 rounded-full border border-gray-800 shadow-md">
                  <User className="w-5 h-5 text-brand-500" strokeWidth={2} />
                </div>
                {/* Bottom Left - File */}
                <div className="absolute bottom-[10%] left-[10%] bg-[#1a1a1c] p-3 rounded-full border border-gray-800 shadow-md">
                  <FileText className="w-5 h-5 text-brand-500" strokeWidth={2} />
                </div>
                {/* Bottom Right - Clock */}
                <div className="absolute bottom-[10%] right-[10%] bg-[#1a1a1c] p-3 rounded-full border border-gray-800 shadow-md">
                  <Clock className="w-5 h-5 text-brand-500" strokeWidth={2} />
                </div>
              </div>
            </div>

            <div className="text-center relative z-20">
              <div className="flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-brand-500 mr-3" strokeWidth={2.5} />
                <h1 className="text-2xl font-black tracking-widest text-white uppercase">
                  Secure Exam <span className="text-brand-500">System</span>
                </h1>
              </div>
              
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent mx-auto mb-6"></div>
              
              <p className="text-white font-bold text-[17px] mb-2 tracking-wide">Safe. Reliable. Fair.</p>
              <p className="text-[#888] max-w-sm mx-auto text-sm leading-relaxed">
                Empowering the future<br/>of assessments.
              </p>
            </div>
            
          </div>
          
          <div className="absolute bottom-8 text-center text-gray-500 text-xs font-medium w-full z-20">
            &copy; {new Date().getFullYear()} Secure Exam System. All rights reserved.
          </div>
        </div>

        {/* Right Side Register Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 relative z-10 overflow-y-auto">
          <div className="mx-auto w-full max-w-md my-auto">
            
            <div className="bg-[#18181a] py-10 px-8 sm:px-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-800 relative">
              
              <div className="text-center mb-8 relative z-10">
                <h2 className="text-[28px] font-bold text-white mb-2 tracking-tight">Create Account</h2>
                <p className="text-sm text-gray-400 font-medium">Register as a student to take exams</p>
                <div className="w-12 h-0.5 bg-brand-500 mx-auto mt-6 rounded-full"></div>
              </div>

              <form className="space-y-5 relative z-10 mt-8" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md">
                    <p className="text-sm text-red-400 font-medium">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-4 pr-10 py-3.5 text-sm text-white border border-gray-700 rounded-xl bg-[#222224] focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-500 outline-none"
                      placeholder="Enter your full name"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-4 pr-10 py-3.5 text-sm text-white border border-gray-700 rounded-xl bg-[#222224] focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-500 outline-none"
                      placeholder="Enter your email"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-4 pr-10 py-3.5 text-sm text-white border border-gray-700 rounded-xl bg-[#222224] focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-500 outline-none"
                      placeholder="Create a password"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-brand-500 hover:text-brand-400 transition-colors" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-4 pr-10 py-3.5 text-sm text-white border border-gray-700 rounded-xl bg-[#222224] focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-500 outline-none"
                      placeholder="Confirm your password"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-4 w-4 text-brand-500 hover:text-brand-400 transition-colors" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-4 px-4 rounded-xl shadow-glow-orange text-base font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                  >
                    {loading ? 'Creating Account...' : 'Register'}
                  </button>
                </div>

                <div className="text-center mt-6 text-sm font-medium text-gray-400 pt-6 border-t border-gray-800">
                  <span className="inline-block">
                    Already have an account?{' '}
                    <a href="/login" className="font-bold text-brand-500 hover:text-brand-400 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/login', { state: { mode: 'STUDENT' } }); }}>
                      Login here
                    </a>
                  </span>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
