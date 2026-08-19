import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Award, CheckCircle, XCircle, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const StudentResults = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAttempt, setExpandedAttempt] = useState(null);
  const [attemptDetails, setAttemptDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const response = await api.get('/student/my-attempts');
      // Filter out IN_PROGRESS attempts
      const completed = response.data.filter(a => a.status === 'SUBMITTED' || a.status === 'AUTO_SUBMITTED' || a.status === 'FLAGGED');
      setAttempts(completed);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch results.');
      setLoading(false);
    }
  };

  const toggleDetails = async (attemptId) => {
    if (expandedAttempt === attemptId) {
      setExpandedAttempt(null);
      return;
    }

    setExpandedAttempt(attemptId);
    if (!attemptDetails[attemptId]) {
      setLoadingDetails(true);
      try {
        const response = await api.get(`/student/attempts/${attemptId}/result`);
        setAttemptDetails(prev => ({ ...prev, [attemptId]: response.data }));
      } catch (err) {
        console.error('Failed to fetch detailed result', err);
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="p-8 text-center">Loading your results...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-white">My Exam Results</h1>

      {attempts.length === 0 ? (
        <div className="dark-card p-12 text-center text-gray-400">
          You haven't completed any exams yet.
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="dark-card overflow-hidden group transition-all duration-300 hover:shadow-md">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-800/30 flex justify-between items-center transition-colors relative overflow-hidden"
                onClick={() => toggleDetails(attempt.id)}
              >
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-sm">
                      {attempt.subject}
                    </span>
                    {attempt.status === 'FLAGGED' && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg border border-red-100 shadow-sm flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Flagged for Review
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-600 transition-colors">{attempt.examTitle}</h3>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1 opacity-70" />
                    Submitted: {formatDate(attempt.submittedTime)}
                  </div>
                </div>

                <div className="flex items-center space-x-8 relative z-10">
                  <div className="text-right">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Score</div>
                    <div className="text-2xl font-black text-white">
                      {attempt.score} <span className="text-lg text-gray-400 font-bold">/ {attempt.totalMarks}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Percentage</div>
                    <div className={`text-2xl font-black ${attempt.percentage >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                      {attempt.percentage}%
                    </div>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-lg border border-gray-800 group-hover:bg-brand-500/10 group-hover:border-brand-500/20 transition-colors">
                  {expandedAttempt === attempt.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-brand-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-brand-600" />
                  )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedAttempt === attempt.id && (
                <div className="bg-gray-800/30 border-t border-gray-100 p-6 relative z-10">
                  {loadingDetails && !attemptDetails[attempt.id] ? (
                    <div className="text-center py-4 text-gray-400 font-medium">Loading detailed analysis...</div>
                  ) : attemptDetails[attempt.id] ? (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-[#131316] p-4 rounded-xl border border-gray-800 shadow-sm">
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Result</div>
                          <div className={`text-lg font-black mt-1 ${attemptDetails[attempt.id].resultStatus === 'PASS' ? 'text-green-400' : attemptDetails[attempt.id].resultStatus === 'FLAGGED FOR REVIEW' ? 'text-amber-500' : 'text-red-400'}`}>
                            {attemptDetails[attempt.id].resultStatus}
                          </div>
                        </div>
                        <div className="bg-[#131316] p-4 rounded-xl border border-gray-800 shadow-sm">
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Correct</div>
                          <div className="text-lg font-black text-green-400 mt-1 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1.5 opacity-80" /> {attemptDetails[attempt.id].correctCount}
                          </div>
                        </div>
                        <div className="bg-[#131316] p-4 rounded-xl border border-gray-800 shadow-sm">
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Incorrect</div>
                          <div className="text-lg font-black text-red-400 mt-1 flex items-center">
                            <XCircle className="w-4 h-4 mr-1.5 opacity-80" /> {attemptDetails[attempt.id].wrongCount}
                          </div>
                        </div>
                        <div className="bg-[#131316] p-4 rounded-xl border border-gray-800 shadow-sm">
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Unanswered</div>
                          <div className="text-lg font-black text-gray-400 mt-1">
                            {attemptDetails[attempt.id].unansweredCount}
                          </div>
                        </div>
                      </div>

                      <h4 className="font-bold text-white mb-4 border-b border-gray-800 pb-3 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-brand-500" />
                        Question Analysis
                      </h4>
                      <div className="space-y-4">
                        {attemptDetails[attempt.id].questionDetails.map((q, idx) => (
                          <div key={q.questionId} className="bg-[#131316] p-5 rounded-xl border border-gray-800 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                              <span className="font-medium text-gray-200 pr-6 leading-relaxed text-sm"><span className="text-brand-500 font-bold mr-1">Q{idx + 1}.</span> {q.questionText}</span>
                              <span className={`font-bold whitespace-nowrap text-sm px-2 py-1 rounded-md bg-gray-800/30 border border-gray-100 ${q.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                {q.marksObtained} / {q.maxMarks}
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-100 shadow-inner">
                                <span className="text-gray-400 block mb-1 text-[10px] font-bold uppercase tracking-wider">Your Answer</span>
                                <span className={q.isCorrect ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                                  {q.selectedAnswer ? `Option ${q.selectedAnswer} - ${q.selectedAnswerText || ''}` : 'Not Answered'}
                                </span>
                              </div>
                              <div className="p-3 rounded-lg bg-green-500/10 border border-green-100 shadow-inner">
                                <span className="text-green-400/70 block mb-1 text-[10px] font-bold uppercase tracking-wider">Correct Answer</span>
                                <span className="text-green-400 font-medium">Option {q.correctAnswer} - {q.correctAnswerText || ''}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-red-500">Failed to load details.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentResults;
