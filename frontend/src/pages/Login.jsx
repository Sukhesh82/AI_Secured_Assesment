import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, Eye, EyeOff, Camera, FileText, Clock, Key, ShieldCheck, ChevronRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMode, setLoginMode] = useState(location.state?.mode || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, logout } = useAuth();
  
  const handleRoleSelection = (role) => {
    setLoginMode(role);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid Email address.');
      return;
    }

    setLoading(true);
    
    try {
      const user = await login(email, password);
      // Extra verification just in case
      if (user.role !== loginMode) {
        logout(); // Force logout
        setError(`Access Denied: You are trying to log in as a ${user.role} on the ${loginMode} portal.`);
        setLoading(false);
        return;
      } 
      
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 404)) {
        setError('Invalid credentials or no account found.');
      } else {
        let errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
        
        // Handle Map string from backend
        if (typeof errorMsg === 'string') {
          if (errorMsg.includes('Invalid email format') || errorMsg.includes('{email=')) {
            errorMsg = 'Please enter a valid Email address.';
          } else if (errorMsg.startsWith('{') && errorMsg.endsWith('}')) {
            const matches = errorMsg.match(/=([^,}]+)/g);
            if (matches) {
              errorMsg = matches.map(m => m.substring(1)).join(', ');
            }
          }
        }
        
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex font-sans text-gray-200 relative overflow-hidden">
      
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

        {/* Right Side Login Box */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 relative z-10">
          <div className="mx-auto w-full max-w-md">
            
            <div className="bg-[#18181a] py-12 px-8 sm:px-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-800 relative">
              
              <div className="text-center mb-8 relative z-10">
                <h2 className="text-[28px] font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
                <p className="text-sm text-gray-400 font-medium">
                  {loginMode ? `Login to continue to your account` : 'Select your portal to continue'}
                </p>
                {!loginMode && (
                  <div className="w-12 h-0.5 bg-brand-500 mx-auto mt-6 rounded-full"></div>
                )}
              </div>

              {!loginMode ? (
                <div className="space-y-5 relative z-10 mt-10">
                  <button
                    onClick={() => handleRoleSelection('STUDENT')}
                    className="w-full flex items-center justify-between py-4 px-6 rounded-xl text-base font-semibold text-gray-200 bg-[#222224] hover:bg-[#2a2a2c] transition-all shadow-[inset_2px_0_0_#ff6b00] group"
                  >
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-4 text-brand-500" strokeWidth={2} />
                      Student Login
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  </button>
                  <button
                    onClick={() => handleRoleSelection('ADMIN')}
                    className="w-full flex items-center justify-between py-4 px-6 rounded-xl text-base font-semibold text-gray-200 bg-[#222224] hover:bg-[#2a2a2c] transition-all shadow-[inset_2px_0_0_#ff6b00] group"
                  >
                    <div className="flex items-center">
                      <ShieldCheck className="w-5 h-5 mr-4 text-brand-500" strokeWidth={2} />
                      Admin Login
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  </button>
                </div>
              ) : (
                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md">
                      <p className="text-sm text-red-400 font-medium">{error}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                      User ID / Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="text"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-4 pr-10 py-3.5 text-sm text-white border border-gray-700 rounded-xl bg-[#222224] focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-500 outline-none"
                        placeholder="Enter your user ID or email"
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
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-4 pr-10 py-3.5 text-sm text-white border border-gray-700 rounded-xl bg-[#222224] focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors placeholder-gray-500 outline-none"
                        placeholder="Enter your password"
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

                  <div className="flex items-center justify-between text-sm pt-1 pb-2">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-600 bg-[#222224] rounded cursor-pointer"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-gray-400 font-medium cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="font-semibold text-brand-500 hover:text-brand-400 transition-colors">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-4 px-4 rounded-xl shadow-glow-orange text-base font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  <div className="text-center mt-6 text-sm font-medium text-gray-400 pt-4 border-t border-gray-800">
                    <button type="button" onClick={() => setLoginMode(null)} className="hover:text-white transition-colors mr-4">
                      &larr; Back
                    </button>
                    {loginMode === 'STUDENT' && (
                      <span className="mt-4 inline-block">
                        Don't have an account?{' '}
                        <a href="/register" className="font-bold text-brand-500 hover:text-brand-400 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
                          Register
                        </a>
                      </span>
                    )}
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
