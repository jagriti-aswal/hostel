// import React, { useState, useRef, useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import { LogOut } from "lucide-react";

// const StudentDashboard: React.FC = () => {
//   const { user, logout, userType } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [attendanceMarked, setAttendanceMarked] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);

//   useEffect(() => {
//     if (userType !== "student") {
//       navigate("/");
//     }
//   }, [userType, navigate]);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         await videoRef.current.play();
//         setIsCameraOpen(true);
//       }
//     } catch {
//       toast({
//         title: "Camera blocked",
//         variant: "destructive",
//       });
//     }
//   };

//   const stopCamera = () => {
//     const stream = videoRef.current?.srcObject as MediaStream | null;
//     stream?.getTracks().forEach((track) => track.stop());

//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }

//     setIsCameraOpen(false);
//   };

//   const capturePhoto = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     if (!video || !canvas) return;

//     if (video.videoWidth === 0) {
//       toast({ title: "Camera not ready" });
//       return;
//     }

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const ctx = canvas.getContext("2d");
//     ctx?.drawImage(video, 0, 0);

//     const img = canvas.toDataURL("image/jpeg", 0.9);

//     setCapturedImage(img);
//     stopCamera();
//   };

//   const getLocation = () => {
//     return new Promise<{ latitude: number; longitude: number }>(
//       (resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             resolve({
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             });
//           },
//           (error) => reject(error)
//         );
//       }
//     );
//   };

//   const verifyFace = async () => {
//     if (!capturedImage || !user) return;

//     try {
//       const location = await getLocation();
//       setIsVerifying(true);

//       const res = await fetch(
//         "https://hostel-tprs.onrender.com/api/face-attendance",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: user.email,
//             image: capturedImage,
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         throw new Error(data.message || "Face mismatch");
//       }

//       setAttendanceMarked(true);

//       toast({
//         title: "Attendance marked successfully ✓",
//       });
//     } catch (error) {
//       toast({
//         title: "Face not recognized",
//         variant: "destructive",
//       });
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   if (!user) return null;

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">

//       {/* ================= HEADER (UNCHANGED + SAFE ADDITION) ================= */}
//       <header className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm">
//         <div>
//           <h1 className="font-semibold text-xl">Smart Hostel</h1>

//           {/* 🔥 ADDED SAFE DISPLAY (NO REMOVAL) */}
//           <div className="mt-1 text-sm text-gray-600">
//             <p>
//               Name: <span className="font-medium">{user?.name || "Not Available"}</span>
//             </p>
//             <p>
//               Roll No: <span className="font-medium">{user?.rollNo || "Not Available"}</span>
//             </p>
//             <p>
//               Email: <span className="font-medium">{user?.email}</span>
//             </p>
//           </div>
//         </div>

//         <Button variant="ghost" onClick={handleLogout}>
//           <LogOut className="w-4 h-4 mr-2" /> Logout
//         </Button>
//       </header>

//       {/* ================= PROFILE CARD (ADDED ONLY, NO CHANGE) ================= */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Student Profile</CardTitle>
//           <CardDescription>Your registered details</CardDescription>
//         </CardHeader>

//         <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <p className="text-gray-500 text-sm">Name</p>
//             <p className="font-semibold">{user?.name || "Not Available"}</p>
//           </div>

//           <div>
//             <p className="text-gray-500 text-sm">Roll Number</p>
//             <p className="font-semibold">{user?.rollNo || "Not Available"}</p>
//           </div>

//           <div>
//             <p className="text-gray-500 text-sm">Email</p>
//             <p className="font-semibold">{user?.email}</p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* ================= ATTENDANCE CARD (UNCHANGED) ================= */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Mark Attendance</CardTitle>
//           <CardDescription>Face verification required</CardDescription>
//         </CardHeader>

//         <CardContent>
//           {attendanceMarked ? (
//             <div className="text-center text-green-600 py-10">
//               Attendance marked successfully
//             </div>
//           ) : (
//             <>
//               <div className="w-full h-[420px] bg-black rounded-xl overflow-hidden mb-4">
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   playsInline
//                   muted
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               <canvas ref={canvasRef} className="hidden" />

//               <div className="flex gap-3 flex-wrap">
//                 {!isCameraOpen && (
//                   <Button onClick={startCamera}>Open Camera</Button>
//                 )}

//                 {isCameraOpen && (
//                   <Button onClick={capturePhoto}>Capture</Button>
//                 )}

//                 {capturedImage && !isVerifying && (
//                   <Button onClick={verifyFace}>Verify</Button>
//                 )}

//                 {isVerifying && <Button disabled>Verifying...</Button>}
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default StudentDashboard;

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