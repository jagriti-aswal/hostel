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
import { LogOut } from "lucide-react";

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

  // 🔥 NEW STATES
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [reason, setReason] = useState("");
  const [isOnLeave, setIsOnLeave] = useState(false);

  // useEffect(() => {
  //   if (userType !== "student") {
  //     navigate("/");
  //   }
  // }, [userType, navigate]);
useEffect(() => {
  if (userType !== "student") {
    navigate("/");
  }

  checkLeaveStatus(); // 🔥 ADD THIS

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
      `https://hostel-tprs.onrender.com/api/leave/check?email=${user?.email}`
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
        "https://hostel-tprs.onrender.com/api/face-attendance",
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
        throw new Error(data.message || "Verification failed");
      }

      setAttendanceMarked(true);

      toast({
        title: "Attendance marked successfully ✓",
      });
    } catch (err: any) {
  console.error(err);

  toast({
    title: "Verification Failed",
    description: err.message,
    variant: "destructive",
  });
} finally {
      setIsVerifying(false);
    }
  };

  // 🔥 APPLY LEAVE
  const applyLeave = async () => {
    if (!leaveFrom || !leaveTo) {
      toast({ title: "Please select leave dates", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(
        "https://hostel-tprs.onrender.com/api/leave",
        {
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
        }
      );

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
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">

    {/* HEADER */}
    <header className="flex justify-between items-center mb-8 p-5 bg-white/80 backdrop-blur rounded-2xl shadow-lg border">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Smart Hostel</h1>
        <p className="text-sm text-gray-500">AI-based Attendance System</p>

        <div className="mt-2 text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Name:</span> {user?.name}</p>
          <p><span className="font-medium">Roll No:</span> {user?.rollNo}</p>
          <p><span className="font-medium">Email:</span> {user?.email}</p>
        </div>
      </div>

      <Button variant="destructive" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </header>

    <div className="grid md:grid-cols-2 gap-6">

      {/* PROFILE CARD */}
      <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
          <CardDescription>Your basic details</CardDescription>
        </CardHeader>

        <CardContent className="text-gray-700 space-y-1">
          <p className="font-medium text-lg">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </CardContent>
      </Card>

      {/* LEAVE CARD */}
      <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
        <CardHeader>
          <CardTitle>Apply Leave</CardTitle>
          <CardDescription>Request leave for multiple days</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={leaveFrom}
              onChange={(e) => setLeaveFrom(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <input
              type="date"
              value={leaveTo}
              onChange={(e) => setLeaveTo(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <input
            type="text"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <Button className="w-full" onClick={applyLeave}>
            {isOnLeave ? "Already on Leave" : "Apply Leave"}
          </Button>
        </CardContent>
      </Card>
    </div>

    {/* ATTENDANCE CARD */}
    <Card className="mt-6 rounded-2xl shadow-lg border">
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
        <CardDescription>Face verification + location check</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* STATUS */}
        {isOnLeave && (
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm">
            ⚠️ You are currently on leave
          </div>
        )}

        {attendanceMarked && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm">
            ✅ Attendance marked successfully
          </div>
        )}

        {/* CAMERA */}
        {!isOnLeave && !attendanceMarked && (
          <>
            <div className="rounded-xl overflow-hidden border bg-black flex justify-center items-center">
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-72 object-cover"
              />
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={startCamera}>
                Open Camera
              </Button>

              <Button onClick={capturePhoto}>
                Capture
              </Button>

              <Button
                onClick={verifyFace}
                disabled={isVerifying}
                className="bg-green-600 hover:bg-green-700"
              >
                {isVerifying ? "Verifying..." : "Verify & Mark"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  </div>
);