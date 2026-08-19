import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FileText, Clock, PlayCircle, CheckCircle, XCircle, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/student/exams');
      setExams(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch available exams');
      setLoading(false);
    }
  };

  const handleStartExam = async (examId) => {
    try {
      const response = await api.post(`/student/exams/${examId}/start`);
      // Start the exam
      navigate(`/exam/${response.data.id}/attempt`);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to start exam. You may have already attempted it.');
    }
  };

  if (loading) return <div className="text-center p-8 text-gray-400">Loading exams...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">Available Exams</h1>
      
      {exams.length === 0 ? (
        <div className="dark-card p-12 text-center text-gray-400">
          <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Exams Available</h3>
          <p>Check back later or contact your administrator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="dark-card overflow-hidden flex flex-col group">
              <div className="p-6 flex-1 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-brand-500/10 text-brand-600 rounded-lg border border-brand-500/20 shadow-sm">
                      {exam.subject}
                    </span>
                    <span className="flex items-center text-xs font-medium text-gray-400 bg-gray-800/30 border border-gray-100 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3 mr-1.5 text-gray-400" />
                      {exam.durationMinutes} mins
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-brand-600 transition-colors">{exam.title}</h3>
                  <p className="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed">{exam.description}</p>
                  
                  <div className="space-y-3 text-sm text-gray-400 font-medium bg-gray-800/30 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                        Total Marks
                      </div>
                      <span className="text-white font-bold">{exam.totalMarks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400">
                        <XCircle className="w-4 h-4 mr-2 text-red-400" />
                        Negative Marks
                      </div>
                      <span className="text-white font-bold">{exam.negativeMarks}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 p-5 border-t border-gray-100 relative z-10">
                <button
                  onClick={() => handleStartExam(exam.id)}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-brand-500/100 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:-translate-y-0.5"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  START EXAM
                </button>
                <p className="text-[11px] text-center text-gray-400 mt-3 font-medium flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  Secure proctoring will activate
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
