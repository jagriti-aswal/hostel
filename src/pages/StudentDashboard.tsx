
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

  useEffect(() => {
    if (userType !== "student") {
      navigate("/");
    }
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
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => reject(error)
    );
  });
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
  longitude: location.longitude
})
        }
      );

      const data = await res.json();

console.log("FULL FACE RESPONSE:", JSON.stringify(data, null, 2));

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Face mismatch");
      }

      setAttendanceMarked(true);

      toast({
        title: "Attendance marked successfully ✓",
      });
    } catch (error) {
      toast({
        title: "Face not recognized",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-6">
      <header className="flex justify-between mb-6">
        <h1 className="font-semibold text-xl">Smart Hostel</h1>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Face verification required</CardDescription>
        </CardHeader>

        <CardContent>
          {attendanceMarked ? (
            <div className="text-center text-green-600 py-10">
              Attendance marked successfully
            </div>
          ) : (
            <>
              <div className="w-full h-[420px] bg-black rounded-xl overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-3">
                {!isCameraOpen && (
                  <Button onClick={startCamera}>Open Camera</Button>
                )}

                {isCameraOpen && (
                  <Button onClick={capturePhoto}>Capture</Button>
                )}

                {capturedImage && !isVerifying && (
                  <Button onClick={verifyFace}>Verify</Button>
                )}

                {isVerifying && <Button disabled>Verifying...</Button>}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;