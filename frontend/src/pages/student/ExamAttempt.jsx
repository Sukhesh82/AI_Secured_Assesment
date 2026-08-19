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
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [remainingTime, setRemainingTime] = useState(0);
  
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  
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
      // Keep resolution low to reduce payload size over websocket (e.g. 320x240)
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
      }, 500); // 2 FPS
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
    if (window.confirm('Are you sure you want to submit the exam? Once submitted, you cannot change your answers.')) {
      try {
        await api.post(`/student/attempts/${attemptId}/submit`);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        stopCamera();
        navigate('/student/results');
      } catch (err) {
        alert('Failed to submit exam. Please try again.');
      }
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
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
    <div className="flex flex-col h-screen bg-gray-800 select-none">
      {/* Top Bar */}
      <header className="bg-[#131316] shadow-sm border-b px-6 py-3 flex justify-between items-center z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-200">{attempt?.examTitle}</h1>
          <p className="text-sm text-gray-400">{attempt?.studentName} ({attempt?.studentEmail})</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-lg font-bold text-red-400">
            <Clock className="w-5 h-5" />
            <span>{formatTime(remainingTime)}</span>
          </div>
          <button
            onClick={handleSubmitExam}
            className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Exam
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Camera & Navigation Grid */}
        <aside className="w-64 bg-[#131316] border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="bg-black w-full aspect-video rounded overflow-hidden flex items-center justify-center relative">
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
            <div className="mt-2 text-xs text-center text-gray-400 font-medium">Live Proctoring Active</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Questions Overview</h3>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                let btnClass = "w-10 h-10 rounded flex items-center justify-center text-sm font-medium border cursor-pointer ";
                
                if (idx === currentQuestionIndex) {
                  btnClass += "ring-2 ring-brand-500 border-transparent ";
                } else {
                  btnClass += "border-gray-700 hover:bg-gray-800 ";
                }

                if (markedForReview[q.id]) {
                  btnClass += "bg-purple-100 text-purple-700 border-purple-300";
                } else if (answers[q.id]) {
                  btnClass += "bg-green-100 text-green-400 border-green-300";
                } else {
                  btnClass += "bg-[#131316] text-gray-400";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={btnClass}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 space-y-2 text-xs text-gray-400">
              <div className="flex items-center"><div className="w-3 h-3 rounded bg-green-100 border border-green-300 mr-2"></div> Answered</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded bg-purple-100 border border-purple-300 mr-2"></div> Marked for Review</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded bg-[#131316] border border-gray-700 mr-2"></div> Not Answered</div>
            </div>
          </div>
        </aside>

        {/* Main Content: Question */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {currentQ && (
            <div className="max-w-4xl mx-auto bg-[#131316] rounded-lg shadow-sm border p-8">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-200">Question {currentQuestionIndex + 1}</h2>
                <div className="text-sm font-medium text-gray-400">Marks: {currentQ.marks}</div>
              </div>
              
              <div className="text-lg text-gray-200 mb-8 whitespace-pre-wrap">
                {currentQ.questionText}
              </div>

              <div className="space-y-3">
                {Object.entries(currentQ.options)
                  .filter(([key, value]) => value !== null && value.trim() !== '')
                  .map(([key, value]) => (
                  <div 
                    key={key}
                    onClick={() => handleAnswerSelect(currentQ.id, key)}
                    className={`p-4 border rounded-md cursor-pointer transition-colors flex items-center
                      ${answers[currentQ.id] === key 
                        ? 'border-brand-500 bg-brand-500/10' 
                        : 'border-gray-800 hover:bg-gray-800/30'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-4 
                      ${answers[currentQ.id] === key ? 'border-brand-500 bg-brand-500/100 text-white' : 'border-gray-400'}`}>
                      {answers[currentQ.id] === key && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <span className="font-medium text-gray-300 mr-4">{key}.</span>
                    <span className="text-gray-200">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t flex justify-between items-center">
                <div className="space-x-3">
                  <button
                    onClick={() => toggleReview(currentQ.id)}
                    className={`px-4 py-2 text-sm font-medium rounded border ${
                      markedForReview[currentQ.id] 
                        ? 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200' 
                        : 'bg-[#131316] text-gray-300 border-gray-700 hover:bg-gray-800/30'
                    } flex items-center inline-flex`}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    {markedForReview[currentQ.id] ? 'Unmark Review' : 'Mark for Review'}
                  </button>
                  <button
                    onClick={() => handleClearResponse(currentQ.id)}
                    className="px-4 py-2 text-sm font-medium rounded bg-[#131316] text-gray-300 border border-gray-700 hover:bg-gray-800/30"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="space-x-3 flex">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-[#131316] border rounded text-gray-300 hover:bg-gray-800/30 disabled:opacity-50 flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="px-4 py-2 bg-brand-600 border border-transparent rounded text-white hover:bg-brand-700 disabled:opacity-50 flex items-center"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showViolationWarning && (
        <div className="fixed bottom-6 right-6 bg-[#131316] border border-gray-700 rounded-lg shadow-2xl p-4 flex items-center z-50 transition-all duration-300 transform max-w-sm">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
          <div className="text-sm text-gray-200 leading-snug">
            <span className="text-red-500 font-bold">Warning:</span> Violation recorded. Remaining attempts: {violationCount}/{attempt?.maxViolations}. Auto-submit on the final violation.
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamAttempt;
