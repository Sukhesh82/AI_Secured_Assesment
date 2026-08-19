import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Search, X, CheckSquare, Settings, PlayCircle, PauseCircle } from 'lucide-react';

const initialExamFormState = {
  title: '',
  description: '',
  subject: '',
  durationMinutes: 30,
  totalMarks: 100,
  negativeMarks: 0,
  maxViolations: 15,
  randomizeQuestions: false,
  randomizeOptions: false,
  published: false,
  startTime: '',
  endTime: ''
};

const ExamManager = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialExamFormState);
  
  // Question Manager Modal State
  const [isQuestionManagerOpen, setIsQuestionManagerOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/admin/exams');
      setExams(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch exams');
      setLoading(false);
    }
  };

  const handleOpenModal = (exam = null) => {
    if (exam) {
      setEditingId(exam.id);
      setFormData({
        ...exam,
        startTime: exam.startTime ? exam.startTime.substring(0, 16) : '',
        endTime: exam.endTime ? exam.endTime.substring(0, 16) : ''
      });
    } else {
      setEditingId(null);
      setFormData(initialExamFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialExamFormState);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/exams/${editingId}`, formData);
      } else {
        await api.post('/admin/exams', formData);
      }
      fetchExams();
      handleCloseModal();
    } catch (err) {
      alert('Failed to save exam. Please check the inputs.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/exams/${id}`);
        fetchExams();
      } catch (err) {
        alert('Failed to delete exam.');
      }
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await api.put(`/admin/exams/${id}/publish`, { published: !currentStatus });
      fetchExams();
    } catch (err) {
      alert('Failed to update publish status.');
    }
  };

  // --- Question Manager Logic ---

  const openQuestionManager = async (examId) => {
    setSelectedExamId(examId);
    setIsQuestionManagerOpen(true);
    setLoadingQuestions(true);
    try {
      // Fetch all questions in the bank
      const allQRes = await api.get('/admin/questions');
      setAllQuestions(allQRes.data);
      
      // Fetch currently assigned questions
      const examQRes = await api.get(`/admin/exams/${examId}/questions`);
      setExamQuestions(examQRes.data.map(q => q.id));
      
    } catch (err) {
      alert('Failed to load questions.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const toggleQuestionAssignment = (questionId) => {
    setExamQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const saveQuestionAssignments = async () => {
    try {
      await api.post(`/admin/exams/${selectedExamId}/questions`, {
        questionIds: examQuestions
      });
      setIsQuestionManagerOpen(false);
      alert('Questions successfully assigned to the exam!');
    } catch (err) {
      alert('Failed to save question assignments.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Exams Manager</h1>
          <p className="text-gray-400">Create, configure, and publish exams</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Exam
        </button>
      </div>

      <div className="dark-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading exams...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/30 border-b border-gray-800 text-gray-400 text-sm">
                  <th className="p-4 font-semibold">Exam Title & Subject</th>
                  <th className="p-4 font-semibold w-24 text-center">Duration</th>
                  <th className="p-4 font-semibold w-24 text-center">Marks</th>
                  <th className="p-4 font-semibold w-32 text-center">Status</th>
                  <th className="p-4 font-semibold w-48 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">
                      No exams found.
                    </td>
                  </tr>
                ) : (
                  exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white group-hover:text-brand-600 transition-colors">{exam.title}</div>
                        <div className="text-xs text-brand-600 font-semibold mt-1 bg-brand-500/10 inline-block px-2 py-0.5 rounded border border-brand-500/20">
                          {exam.subject}
                        </div>
                      </td>
                      <td className="p-4 text-center text-gray-300">{exam.durationMinutes}m</td>
                      <td className="p-4 text-center font-medium text-gray-300">{exam.totalMarks}</td>
                      <td className="p-4 text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full 
                          ${exam.published ? 'bg-green-100 text-green-400' : 'bg-gray-800 text-gray-300'}`}>
                          {exam.published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => togglePublish(exam.id, exam.published)}
                          className={`p-2 rounded transition-colors ${exam.published ? 'text-orange-600 hover:bg-orange-50' : 'text-green-400 hover:bg-green-500/10'}`}
                          title={exam.published ? "Unpublish" : "Publish"}
                        >
                          {exam.published ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openQuestionManager(exam.id)}
                          className="p-2 text-brand-600 hover:bg-brand-500/10 rounded transition-colors"
                          title="Manage Questions"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(exam)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in-down">
          <div className="bg-[#1c1c1e] border border-gray-800/60 rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 bg-[#27272a]/30 border-b border-gray-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                  {editingId ? <Settings className="w-5 h-5 text-brand-500" /> : <Plus className="w-5 h-5 text-brand-500" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Exam Settings' : 'Create New Exam'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Configure exam parameters and rules</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="examForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info Card */}
                <div className="bg-[#131316] border border-gray-800/60 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Exam Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                        placeholder="e.g. Midterm Java Programming"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Description / Instructions</label>
                      <textarea
                        name="description"
                        rows="3"
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                        placeholder="Provide rules or details for the students..."
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Subject / Category</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                        placeholder="e.g. Computer Science"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Configuration Card */}
                <div className="bg-[#131316] border border-gray-800/60 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Grading & Timing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Duration (Minutes)</label>
                      <input
                        type="number"
                        name="durationMinutes"
                        required
                        min="1"
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                        value={formData.durationMinutes}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Total Marks</label>
                      <input
                        type="number"
                        name="totalMarks"
                        required
                        min="1"
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                        value={formData.totalMarks}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Negative Marks (per wrong answer)</label>
                      <input
                        type="number"
                        name="negativeMarks"
                        required
                        min="0"
                        step="0.1"
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                        value={formData.negativeMarks}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Scheduling Card */}
                <div className="bg-[#131316] border border-gray-800/60 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Scheduling</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Start Time</label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        required
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                        value={formData.startTime}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">End Time</label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        required
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                        value={formData.endTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Options & Visibility Card */}
                <div className="bg-[#131316] border border-gray-800/60 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Options & Visibility</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-800 bg-[#1c1c1e] cursor-pointer hover:border-brand-500/50 transition-colors">
                      <input type="checkbox" name="randomizeQuestions" checked={formData.randomizeQuestions} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-600 text-brand-600 focus:ring-brand-500 bg-[#131316]" />
                      <span className="text-sm font-medium text-gray-300">Randomize Questions</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-800 bg-[#1c1c1e] cursor-pointer hover:border-brand-500/50 transition-colors">
                      <input type="checkbox" name="randomizeOptions" checked={formData.randomizeOptions} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-600 text-brand-600 focus:ring-brand-500 bg-[#131316]" />
                      <span className="text-sm font-medium text-gray-300">Randomize Options</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg border border-brand-500/30 bg-brand-500/10 cursor-pointer hover:border-brand-500/60 transition-colors">
                      <input type="checkbox" name="published" checked={formData.published} onChange={handleInputChange} className="w-4 h-4 rounded border-brand-500 text-brand-600 focus:ring-brand-500 bg-brand-900/50" />
                      <span className="text-sm font-bold text-brand-400">Publish Immediately</span>
                    </label>
                  </div>
                </div>

              </form>
            </div>

            <div className="flex justify-end space-x-3 p-6 bg-[#27272a]/30 border-t border-gray-800 shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-xl text-gray-300 font-bold hover:bg-gray-800 hover:text-white transition-colors border border-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="examForm"
                className="px-8 py-2.5 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/20 transition-all shadow-glow-orange"
              >
                {editingId ? 'Save Changes' : 'Create Exam'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Assignment Modal */}
      {isQuestionManagerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#131316] rounded-xl shadow-xl w-full max-w-4xl my-8 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">Manage Exam Questions</h2>
                <p className="text-sm text-gray-400">Select questions from the bank to assign to this exam.</p>
              </div>
              <button onClick={() => setIsQuestionManagerOpen(false)} className="text-gray-400 hover:text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {loadingQuestions ? (
                <div className="text-center text-gray-400">Loading questions...</div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-brand-600 bg-brand-500/10 px-3 py-1 rounded">
                      {examQuestions.length} Questions Selected
                    </span>
                  </div>
                  {allQuestions.map(q => (
                    <label key={q.id} className="flex items-start p-4 border rounded-lg hover:bg-gray-800/30 cursor-pointer">
                      <div className="pt-1 mr-4">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                          checked={examQuestions.includes(q.id)}
                          onChange={() => toggleQuestionAssignment(q.id)}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{q.questionText}</div>
                        <div className="text-xs text-gray-400 mt-1 flex gap-3">
                          <span className="bg-gray-200 px-1.5 rounded">{q.subject}</span>
                          <span className={`${q.difficulty === 'EASY' ? 'text-green-400' : q.difficulty === 'MEDIUM' ? 'text-yellow-600' : 'text-red-400'} font-semibold`}>
                            {q.difficulty}
                          </span>
                          <span>{q.marks} Marks</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t shrink-0">
              <button
                onClick={() => setIsQuestionManagerOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-300 font-medium hover:bg-gray-800/30"
              >
                Cancel
              </button>
              <button
                onClick={saveQuestionAssignments}
                className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
              >
                Save Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManager;
