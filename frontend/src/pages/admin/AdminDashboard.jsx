import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { BookOpen, Users, AlertTriangle, Plus, Eye, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExamsAndAnalytics();
  }, []);

  const fetchExamsAndAnalytics = async () => {
    try {
      const [examsRes, analyticsRes] = await Promise.all([
        api.get('/admin/exams'),
        api.get('/admin/analytics')
      ]);
      setExams(examsRes.data);
      setAnalytics(analyticsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading Admin Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
        <button 
          onClick={() => navigate('/admin/exams')}
          className="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-lg shadow-sm flex items-center hover:bg-brand-700 hover:shadow-md transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Exam
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dark-card p-6 flex items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-600 mr-5 border border-brand-500/20 shadow-sm z-10">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-gray-400 tracking-wide uppercase mb-1">Total Exams</p>
            <p className="text-3xl font-bold text-white tracking-tight">{analytics?.totalExams || 0}</p>
          </div>
        </div>
        
        <div className="dark-card p-6 flex items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="p-4 rounded-2xl bg-green-500/10 text-green-400 mr-5 border border-green-100 shadow-sm z-10">
            <Users className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-gray-400 tracking-wide uppercase mb-1">Active Exams</p>
            <p className="text-3xl font-bold text-white tracking-tight">{analytics?.activeAttempts || 0}</p>
          </div>
        </div>

        <div className="dark-card p-6 flex items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="p-4 rounded-2xl bg-red-500/10 text-red-400 mr-5 border border-red-100 shadow-sm z-10">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-gray-400 tracking-wide uppercase mb-1">Malpractices</p>
            <p className="text-3xl font-bold text-white tracking-tight">{analytics?.totalMalpracticeEvents || 0}</p>
          </div>
        </div>
      </div>

      <div className="dark-card overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-800 bg-gray-800/30">
          <h2 className="text-lg font-bold text-white tracking-wide">Manage Exams</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800/30">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-white group-hover:text-brand-600 transition-colors">{exam.title}</div>
                    <div className="text-sm text-gray-400 mt-1">{exam.questionCount} Questions</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-brand-500/10 text-brand-600 border border-brand-500/20">
                      {exam.subject}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 font-medium">
                    {exam.durationMinutes} mins
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {exam.published ? (
                      <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        Published
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button 
                      onClick={() => navigate(`/admin/proctoring/${exam.id}`)}
                      className="text-brand-600 hover:text-white bg-brand-500/10 hover:bg-brand-600 flex items-center inline-flex px-3 py-1.5 rounded-lg border border-brand-200 hover:border-brand-600 transition-all shadow-sm"
                      title="Live Proctoring"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      Proctor
                    </button>
                    <button 
                      onClick={() => navigate('/admin/exams')}
                      className="text-gray-400 hover:text-white bg-gray-800/30 hover:bg-gray-800 flex items-center inline-flex px-3 py-1.5 rounded-lg border border-gray-800 transition-all shadow-sm">
                      <Settings className="w-4 h-4 mr-1.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {exams.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              No exams found. Click "Create New Exam" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
