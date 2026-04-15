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
import {
  LogOut,
  Camera,
  Check,
  Calendar,
  User,
  Mail,
  Hash,
  Clock,
  FileText,
} from "lucide-react";

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

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    if (userType !== "student") {
      navigate("/");
    }

    if (user?.email) {
      checkLeaveStatus();
    }
  }, [userType, navigate, user]);

  // ---------------- CAMERA ----------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraOpen(true);
      }
    } catch {
      toast({ title: "Camera blocked", variant: "destructive" });
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());

    if (videoRef.current) videoRef.current.srcObject = null;
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

  // ---------------- LOCATION ----------------
  const getLocation = () =>
    new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        reject
      );
    });

  // ---------------- ATTENDANCE ----------------
  const verifyFace = async () => {
    if (!capturedImage || !user?.email) return;

    try {
      setIsVerifying(true);

      const location = await getLocation();

      const res = await fetch(
        "https://hostel-tprs.onrender.com/api/face-attendance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        throw new Error(data.message || "Face verification failed");
      }

      setAttendanceMarked(true);

      toast({ title: "Attendance marked successfully ✓" });
    } catch (err: any) {
      toast({
        title: "Verification Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // ---------------- LEAVE CHECK ----------------
  const checkLeaveStatus = async () => {
    try {
      const res = await fetch(
        `https://hostel-tprs.onrender.com/api/leave/check?email=${user?.email}`
      );

      const data = await res.json();
      if (data.isOnLeave) setIsOnLeave(true);
    } catch {
      console.error("Leave check failed");
    }
  };

  // ---------------- APPLY LEAVE ----------------
  const applyLeave = async () => {
    if (!leaveFrom || !leaveTo) {
      toast({
        title: "Please select leave dates",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(
        "https://hostel-tprs.onrender.com/api/leave",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      toast({ title: "Leave applied successfully ✓" });
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

  // ================= UI (UNCHANGED SMART HOSTEL DESIGN) =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* HEADER */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <h1 className="font-bold text-xl">Smart Hostel</h1>

          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* PROFILE */}
        <Card className="shadow-lg">
          <CardContent className="p-6 grid sm:grid-cols-3 gap-4">
            <div>
              <User /> {user.name}
            </div>
            <div>
              <Hash /> {user.rollNo}
            </div>
            <div>
              <Mail /> {user.email}
            </div>
          </CardContent>
        </Card>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* LEAVE */}
          <Card>
            <CardHeader>
              <CardTitle>Apply Leave</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <input
                type="date"
                value={leaveFrom}
                onChange={(e) => setLeaveFrom(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <input
                type="date"
                value={leaveTo}
                onChange={(e) => setLeaveTo(e.target.value)}
                className="border p-2 w-full rounded"
              />

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Reason"
              />

              <Button onClick={applyLeave} className="w-full">
                Submit Leave
              </Button>

              {isOnLeave && (
                <p className="text-green-600 text-sm">Leave Active</p>
              )}
            </CardContent>
          </Card>

          {/* ATTENDANCE */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">

              {isOnLeave ? (
                <p className="text-yellow-600">You are on leave</p>
              ) : attendanceMarked ? (
                <p className="text-green-600">Attendance marked ✓</p>
              ) : (
                <>
                  <video ref={videoRef} className="w-full rounded" />
                  <canvas ref={canvasRef} className="hidden" />

                  {capturedImage && (
                    <img src={capturedImage} className="rounded" />
                  )}

                  <div className="flex gap-2">
                    <Button onClick={startCamera}>Open</Button>
                    <Button onClick={capturePhoto}>Capture</Button>
                    <Button
                      onClick={verifyFace}
                      disabled={!capturedImage || isVerifying}
                    >
                      {isVerifying ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;