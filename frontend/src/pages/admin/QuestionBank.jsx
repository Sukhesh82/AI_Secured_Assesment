import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

const initialFormState = {
  questionText: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: 'A',
  marks: 1.0,
  difficulty: 'EASY',
  subject: ''
};

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/admin/questions');
      setQuestions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch questions');
      setLoading(false);
    }
  };

  const handleOpenModal = (question = null) => {
    if (question) {
      setEditingId(question.id);
      setFormData(question);
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'marks' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/questions/${editingId}`, formData);
      } else {
        await api.post('/admin/questions', formData);
      }
      fetchQuestions();
      handleCloseModal();
    } catch (err) {
      alert('Failed to save question. Please check the inputs.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question? It may affect exams that use it.')) {
      try {
        await api.delete(`/admin/questions/${id}`);
        fetchQuestions();
      } catch (err) {
        alert('Failed to delete question. It might be assigned to an active exam.');
      }
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Question Bank</h1>
          <p className="text-gray-400">Manage all questions across all subjects</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </button>
      </div>

      <div className="dark-card overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-gray-800/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions or subjects..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading questions...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/30 border-b border-gray-800 text-gray-400 text-sm">
                  <th className="p-4 font-semibold w-16">ID</th>
                  <th className="p-4 font-semibold">Question & Subject</th>
                  <th className="p-4 font-semibold w-24 text-center">Marks</th>
                  <th className="p-4 font-semibold w-32">Difficulty</th>
                  <th className="p-4 font-semibold w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">
                      No questions found.
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-800/30">
                      <td className="p-4 text-gray-400 font-mono text-sm">#{q.id}</td>
                      <td className="p-4">
                        <div className="font-medium text-white line-clamp-2">{q.questionText}</div>
                        <div className="text-xs text-brand-600 font-semibold mt-1 bg-brand-500/10 inline-block px-2 py-0.5 rounded border border-brand-500/20">
                          {q.subject}
                        </div>
                      </td>
                      <td className="p-4 text-center font-medium text-gray-300">{q.marks}</td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full 
                          ${q.difficulty === 'EASY' ? 'bg-green-100 text-green-400' : 
                            q.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenModal(q)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in-down">
          <div className="bg-[#1c1c1e] border border-gray-800/60 rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 bg-[#27272a]/30 border-b border-gray-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                  {editingId ? <Edit2 className="w-5 h-5 text-brand-500" /> : <Plus className="w-5 h-5 text-brand-500" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Question' : 'Add New Question'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">Define question text, options, and grading</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="questionForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Question Details Card */}
                <div className="bg-[#131316] border border-gray-800/60 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Question Details</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Question Text</label>
                    <textarea
                      name="questionText"
                      required
                      rows="3"
                      className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                      value={formData.questionText}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Options Card */}
                <div className="bg-[#131316] border border-gray-800/60 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Answer Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Option A</label>
                      <input
                        type="text"
                        name="optionA"
                        required
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                        value={formData.optionA}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Option B</label>
                      <input
                        type="text"
                        name="optionB"
                        required
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                        value={formData.optionB}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Option C</label>
                      <input
                        type="text"
                        name="optionC"
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                        value={formData.optionC}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Option D</label>
                      <input
                        type="text"
                        name="optionD"
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                        value={formData.optionD}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Settings Card */}
                <div className="bg-[#131316] border border-gray-800/60 rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Grading & Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Correct Answer</label>
                      <select
                        name="correctAnswer"
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors appearance-none"
                        value={formData.correctAnswer}
                        onChange={handleInputChange}
                      >
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Marks</label>
                      <input
                        type="number"
                        name="marks"
                        min="0.5"
                        step="0.5"
                        required
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                        value={formData.marks}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Difficulty</label>
                      <select
                        name="difficulty"
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors appearance-none"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        placeholder="e.g. History"
                        className="w-full border border-gray-700 bg-[#1c1c1e] rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-colors"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>
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
                form="questionForm"
                className="px-8 py-2.5 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/20 transition-all shadow-glow-orange"
              >
                {editingId ? 'Save Changes' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
