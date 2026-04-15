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

  if (user?.email) {
    checkLeaveStatus(); // ✅ only when user is ready
  }

}, [userType, navigate, user]);
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
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100 p-6">

    {/* TOP BAR */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
        Student Dashboard
      </h1>

      <Button
        variant="destructive"
        onClick={handleLogout}
        className="rounded-xl px-5 shadow-md"
      >
        Logout
      </Button>
    </div>

    {/* MAIN GRID */}
    <div className="grid lg:grid-cols-2 gap-8">

      {/* ================= ATTENDANCE CARD ================= */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">📸 Attendance</h2>

          {isOnLeave && (
            <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border">
              On Leave
            </span>
          )}

          {attendanceMarked && (
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 border">
              Marked
            </span>
          )}
        </div>

        {/* STATUS INFO */}
        {isOnLeave && (
          <div className="mb-4 text-sm bg-yellow-50 text-yellow-800 p-3 rounded-xl border">
            ⚠️ You are currently on leave
          </div>
        )}

        {attendanceMarked && (
          <div className="mb-4 text-sm bg-green-50 text-green-700 p-3 rounded-xl border">
            ✅ Attendance successfully marked
          </div>
        )}

        {/* CAMERA BLOCK */}
        {!isOnLeave && !attendanceMarked && (
          <>
            <div className="relative rounded-2xl overflow-hidden border bg-black mb-4 shadow-md">
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-72 object-cover"
              />

              {!isCameraOpen && (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-black/70">
                  Camera is off
                </div>
              )}
            </div>

            {/* CAPTURED IMAGE */}
            {capturedImage && (
              <img
                src={capturedImage}
                className="rounded-xl border w-full h-44 object-cover mb-4 shadow-sm"
              />
            )}

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={startCamera} className="bg-indigo-600 rounded-xl">
                Open Camera
              </Button>

              <Button
                onClick={capturePhoto}
                disabled={!isCameraOpen}
                variant="secondary"
                className="rounded-xl"
              >
                Capture
              </Button>

              <Button
                onClick={verifyFace}
                disabled={!capturedImage || isVerifying}
                className="bg-green-600 rounded-xl"
              >
                {isVerifying ? "Verifying..." : "Verify Attendance"}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* ================= LEAVE CARD ================= */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">

        <h2 className="text-xl font-semibold mb-6">📅 Leave Application</h2>

        <div className="space-y-5">

          {/* DATE PICKERS */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={leaveFrom}
              onChange={(e) => setLeaveFrom(e.target.value)}
              className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="date"
              value={leaveTo}
              onChange={(e) => setLeaveTo(e.target.value)}
              className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* REASON */}
          <textarea
            placeholder="Write reason for leave..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400 h-28"
          />

          {/* BUTTON */}
          <Button
            onClick={applyLeave}
            disabled={isOnLeave}
            className="w-full bg-indigo-600 rounded-xl"
          >
            {isOnLeave ? "Leave Already Applied" : "Apply for Leave"}
          </Button>

          {/* INFO BOX */}
          {isOnLeave && (
            <div className="text-sm text-center bg-indigo-50 text-indigo-700 p-3 rounded-xl border">
              Your leave request is active
            </div>
          )}

        </div>
      </div>
    </div>
  </div>
);