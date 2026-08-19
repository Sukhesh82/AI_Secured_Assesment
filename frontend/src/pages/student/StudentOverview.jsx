import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, Clock, ArrowRight, BarChart } from 'lucide-react';

const StudentOverview = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [attemptsRes, examsRes] = await Promise.all([
          api.get('/student/my-attempts'),
          api.get('/student/exams')
        ]);
        
        // Filter only completed attempts for results
        const completedAttempts = attemptsRes.data.filter(
          attempt => attempt.status === 'SUBMITTED' || attempt.status === 'AUTO_SUBMITTED' || attempt.status === 'FLAGGED'
        );
        
        setResults(completedAttempts);
        setAvailableExams(examsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center p-8 text-gray-400">Loading dashboard...</div>;

  const completedExams = results.length;
  const averageScore = results.length > 0 
    ? (results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(1) 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dark-card p-6 flex items-center">
          <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-500 mr-5 border border-brand-500/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 tracking-wide uppercase mb-1">Available Exams</p>
            <p className="text-3xl font-bold text-white tracking-tight">{availableExams.length}</p>
          </div>
        </div>
        
        <div className="dark-card p-6 flex items-center">
          <div className="p-4 rounded-2xl bg-green-500/10 text-green-500 mr-5 border border-green-100">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 tracking-wide uppercase mb-1">Completed</p>
            <p className="text-3xl font-bold text-white tracking-tight">{completedExams}</p>
          </div>
        </div>

        <div className="dark-card p-6 flex items-center">
          <div className="p-4 rounded-2xl bg-purple-50 text-purple-500 mr-5 border border-purple-100">
            <BarChart className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 tracking-wide uppercase mb-1">Avg Score</p>
            <p className="text-3xl font-bold text-white tracking-tight">{averageScore}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <div className="dark-card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-800/30">
            <h2 className="text-lg font-bold text-white tracking-wide">Recent Results</h2>
            <Link to="/student/results" className="text-sm text-brand-500 hover:text-brand-600 transition-colors flex items-center font-medium">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6">
            {results.length === 0 ? (
              <div className="text-center text-gray-400 py-4 font-medium">No exams completed yet.</div>
            ) : (
              <div className="space-y-4">
                {results.slice(0, 3).map((result) => (
                  <div key={result.id} className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl border border-gray-100 hover:border-gray-800 transition-colors">
                    <div>
                      <p className="font-bold text-white mb-1">{result.examTitle}</p>
                      <p className="text-xs text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1 opacity-70" />
                        {new Date(result.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg text-brand-500 tracking-tight">{result.score} <span className="text-gray-400 text-sm font-medium">/ {result.examTotalMarks}</span></p>
                      <p className="text-xs font-bold text-gray-400 bg-[#131316] border border-gray-800 inline-block px-2 py-0.5 rounded-full mt-1 shadow-sm">
                        {((result.score / result.examTotalMarks) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Up Next */}
        <div className="dark-card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-800/30">
            <h2 className="text-lg font-bold text-white tracking-wide">Up Next</h2>
            <Link to="/student/exams" className="text-sm text-brand-500 hover:text-brand-600 transition-colors flex items-center font-medium">
              Browse exams <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6">
            {availableExams.length === 0 ? (
              <div className="text-center text-gray-400 py-4 font-medium">You're all caught up! No pending exams.</div>
            ) : (
              <div className="space-y-4">
                {availableExams.slice(0, 3).map((exam) => (
                  <div key={exam.id} className="flex justify-between items-center p-4 border border-gray-100 bg-gray-800/30 rounded-xl hover:border-brand-200 transition-all hover:-translate-y-0.5 group">
                    <div>
                      <p className="font-bold text-white mb-1 group-hover:text-brand-600 transition-colors">{exam.title}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1 opacity-70" />
                        {exam.durationMinutes} mins
                      </div>
                    </div>
                    <Link to="/student/exams" className="px-4 py-2 bg-brand-500/100 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-brand-600 transition-colors">
                      Start
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
