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
    <div className="min-h-screen p-6 bg-gray-50">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm">
        <div>
          <h1 className="font-semibold text-xl">Smart Hostel</h1>

          <div className="mt-1 text-sm text-gray-600">
            <p>Name: {user?.name}</p>
            <p>Roll No: {user?.rollNo}</p>
            <p>Email: {user?.email}</p>
          </div>
        </div>

        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      {/* PROFILE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{user?.name}</p>
        </CardContent>
      </Card>

      {/* 🔥 LEAVE FORM */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Apply Leave</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <input type="date" value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)} />
          <input type="date" value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)} />
          <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />

          <Button onClick={applyLeave}>Apply Leave</Button>
        </CardContent>
      </Card>

      {/* ATTENDANCE */}
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
        </CardHeader>

        <CardContent>
          {isOnLeave ? (
            <div className="text-yellow-600">You are on leave</div>
          ) : attendanceMarked ? (
            <div className="text-green-600">Attendance marked</div>
          ) : (
            <>
              <video ref={videoRef} autoPlay />
              <canvas ref={canvasRef} className="hidden" />

              <Button onClick={startCamera}>Open Camera</Button>
              <Button onClick={capturePhoto}>Capture</Button>
              <Button onClick={verifyFace}>Verify</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;