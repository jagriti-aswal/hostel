import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Camera, Check, Calendar, User, Mail, Hash, Clock, FileText } from "lucide-react";

const StudentDashboard: React.FC = () => {
  const { user, logout, userType } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [reason, setReason] = useState("");
  const [isOnLeave, setIsOnLeave] = useState(false);

  useEffect(() => {
    if (userType !== "student") {
      navigate("/");
    }
    checkLeaveStatus();
  }, [userType, navigate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraOpen(true);
      }
    } catch {
      toast({
        title: "Camera blocked",
        variant: "destructive",
      });
    }
  };

  const checkLeaveStatus = async () => {
    try {
      const res = await fetch(
        `[hostel-tprs.onrender.com](https://hostel-tprs.onrender.com/api/leave/check?email=${user?.email})`
      );
      const data = await res.json();
      if (data.isOnLeave) {
        setIsOnLeave(true);
      }
    } catch (err) {
      console.error("Leave check failed");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (video.videoWidth === 0) {
      toast({ title: "Camera not ready" });
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);
    const img = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(img);
    stopCamera();
  };

  const getLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => reject(error)
        );
      }
    );
  };

  const verifyFace = async () => {
    if (!capturedImage || !user) return;
    try {
      const location = await getLocation();
      setIsVerifying(true);
      const res = await fetch(
        "[hostel-tprs.onrender.com](https://hostel-tprs.onrender.com/api/face-attendance)",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            image: capturedImage,
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error();
      }
      setAttendanceMarked(true);
      toast({
        title: "Attendance marked successfully ✓",
      });
    } catch {
      toast({
        title: "Face not recognized",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const applyLeave = async () => {
    if (!leaveFrom || !leaveTo) {
      toast({ title: "Please select leave dates", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch("[hostel-tprs.onrender.com](https://hostel-tprs.onrender.com/api/leave)", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          from: leaveFrom,
          to: leaveTo,
          reason,
        }),
      });
      if (!res.ok) throw new Error();
      setIsOnLeave(true);
      toast({
        title: "Leave applied successfully ✓",
      });
    } catch {
      toast({
        title: "Failed to apply leave",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SH</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Smart Hostel</h1>
                <p className="text-sm text-gray-500">Student Portal</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Profile Card */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-24 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              {/* Avatar */}
              <div className="-mt-12 relative">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
              </div>

              {/* Info */}
              <div className="flex-1 sm:pb-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.name || "Student"}
                </h2>
                <p className="text-gray-500">Active Student</p>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-center">
                <div className="px-4 py-2 rounded-xl bg-gray-50">
                  <p className="text-2xl font-bold text-gray-900">
                    {attendanceMarked ? "✓" : "—"}
                  </p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="font-semibold text-gray-900">{user?.name || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Hash className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Roll No</p>
                  <p className="font-semibold text-gray-900">{user?.rollNo || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leave Application Card */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Apply for Leave</CardTitle>
                  <CardDescription>Submit your leave request</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    From Date
                  </label>
                  <input
                    type="date"
                    value={leaveFrom}
                    onChange={(e) => setLeaveFrom(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all outline-none bg-gray-50 hover:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    To Date
                  </label>
                  <input
                    type="date"
                    value={leaveTo}
                    onChange={(e) => setLeaveTo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all outline-none bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Reason
                </label>
                <textarea
                  placeholder="Enter reason for leave..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all outline-none bg-gray-50 hover:bg-white resize-none"
                />
              </div>

              <Button
                onClick={applyLeave}
                className="w-full py-6 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Submit Leave Request
              </Button>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-md">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mark Attendance</CardTitle>
                  <CardDescription>Face verification required</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {isOnLeave ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-amber-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-amber-700">On Leave</h3>
                    <p className="text-gray-500 mt-1">
                      You're currently on approved leave
                    </p>
                  </div>
                </div>
              ) : attendanceMarked ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-green-700">
                      Attendance Marked!
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Successfully recorded for today
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Camera View */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-inner">
                    {capturedImage ? (
                      <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${
                            isCameraOpen ? "block" : "hidden"
                          }`}
                        />
                        {!isCameraOpen && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <Camera className="w-16 h-16 mb-2 opacity-50" />
                            <p className="text-sm">Camera Preview</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Overlay Frame */}
                    {isCameraOpen && (
                      <div className="absolute inset-4 border-2 border-white/30 rounded-xl pointer-events-none">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
                      </div>
                    )}
                  </div>

                  <canvas ref={canvasRef} className="hidden" />

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {!isCameraOpen && !capturedImage && (
                      <Button
                        onClick={startCamera}
                        className="flex-1 py-6 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Open Camera
                      </Button>
                    )}

                    {isCameraOpen && (
                      <Button
                        onClick={capturePhoto}
                        className="flex-1 py-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Capture Photo
                      </Button>
                    )}

                    {capturedImage && !isVerifying && (
                      <>
                        <Button
                          onClick={() => {
                            setCapturedImage(null);
                            startCamera();
                          }}
                          variant="outline"
                          className="py-6 px-6 rounded-xl border-2 hover:bg-gray-50"
                        >
                          Retake
                        </Button>
                        <Button
                          onClick={verifyFace}
                          className="flex-1 py-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Verify & Submit
                        </Button>
                      </>
                    )}

                    {isVerifying && (
                      <Button
                        disabled
                        className="flex-1 py-6 rounded-xl bg-gray-400 text-white font-semibold"
                      >
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying...
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
