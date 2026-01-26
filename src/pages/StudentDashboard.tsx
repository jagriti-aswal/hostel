import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Student, 
  hasMarkedAttendanceToday, 
  saveAttendanceRecord, 
  getTodayString,
  isWithinAttendanceWindowDemo 
} from '@/lib/mockData';
import { 
  Camera, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Wifi, 
  Clock, 
  LogOut, 
  User,
  Shield,
  Loader2,
  AlertTriangle
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user, logout, userType } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [locationVerified, setLocationVerified] = useState(false);
  const [networkVerified, setNetworkVerified] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const student = user as Student;

  // Check if already marked attendance
  React.useEffect(() => {
    if (student) {
      setAttendanceMarked(hasMarkedAttendanceToday(student.id));
    }
  }, [student]);

  // Redirect if not student
  React.useEffect(() => {
    if (userType !== 'student') {
      navigate('/');
    }
  }, [userType, navigate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please allow camera permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const simulateVerification = async () => {
    setIsVerifying(true);
    setVerificationStep(1);

    // Step 1: Location verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLocationVerified(true);
    setVerificationStep(2);

    // Step 2: Network verification
    await new Promise(resolve => setTimeout(resolve, 1200));
    setNetworkVerified(true);
    setVerificationStep(3);

    // Step 3: Face recognition
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVerificationStep(4);

    // Mark attendance
    saveAttendanceRecord({
      studentId: student.id,
      date: getTodayString(),
      markedAt: new Date().toISOString(),
      status: 'present',
      verificationMethod: 'face',
      locationVerified: true
    });

    setAttendanceMarked(true);
    setIsVerifying(false);

    toast({
      title: "Attendance Marked! ✓",
      description: "Your attendance has been successfully recorded.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isWithinWindow = isWithinAttendanceWindowDemo();

  if (!student) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Smart Hostel</h1>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6 overflow-hidden">
            <div className="h-24 gradient-primary relative">
              <div className="absolute -bottom-12 left-6">
                <div className="w-24 h-24 rounded-2xl border-4 border-card overflow-hidden shadow-lg">
                  <img 
                    src={student.profilePhoto} 
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <CardContent className="pt-16 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
                  <p className="text-muted-foreground">{student.rollNumber}</p>
                </div>
                <Badge 
                  variant={attendanceMarked ? "default" : "secondary"}
                  className={attendanceMarked ? "bg-status-present hover:bg-status-present/90" : ""}
                >
                  {attendanceMarked ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Present
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Not Marked
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Hostel</p>
                  <p className="font-medium">{student.hostelName}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Room</p>
                  <p className="font-medium">{student.roomNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Mark Attendance
              </CardTitle>
              <CardDescription>
                Capture your photo for face verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Time Window Notice */}
              <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
                isWithinWindow ? 'bg-status-present-light border border-status-present/20' : 'bg-warning/10 border border-warning/20'
              }`}>
                <Clock className={`w-5 h-5 ${isWithinWindow ? 'text-status-present' : 'text-warning'}`} />
                <div>
                  <p className={`font-medium ${isWithinWindow ? 'text-status-present' : 'text-warning'}`}>
                    {isWithinWindow ? 'Attendance Window Open' : 'Outside Attendance Window'}
                  </p>
                  <p className={`text-sm ${isWithinWindow ? 'text-status-present/80' : 'text-warning/80'}`}>
                    8:30 PM - 9:30 PM (Demo mode: always open)
                  </p>
                </div>
              </div>

              {attendanceMarked ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto bg-status-present-light rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-status-present" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Attendance Marked!</h3>
                  <p className="text-muted-foreground mt-2">
                    Your attendance for today has been recorded successfully.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Camera Section */}
                  <div className="relative rounded-xl overflow-hidden bg-muted aspect-video mb-4">
                    {isCameraOpen ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : capturedImage ? (
                      <img 
                        src={capturedImage} 
                        alt="Captured" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Camera className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">Camera preview will appear here</p>
                      </div>
                    )}
                    
                    {/* Camera overlay guide */}
                    {isCameraOpen && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-2 border-primary/50 rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Camera Controls */}
                  <div className="flex gap-3">
                    {!isCameraOpen && !capturedImage && (
                      <Button 
                        className="flex-1 gradient-primary"
                        onClick={startCamera}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Open Camera
                      </Button>
                    )}
                    
                    {isCameraOpen && (
                      <>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={stopCamera}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="flex-1 gradient-accent"
                          onClick={capturePhoto}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Capture
                        </Button>
                      </>
                    )}
                    
                    {capturedImage && !isVerifying && (
                      <>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setCapturedImage(null);
                            setLocationVerified(false);
                            setNetworkVerified(false);
                            setVerificationStep(0);
                          }}
                        >
                          Retake
                        </Button>
                        <Button 
                          className="flex-1 gradient-primary"
                          onClick={simulateVerification}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Verify & Submit
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Verification Steps */}
                  <AnimatePresence>
                    {isVerifying && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-3"
                      >
                        <VerificationStep
                          icon={MapPin}
                          label="Location Verification"
                          status={verificationStep >= 2 ? 'complete' : verificationStep === 1 ? 'loading' : 'pending'}
                        />
                        <VerificationStep
                          icon={Wifi}
                          label="Network Verification"
                          status={verificationStep >= 3 ? 'complete' : verificationStep === 2 ? 'loading' : 'pending'}
                        />
                        <VerificationStep
                          icon={User}
                          label="Face Recognition"
                          status={verificationStep >= 4 ? 'complete' : verificationStep === 3 ? 'loading' : 'pending'}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

// Verification Step Component
interface VerificationStepProps {
  icon: React.ElementType;
  label: string;
  status: 'pending' | 'loading' | 'complete';
}

const VerificationStep: React.FC<VerificationStepProps> = ({ icon: Icon, label, status }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        status === 'complete' ? 'bg-status-present-light' : 
        status === 'loading' ? 'bg-primary/5' : 'bg-muted/50'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        status === 'complete' ? 'bg-status-present' : 
        status === 'loading' ? 'bg-primary' : 'bg-muted'
      }`}>
        {status === 'complete' ? (
          <CheckCircle2 className="w-4 h-4 text-status-present-foreground" />
        ) : status === 'loading' ? (
          <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
        ) : (
          <Icon className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <span className={`font-medium ${
        status === 'complete' ? 'text-status-present' : 
        status === 'loading' ? 'text-primary' : 'text-muted-foreground'
      }`}>
        {label}
      </span>
      {status === 'complete' && (
        <span className="ml-auto text-sm text-status-present">Verified</span>
      )}
    </motion.div>
  );
};

export default StudentDashboard;
