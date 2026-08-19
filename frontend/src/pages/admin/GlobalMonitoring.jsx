import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Shield, Eye, Clock, Activity, Video } from 'lucide-react';

const GlobalMonitoring = () => {
  const [activeExams, setActiveExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveExams();
  }, []);

  const fetchActiveExams = async () => {
    try {
      // First get all active attempts across the platform
      const attemptsRes = await api.get('/admin/monitoring/active');
      
      // Then get all exams to map titles
      const examsRes = await api.get('/admin/exams');
      
      const attempts = attemptsRes.data;
      const exams = examsRes.data;

      // Group attempts by examId to see how many students are active per exam
      const examMap = new Map();
      
      // Initialize map with published exams that have active window
      const now = new Date();
      exams.forEach(ex => {
        if (ex.published) {
          const start = ex.startTime ? new Date(ex.startTime) : null;
          const end = ex.endTime ? new Date(ex.endTime) : null;
          
          if ((!start || now >= start) && (!end || now <= end)) {
             examMap.set(ex.id, {
               ...ex,
               activeStudentsCount: 0,
               highRiskCount: 0,
               mediumRiskCount: 0
             });
          }
        }
      });

      // Count attempts
      attempts.forEach(attempt => {
        if (examMap.has(attempt.examId)) {
          const examData = examMap.get(attempt.examId);
          examData.activeStudentsCount += 1;
          
          if (attempt.riskLevel === 'HIGH') examData.highRiskCount += 1;
          if (attempt.riskLevel === 'MEDIUM') examData.mediumRiskCount += 1;
        }
      });

      setActiveExams(Array.from(examMap.values()));
      setLoading(false);
    } catch (err) {
      console.error("Failed to load active exams", err);
      setError('Failed to load active exams');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading Global Monitoring...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Activity className="w-6 h-6 mr-2 text-brand-600" />
            Global Live Monitoring
          </h1>
          <p className="text-gray-400">Select an active exam to launch the real-time proctoring feed.</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-brand-500/10 px-4 py-2 rounded-lg border border-brand-500/20 flex items-center">
             <div className="w-2 h-2 rounded-full bg-brand-500/100 animate-pulse mr-2"></div>
             <span className="text-sm font-bold text-brand-900">{activeExams.length} Active Exams</span>
          </div>
          <button onClick={fetchActiveExams} className="px-4 py-2 bg-[#131316] border shadow-sm rounded-lg text-sm font-medium hover:bg-gray-800/30">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeExams.map(exam => (
          <div key={exam.id} className="dark-card overflow-hidden hover:border-brand-300 transition-colors">
            <div className={`p-4 border-b ${exam.highRiskCount > 0 ? 'bg-red-500/10 border-red-100' : 'bg-gray-800/30 border-gray-800'}`}>
               <div className="flex justify-between items-start">
                 <h2 className="text-lg font-bold text-white leading-tight">{exam.title}</h2>
                 <span className="bg-[#131316] px-2 py-1 text-xs font-bold rounded shadow-sm border border-gray-800">ID: {exam.id}</span>
               </div>
               <div className="text-sm text-brand-600 font-semibold mt-1">
                 {exam.subject}
               </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center text-sm text-gray-400 mb-4">
                <Clock className="w-4 h-4 mr-2" />
                Duration: {exam.durationMinutes} mins
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                 <div className="bg-gray-800/30 rounded p-2 border">
                   <div className="text-2xl font-bold text-white">{exam.activeStudentsCount}</div>
                   <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">Active</div>
                 </div>
                 <div className={`rounded p-2 border ${exam.mediumRiskCount > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-800/30 border-gray-800'}`}>
                   <div className={`text-2xl font-bold ${exam.mediumRiskCount > 0 ? 'text-yellow-700' : 'text-white'}`}>{exam.mediumRiskCount}</div>
                   <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">Medium Risk</div>
                 </div>
                 <div className={`rounded p-2 border ${exam.highRiskCount > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-gray-800/30 border-gray-800'}`}>
                   <div className={`text-2xl font-bold ${exam.highRiskCount > 0 ? 'text-red-700' : 'text-white'}`}>{exam.highRiskCount}</div>
                   <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">High Risk</div>
                 </div>
              </div>

              <button 
                onClick={() => navigate(`/admin/proctoring/${exam.id}`)}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                <Video className="w-4 h-4 mr-2" />
                Launch Live Proctoring
              </button>
            </div>
          </div>
        ))}

        {activeExams.length === 0 && (
          <div className="col-span-full py-16 dark-card text-center flex flex-col items-center">
            <Shield className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-white">No Active Exams</h3>
            <p className="text-gray-400 mt-1 max-w-sm">There are currently no published exams within their active time window.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalMonitoring;
