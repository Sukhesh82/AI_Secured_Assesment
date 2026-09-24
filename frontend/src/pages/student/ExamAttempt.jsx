import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import websocketService from '../../services/websocketService';
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Send, HelpCircle } from 'lucide-react';

const ExamAttempt = () => {
  const { attemptId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visited, setVisited] = useState({ 0: true });
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [remainingTime, setRemainingTime] = useState(0);
  
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  // Initialize Exam
  useEffect(() => {
    let timerInterval;
    let isMounted = true;
    
    const initExam = async () => {
      try {
        // Fetch current attempt details
        const attemptRes = await api.get(`/student/attempts/${attemptId}`);
        if (!isMounted) return;

        const attemptData = attemptRes.data;
        
        if (attemptData.status !== 'IN_PROGRESS') {
          navigate('/student/dashboard');
          return;
        }

        setAttempt(attemptData);
        setRemainingTime(attemptData.remainingTimeSeconds);
        setViolationCount(attemptData.violationCount || 0);

        const questionsRes = await api.get(`/student/attempts/${attemptId}/questions`);
        if (!isMounted) return;

        setQuestions(questionsRes.data);
        
        // Initialize answers state from questions data
        const initialAnswers = {};
        const initialReview = {};
        questionsRes.data.forEach((q, idx) => {
          if (q.selectedAnswer) initialAnswers[q.id] = q.selectedAnswer;
          if (q.markedForReview) initialReview[q.id] = true;
        });
        setAnswers(initialAnswers);
        setMarkedForReview(initialReview);

        // Connect WebSocket for proctoring
        websocketService.connect(() => {
          websocketService.subscribe(`/topic/exam/${attemptData.id}`, (event) => {
            if (event.currentViolationCount !== undefined) {
              setViolationCount(event.currentViolationCount);
            }
            if (event.currentViolationCount >= attemptData.maxViolations) {
              stopCamera();
              alert('Exam Auto-Submitted: Maximum security violation limit reached');
              if (document.fullscreenElement) {
                document.exitFullscreen();
              }
              navigate('/student/results');
            }
          });
        });

        // Start Timer
        timerInterval = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              handleAutoSubmit('Time Expired');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError('Failed to load exam data. Please contact support.');
          setLoading(false);
        }
      }
    };

    initExam();

    return () => {
      isMounted = false;
      if (timerInterval) clearInterval(timerInterval);
      websocketService.disconnect();
      stopCamera();
    };
  }, [attemptId, navigate, user.token]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      reportMalpractice('CAMERA_DISABLED', 'HIGH', 'Student refused or failed to provide camera access');
      // Send denied state
      if (attempt) {
        websocketService.sendVideoFrame({
          examId: attempt.examId,
          attemptId: attempt.id,
          studentName: attempt.studentName,
          studentEmail: attempt.studentEmail,
          frameData: null,
          status: 'DENIED',
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    // Send disconnected state
    if (attempt && websocketService.connected) {
       websocketService.sendVideoFrame({
          examId: attempt.examId,
          attemptId: attempt.id,
          studentName: attempt.studentName,
          studentEmail: attempt.studentEmail,
          frameData: null,
          status: 'DISCONNECTED',
          timestamp: new Date().toISOString()
        });
    }
  };

  useEffect(() => {
    if (!loading && !error && attempt) {
      startCamera();
    }
  }, [loading, error, attempt]);

  useEffect(() => {
    setVisited(prev => ({ ...prev, [currentQuestionIndex]: true }));
  }, [currentQuestionIndex]);

  // Ensure stream is attached to video element when it mounts
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      if (videoRef.current.srcObject !== cameraStream) {
        videoRef.current.srcObject = cameraStream;
      }
    }
  }, [cameraStream, isFullscreen]);

  // Frame Capturing Logic
  useEffect(() => {
    let frameInterval;
    if (cameraStream && videoRef.current && attempt) {
      const canvas = document.createElement('canvas');
      // Increased resolution back to 320x240 for clarity
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');

      frameInterval = setInterval(() => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL('image/jpeg', 0.4);
          websocketService.sendVideoFrame({
            examId: attempt.examId,
            attemptId: attempt.id,
            studentName: attempt.studentName,
            studentEmail: attempt.studentEmail,
            frameData: frameData,
            status: 'STREAMING',
            timestamp: new Date().toISOString()
          });
        }
      }, 200); // 5 FPS (1 frame every 200ms) to simulate faster video
    }

    return () => {
      if (frameInterval) clearInterval(frameInterval);
    };
  }, [cameraStream, attempt, attemptId]);

  // Proctoring Events
  const reportMalpractice = useCallback((type, severity, description) => {
    if (!attempt) return;
    
    api.post('/api/monitoring/events', {
      attemptId: attempt.id,
      eventType: type,
      severity: severity,
      description: description,
      timestamp: new Date().toISOString()
    }).catch(console.error);

    // Also send via WebSocket for real-time alert
    if (websocketService.connected) {
      websocketService.sendMalpracticeEvent({
        attemptId: attempt.id,
        examId: attempt.examId, // Explicitly pass examId in the DTO if needed
        eventType: type,
        severity: severity,
        description: description,
        timestamp: new Date().toISOString()
      });
    }
  }, [attempt]);

  // Visibility and Fullscreen Listeners
  useEffect(() => {
    if (loading || error) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportMalpractice('TAB_SWITCH', 'HIGH', 'Student switched tabs or minimized the browser');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        reportMalpractice('FULLSCREEN_EXIT', 'MEDIUM', 'Student exited fullscreen mode');
      } else {
        setIsFullscreen(true);
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleCopy = (e) => {
      e.preventDefault();
      reportMalpractice('COPY_ATTEMPT', 'LOW', 'Student attempted to copy content');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
    };
  }, [loading, error, reportMalpractice]);

  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => {
        if (violationCount > 0) {
          setShowViolationWarning(true);
          setTimeout(() => setShowViolationWarning(false), 2500);
        }
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  };

  // Exam Actions
  const handleAnswerSelect = async (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    try {
      await api.post(`/student/attempts/${attemptId}/answer`, {
        questionId: questionId,
        selectedAnswer: answer,
        markedForReview: markedForReview[questionId] || false
      });
    } catch (err) {
      console.error('Failed to save answer', err);
    }
  };

  const toggleReview = async (questionId) => {
    const newVal = !markedForReview[questionId];
    setMarkedForReview(prev => ({ ...prev, [questionId]: newVal }));
    try {
      await api.post(`/student/attempts/${attemptId}/answer`, {
        questionId: questionId,
        selectedAnswer: answers[questionId] || null,
        markedForReview: newVal
      });
    } catch (err) {
      console.error('Failed to save review status', err);
    }
  };

  const handleClearResponse = async (questionId) => {
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
    try {
      await api.post(`/student/attempts/${attemptId}/answer`, {
        questionId: questionId,
        selectedAnswer: null,
        markedForReview: markedForReview[questionId] || false
      });
    } catch (err) {
      console.error('Failed to clear answer', err);
    }
  };

  const handleSubmitExam = async () => {
    try {
      setShowSubmitConfirm(false);
      await api.post(`/student/attempts/${attemptId}/submit`);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      stopCamera();
      navigate('/student/results');
    } catch (err) {
      alert('Failed to submit exam. Please try again.');
    }
  };

  const handleAutoSubmit = async (reason) => {
    try {
      await api.post(`/student/attempts/${attemptId}/submit`, { reason });
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      stopCamera();
      alert(`Exam auto-submitted: ${reason}`);
      navigate('/student/results');
    } catch (err) {
      console.error('Auto submit failed', err);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getQuestionState = (qId, idx) => {
    const isAnswered = !!answers[qId];
    const isMarked = !!markedForReview[qId];
    const isVisited = !!visited[idx];

    if (!isVisited) return 'NOT_VISITED';
    if (isAnswered && isMarked) return 'ANSWERED_MARKED';
    if (isMarked) return 'MARKED';
    if (isAnswered) return 'ANSWERED';
    return 'NOT_ANSWERED';
  };

  const paletteCounts = questions.reduce((acc, q, idx) => {
    acc[getQuestionState(q.id, idx)]++;
    return acc;
  }, { NOT_VISITED: 0, NOT_ANSWERED: 0, ANSWERED: 0, MARKED: 0, ANSWERED_MARKED: 0 });

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Exam Environment...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;

  if (!isFullscreen) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-800/30 p-6">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Fullscreen Required</h2>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          This exam requires fullscreen mode to prevent malpractice. Please click the button below to enter fullscreen and resume your exam.
        </p>
        <button
          onClick={requestFullscreen}
          className="px-6 py-3 bg-brand-600 text-white rounded-md font-medium hover:bg-brand-700"
        >
          Enter Fullscreen & Resume
        </button>
        {/* Keep video element mounted in background to maintain live streaming for proctor */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-screen bg-gray-50 select-none font-sans text-gray-800 overflow-hidden">
      {/* Top Header */}
      <header className="bg-blue-700 text-white shadow-md border-b border-blue-800 px-4 py-2 flex justify-between items-center z-20 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-white text-blue-700 rounded-full flex items-center justify-center font-bold text-xl overflow-hidden shadow-inner">
            {attempt?.studentName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">{attempt?.examTitle}</h1>
            <p className="text-xs text-blue-100 font-medium">Candidate: {attempt?.studentName} | Reg No: {user?.studentId || '-'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className={`flex items-center space-x-2 text-xl font-bold px-4 py-1.5 rounded bg-black/20 border border-black/10 shadow-inner ${remainingTime <= 300 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono tracking-widest">{formatTime(remainingTime)}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Camera & Candidate Details */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm z-10">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="bg-black w-full aspect-video rounded overflow-hidden flex items-center justify-center relative shadow-inner border border-gray-300">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform -scale-x-100" 
              />
              {!cameraStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-800">
                  <AlertTriangle className="w-6 h-6 mb-1 text-red-500" />
                  <span className="text-xs">Camera Required</span>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Live Proctoring</span>
            </div>
          </div>
          <div className="p-4 bg-white flex-1">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2 mb-3">Candidate Details</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Name</p>
                <p className="font-semibold text-gray-800">{attempt?.studentName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Registration No</p>
                <p className="font-semibold text-gray-800">{user?.studentId || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Section</p>
                <p className="font-semibold text-gray-800">Multiple Choice Questions (MCQ)</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content: Question */}
        <main className="flex-1 flex flex-col bg-white relative">
          {currentQ && (
            <>
              {/* Question Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-gray-800">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-semibold text-gray-600 bg-white px-3 py-1 border border-gray-200 rounded shadow-sm">
                    Marks: <span className="text-green-600">+{currentQ.marks}</span> / <span className="text-red-500">-0.5</span>
                  </div>
                </div>
              </div>
              
              {/* Question Body Scrollable */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="text-lg text-gray-800 mb-8 whitespace-pre-wrap font-medium">
                    {currentQ.questionText}
                  </div>

                  <div className="space-y-4">
                    {Object.entries(currentQ.options)
                      .filter(([key, value]) => value !== null && value.trim() !== '')
                      .map(([key, value]) => {
                        const isSelected = answers[currentQ.id] === key;
                        return (
                          <label 
                            key={key}
                            className={`p-4 border rounded-lg cursor-pointer transition-all flex items-start group
                              ${isSelected 
                                ? 'border-blue-600 bg-blue-50 shadow-sm ring-1 ring-blue-600' 
                                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                          >
                            <div className="pt-0.5 flex items-center justify-center mr-4 shrink-0">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${isSelected ? 'border-blue-600' : 'border-gray-400 group-hover:border-blue-400'}`}>
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                              </div>
                            </div>
                            <div className="text-base text-gray-800">
                              <span className="font-bold mr-2">{key}.</span>
                              <span>{value}</span>
                            </div>
                            <input 
                              type="radio" 
                              name={`question-${currentQ.id}`} 
                              value={key} 
                              checked={isSelected}
                              onChange={() => handleAnswerSelect(currentQ.id, key)} 
                              className="hidden" 
                            />
                          </label>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions Footer */}
              <div className="bg-gray-100 border-t border-gray-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      toggleReview(currentQ.id);
                      setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
                    }}
                    className="px-5 py-2.5 text-sm font-bold rounded shadow-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                  >
                    <HelpCircle className={`w-4 h-4 mr-2 ${markedForReview[currentQ.id] ? 'text-purple-600' : 'text-gray-400'}`} />
                    {markedForReview[currentQ.id] ? 'Unmark & Next' : 'Mark for Review & Next'}
                  </button>
                  <button
                    onClick={() => handleClearResponse(currentQ.id)}
                    className="px-5 py-2.5 text-sm font-bold rounded shadow-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-5 py-2.5 bg-white border border-gray-300 shadow-sm rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-bold flex items-center transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="px-6 py-2.5 bg-blue-700 shadow-md rounded text-white hover:bg-blue-800 disabled:opacity-50 font-bold flex items-center transition-colors"
                  >
                    Save & Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Right Panel: Navigation Grid */}
        <aside className="w-72 bg-gray-50 border-l border-gray-200 flex flex-col shrink-0 shadow-sm z-10">
          
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Question Palette</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs font-semibold text-gray-600">
              <div className="flex items-center"><div className="w-5 h-5 rounded-full flex items-center justify-center text-gray-700 bg-gray-200 border border-gray-400 mr-2 shadow-sm">{paletteCounts.NOT_VISITED}</div> Not Visited</div>
              <div className="flex items-center"><div className="w-5 h-5 rounded-tl-lg rounded-tr-lg rounded-bl-lg flex items-center justify-center text-white bg-red-500 border border-red-600 mr-2 shadow-sm">{paletteCounts.NOT_ANSWERED}</div> Not Answered</div>
              <div className="flex items-center"><div className="w-5 h-5 rounded-tl-lg rounded-tr-lg rounded-br-lg flex items-center justify-center text-white bg-green-600 border border-green-700 mr-2 shadow-sm">{paletteCounts.ANSWERED}</div> Answered</div>
              <div className="flex items-center"><div className="w-5 h-5 rounded-full flex items-center justify-center text-white bg-purple-600 border border-purple-700 mr-2 shadow-sm">{paletteCounts.MARKED}</div> Marked</div>
              <div className="flex items-center col-span-2 mt-1"><div className="w-5 h-5 rounded-full flex items-center justify-center text-white bg-purple-600 border border-purple-700 relative mr-2 shadow-sm">{paletteCounts.ANSWERED_MARKED}<div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 flex items-center justify-center border border-white"><CheckCircle className="w-2 h-2 text-white" /></div></div> Answered & Marked</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Questions</h4>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const state = getQuestionState(q.id, idx);
                let btnClass = "w-10 h-10 flex items-center justify-center text-sm font-bold shadow-sm transition-transform hover:scale-105 cursor-pointer relative ";
                
                // Base shapes and colors for 5 states
                if (state === 'NOT_VISITED') {
                  btnClass += "rounded-full bg-gray-200 text-gray-700 border border-gray-400 hover:bg-gray-300";
                } else if (state === 'NOT_ANSWERED') {
                  btnClass += "rounded-tl-lg rounded-tr-lg rounded-bl-lg bg-red-500 text-white border border-red-600 hover:bg-red-600";
                } else if (state === 'ANSWERED') {
                  btnClass += "rounded-tl-lg rounded-tr-lg rounded-br-lg bg-green-600 text-white border border-green-700 hover:bg-green-700";
                } else if (state === 'MARKED') {
                  btnClass += "rounded-full bg-purple-600 text-white border border-purple-700 hover:bg-purple-700";
                } else if (state === 'ANSWERED_MARKED') {
                  btnClass += "rounded-full bg-purple-600 text-white border border-purple-700 hover:bg-purple-700";
                }

                if (idx === currentQuestionIndex) {
                  btnClass += " ring-2 ring-offset-2 ring-blue-500";
                }

                return (
                  <div key={q.id} className="relative flex justify-center">
                    <button
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={btnClass}
                    >
                      {idx + 1}
                    </button>
                    {state === 'ANSWERED_MARKED' && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center border-2 border-white shadow-sm z-10 pointer-events-none">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Submit Exam Button */}
          <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="w-full py-3.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md flex items-center justify-center transition-all hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Exam
            </button>
          </div>
        </aside>
      </div>

      {showViolationWarning && (
        <div className="fixed top-20 right-6 bg-white border-l-4 border-red-500 rounded-lg shadow-2xl p-4 flex items-center z-50 transition-all duration-300 transform max-w-sm">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
          <div className="text-sm text-gray-800 leading-snug">
            <span className="text-red-600 font-bold block mb-0.5">Warning: Violation recorded!</span> 
            Remaining attempts: {violationCount}/{attempt?.maxViolations}. Auto-submit on the final violation.
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-blue-700 text-white border-b border-blue-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Submit Exam?</h2>
              <div className="flex items-center text-red-200 bg-black/20 px-3 py-1 rounded font-mono font-bold text-sm">
                <Clock className="w-4 h-4 mr-2" />
                Time Left: {formatTime(remainingTime)}
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6 font-medium text-center">Are you sure you want to submit? Once submitted, you cannot review or change your answers.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-green-700 mb-1">{paletteCounts.ANSWERED}</div>
                  <div className="text-xs font-bold text-green-700 uppercase tracking-wide">Answered</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center relative shadow-sm">
                  <div className="absolute top-2 right-2"><CheckCircle className="w-4 h-4 text-green-500" /></div>
                  <div className="text-3xl font-bold text-purple-700 mb-1">{paletteCounts.ANSWERED_MARKED}</div>
                  <div className="text-xs font-bold text-purple-700 uppercase tracking-wide">Ans & Marked</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-red-600 mb-1">{paletteCounts.NOT_ANSWERED}</div>
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wide">Not Answered</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-purple-700 mb-1">{paletteCounts.MARKED}</div>
                  <div className="text-xs font-bold text-purple-700 uppercase tracking-wide">Marked</div>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center col-span-2 shadow-sm">
                  <div className="text-3xl font-bold text-gray-700 mb-1">{paletteCounts.NOT_VISITED}</div>
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Not Visited</div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowSubmitConfirm(false)}
                className="px-6 py-2.5 rounded-lg font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-lg font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-md flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamAttempt;
