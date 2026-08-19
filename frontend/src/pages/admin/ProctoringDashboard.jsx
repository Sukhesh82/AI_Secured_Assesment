import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import websocketService from '../../services/websocketService';
import api from '../../services/api';
import { ShieldAlert, Users, Video, Activity, AlertTriangle, ArrowLeft } from 'lucide-react';

const ProctoringDashboard = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeStudents, setActiveStudents] = useState([]);
  const [malpracticeEvents, setMalpracticeEvents] = useState([]);
  const [videoFeeds, setVideoFeeds] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of active attempts
    const fetchAttempts = async () => {
      try {
        const response = await api.get(`/admin/monitoring/active`);
        // Filter attempts for this exam
        const examAttempts = response.data.filter(attempt => attempt.examId === parseInt(examId));
        setActiveStudents(examAttempts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load attempts", err);
        setLoading(false);
      }
    };

    fetchAttempts();

    // Connect to WebSocket
    const connectWS = () => {
      websocketService.connect(
        () => {
          // onConnect
          websocketService.subscribe('/topic/exam-monitoring', (event) => {
            // Ignore events not related to this exam
            if (event.examId && event.examId !== parseInt(examId)) return;
            
            console.log("Received Malpractice Alert:", event);
            
            if (event.eventType === 'EXAM_SUBMITTED') {
              // Remove the student from active monitoring
              setActiveStudents(prev => prev.filter(student => student.id !== event.attemptId));
              // Remove their video feed
              setVideoFeeds(prev => {
                const newFeeds = { ...prev };
                delete newFeeds[event.attemptId];
                return newFeeds;
              });
              return;
            }
            
            setMalpracticeEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events
            
            // Update the specific student's risk score and violation count
            setActiveStudents(prev => prev.map(student => {
              if (student.id === event.attemptId) {
                return {
                  ...student,
                  violationCount: event.currentViolationCount,
                  riskScore: event.currentRiskScore,
                  riskLevel: event.currentRiskLevel
                };
              }
              return student;
            }));
          });

          // Subscribe to video frames
          websocketService.subscribe('/topic/exam-video', (frameDto) => {
             // Remove examId check temporarily to see if it fixes the video feed
             setVideoFeeds(prev => ({
                ...prev,
                [frameDto.attemptId]: frameDto
             }));
          });
        },
        (err) => {
          console.error("WebSocket connection failed", err);
        }
      );
    };

    connectWS();

    return () => {
      websocketService.unsubscribe('/topic/exam-monitoring');
      websocketService.unsubscribe('/topic/exam-video');
      // don't disconnect completely as it might be used globally, but for now it's ok
      websocketService.disconnect();
    };
  }, [examId, user.token]);

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-500/20';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-500/20';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'TAB_SWITCH': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'EXIT_FULLSCREEN': return <Activity className="w-4 h-4 text-orange-600" />;
      case 'CAMERA_DISABLED': return <Video className="w-4 h-4 text-red-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) return <div className="p-8 text-center">Connecting to Live Proctoring Server...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin/dashboard')} className="mr-4 text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Live Proctoring Center</h1>
            <p className="text-sm text-gray-400 flex items-center mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500/100 mr-2 animate-pulse"></span>
              WebSocket Connection Active - Exam ID: {examId}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Active Students Grid */}
        <div className="flex-1 dark-card flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
            <h2 className="text-lg font-medium text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-400" />
              Active Candidates ({activeStudents.length})
            </h2>
          </div>
          <div className="p-6 overflow-y-auto flex-1 bg-gray-800/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeStudents.map(student => {
                const feed = videoFeeds[student.id];
                return (
                <div key={student.id} className={`dark-card border p-4 ${student.riskLevel === 'HIGH' ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-800'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-md font-bold text-white">{student.studentName}</h3>
                      <p className="text-xs text-gray-400">{student.studentEmail}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getRiskColor(student.riskLevel)}`}>
                      {student.riskLevel} RISK
                    </span>
                  </div>
                  
                  <div className="aspect-video bg-black rounded mb-4 relative overflow-hidden flex items-center justify-center group cursor-pointer border border-gray-800">
                    {!feed && (
                      <div className="text-gray-400 text-xs flex flex-col items-center">
                        <Video className="w-8 h-8 mb-2 opacity-30 animate-pulse" />
                        Waiting for Student...
                      </div>
                    )}
                    {feed && feed.status === 'DISCONNECTED' && (
                      <div className="text-gray-400 text-xs flex flex-col items-center">
                        <Video className="w-8 h-8 mb-2 opacity-50" />
                        Webcam Disconnected
                      </div>
                    )}
                    {feed && feed.status === 'DENIED' && (
                      <div className="text-red-400 text-xs flex flex-col items-center">
                        <AlertTriangle className="w-8 h-8 mb-2 opacity-80" />
                        Camera Access Denied
                      </div>
                    )}
                    {feed && feed.status === 'STREAMING' && feed.frameData && (
                      <img src={feed.frameData} alt="Live feed" className="w-full h-full object-cover transform -scale-x-100" />
                    )}
                    
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Click to Enlarge (Future Update)</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Violations:</span>
                    <span className={`font-bold ${student.violationCount > 0 ? 'text-red-400' : 'text-white'}`}>
                      {student.violationCount} / {student.maxViolations}
                    </span>
                  </div>
                  
                  {student.violationCount >= student.maxViolations && (
                    <div className="mt-3">
                      <button className="w-full py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-500/20 hover:bg-red-200 transition-colors">
                        Force Submit Exam
                      </button>
                    </div>
                  )}
                </div>
                );
              })}
              
              {activeStudents.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400">
                  No students are currently taking this exam.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Alerts Panel */}
        <div className="w-96 dark-card flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 bg-red-500/10">
            <h2 className="text-lg font-medium text-red-900 flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-red-400" />
              Live Security Alerts
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800/30">
            {malpracticeEvents.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400">
                Listening for events...<br/>No malpractice detected yet.
              </div>
            ) : (
              malpracticeEvents.map((event, idx) => (
                <div key={idx} className={`p-3 rounded-lg border text-sm ${event.severity === 'HIGH' ? 'bg-red-500/10 border-red-500/20' : event.severity === 'MEDIUM' ? 'bg-orange-500/10 border-orange-500/20' : 'bg-yellow-500/10 border-yellow-500/20'} shadow-sm animate-fade-in-down`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-white flex items-center">
                      {getEventIcon(event.eventType)}
                      <span className="ml-1.5">{event.studentName}</span>
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1">{event.description}</p>
                  <div className="mt-2 flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-400 bg-[#131316] px-2 py-0.5 rounded border border-gray-700">
                      {event.eventType}
                    </span>
                    <span className={`font-bold ${event.severity === 'HIGH' ? 'text-red-400' : event.severity === 'MEDIUM' ? 'text-orange-400' : 'text-yellow-400'}`}>
                      Severity: {event.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProctoringDashboard;
