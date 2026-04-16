


// import React, { useState, useRef, useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import {
//   LogOut,
//   Camera,
//   Check,
//   User,
//   Mail,
//   Hash,
//   Calendar,
//   FileText,
// } from "lucide-react";

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

//   const [leaveFrom, setLeaveFrom] = useState("");
//   const [leaveTo, setLeaveTo] = useState("");
//   const [reason, setReason] = useState("");
//   const [isOnLeave, setIsOnLeave] = useState(false);

//   // AUTH
//   useEffect(() => {
//     if (userType !== "student") navigate("/");
//     if (user?.email) checkLeaveStatus();
//   }, [userType, navigate, user]);

//   // CAMERA
//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         await videoRef.current.play();
//         setIsCameraOpen(true);
//       }
//     } catch {
//       toast({ title: "Camera blocked", variant: "destructive" });
//     }
//   };

//   const stopCamera = () => {
//     const stream = videoRef.current?.srcObject as MediaStream | null;
//     stream?.getTracks().forEach((t) => t.stop());
//     if (videoRef.current) videoRef.current.srcObject = null;
//     setIsCameraOpen(false);
//   };

//   const capturePhoto = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas) return;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const ctx = canvas.getContext("2d");
//     ctx?.drawImage(video, 0, 0);

//     const img = canvas.toDataURL("image/jpeg", 0.9);
//     setCapturedImage(img);
//     stopCamera();
//   };

//   // LOCATION
//   const getLocation = () =>
//     new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) =>
//           resolve({
//             latitude: pos.coords.latitude,
//             longitude: pos.coords.longitude,
//           }),
//         reject
//       );
//     });

//   // ATTENDANCE
//   const verifyFace = async () => {
//     if (!capturedImage || !user?.email) return;

//     try {
//       setIsVerifying(true);
//       const location = await getLocation();

//       const res = await fetch(
//         "https://hostel-tprs.onrender.com/api/face-attendance",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: user.email,
//             image: capturedImage,
//             latitude: location.latitude,
//             longitude: location.longitude,
//           }),
//         }
//       );

//       const data = await res.json();
//       if (!res.ok || !data.success) throw new Error(data.message);

//       setAttendanceMarked(true);
//       toast({ title: "Attendance marked ✓" });
//     } catch (err: any) {
//       toast({
//         title: "Verification Failed",
//         description: err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   // LEAVE CHECK
//   const checkLeaveStatus = async () => {
//     try {
//       const res = await fetch(
//         `https://hostel-tprs.onrender.com/api/leave/check?email=${user?.email}`
//       );
//       const data = await res.json();
//       setIsOnLeave(data.isOnLeave);
//     } catch {}
//   };

//   // APPLY LEAVE
//   const applyLeave = async () => {
//     try {
//       const res = await fetch("https://hostel-tprs.onrender.com/api/leave", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: user?.email,
//           from: leaveFrom,
//           to: leaveTo,
//           reason,
//         }),
//       });

//       if (!res.ok) throw new Error();

//       setIsOnLeave(true);
//       toast({ title: "Leave applied ✓" });
//     } catch {
//       toast({ title: "Failed to apply leave", variant: "destructive" });
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

//       {/* HEADER */}
//       <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
//         <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
//           <h1 className="text-xl font-bold">🎓 Smart Hostel</h1>
//           <Button onClick={handleLogout} variant="outline">
//             <LogOut className="w-4 h-4 mr-2" />
//             Logout
//           </Button>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

//         {/* PROFILE */}
//         <Card className="shadow-md rounded-2xl">
//           <CardContent className="p-6 grid md:grid-cols-3 gap-4 text-sm">

//             <div className="flex items-center gap-2">
//               <User className="w-4 h-4" />
//               <span>{user.name}</span>
//             </div>

//             <div className="flex items-center gap-2">
//               <Hash className="w-4 h-4" />
//               <span>{user.rollNo}</span>
//             </div>

//             <div className="flex items-center gap-2">
//               <Mail className="w-4 h-4" />
//               <span>{user.email}</span>
//             </div>

//           </CardContent>
//         </Card>

//         {/* GRID */}
//         <div className="grid lg:grid-cols-2 gap-6">

//           {/* LEAVE CARD */}
//           <Card className="rounded-2xl shadow-md">
//             <CardHeader>
//               <CardTitle>📅 Leave Application</CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-3">
//               <input type="date" value={leaveFrom}
//                 onChange={(e) => setLeaveFrom(e.target.value)}
//                 className="border p-2 w-full rounded-lg"
//               />

//               <input type="date" value={leaveTo}
//                 onChange={(e) => setLeaveTo(e.target.value)}
//                 className="border p-2 w-full rounded-lg"
//               />

//               <textarea
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 placeholder="Reason"
//                 className="border p-2 w-full rounded-lg"
//               />

//               <Button className="w-full" onClick={applyLeave}>
//                 Submit Leave
//               </Button>

//               {isOnLeave && (
//                 <p className="text-green-600 text-sm font-medium">
//                   ✔ Leave Active
//                 </p>
//               )}
//             </CardContent>
//           </Card>

//           {/* ATTENDANCE CARD */}
//           <Card className="rounded-2xl shadow-md">
//             <CardHeader>
//               <CardTitle>📸 Face Attendance</CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-4">

//               {isOnLeave ? (
//                 <p className="text-yellow-600 font-medium">
//                   You are on leave today
//                 </p>
//               ) : attendanceMarked ? (
//                 <div className="text-green-600 font-semibold flex items-center gap-2">
//                   <Check className="w-4 h-4" />
//                   Attendance Marked
//                 </div>
//               ) : (
//                 <>
//                   <div className="rounded-xl overflow-hidden border bg-black">
//                     <video ref={videoRef} className="w-full" />
//                   </div>

//                   <canvas ref={canvasRef} className="hidden" />

//                   {capturedImage && (
//                     <img src={capturedImage} className="rounded-xl border" />
//                   )}

//                   <div className="grid grid-cols-3 gap-2">
//                     <Button onClick={startCamera}>Open</Button>
//                     <Button onClick={capturePhoto} variant="secondary">
//                       Capture
//                     </Button>
//                     <Button
//                       onClick={verifyFace}
//                       disabled={!capturedImage || isVerifying}
//                     >
//                       {isVerifying ? "..." : "Verify"}
//                     </Button>
//                   </div>
//                 </>
//               )}

//             </CardContent>
//           </Card>

//         </div>
//       </main>
//     </div>
//   );
// };

// export default StudentDashboard;


import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  Camera,
  Check,
  Mail,
  Calendar,
  ShieldCheck,
  Clock,
  MapPin,
  CircleDot
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

  useEffect(() => {
    if (userType !== "student") navigate("/");
    if (user?.email) checkLeaveStatus();
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
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);
    const img = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(img);
    stopCamera();
  };

  const getLocation = () =>
    new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        reject
      );
    });

  const verifyFace = async () => {
    if (!capturedImage || !user?.email) return;
    try {
      setIsVerifying(true);
      const location = await getLocation();
      const res = await fetch("https://hostel-tprs.onrender.com/api/face-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          image: capturedImage,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      setAttendanceMarked(true);
      toast({ title: "Attendance Success", description: "Your attendance has been recorded." });
    } catch (err: any) {
      toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const checkLeaveStatus = async () => {
    try {
      const res = await fetch(`https://hostel-tprs.onrender.com/api/leave/check?email=${user?.email}`);
      const data = await res.json();
      setIsOnLeave(data.isOnLeave);
    } catch {}
  };

  const applyLeave = async () => {
    try {
      const res = await fetch("https://hostel-tprs.onrender.com/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, from: leaveFrom, to: leaveTo, reason }),
      });
      if (!res.ok) throw new Error();
      setIsOnLeave(true);
      toast({ title: "Application Sent", description: "Leave request submitted successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to apply leave", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* MODERN NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              HostelPortal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
              <CircleDot className="w-3 h-3 text-green-500 animate-pulse" />
              {user.email}
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-500 hover:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">Student Dashboard</h2>
          <p className="text-slate-500 mt-1">Manage your daily attendance and leave requests effortlessly.</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* ATTENDANCE SECTION */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-50 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Facial Verification</CardTitle>
                    <CardDescription>Biometric check-in via camera</CardDescription>
                  </div>
                  {!attendanceMarked && !isOnLeave && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" /> Pending
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {isOnLeave ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
                    <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-900 text-lg">On Approved Leave</h3>
                    <p className="text-blue-600 text-sm">Attendance marking is suspended during your leave period.</p>
                  </div>
                ) : attendanceMarked ? (
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-10 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-green-900 text-xl">Verified Successfully</h3>
                    <p className="text-green-700 text-sm">Have a productive day at the hostel!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative group aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner ring-4 ring-slate-50">
                      {!isCameraOpen && !capturedImage && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                          <Camera className="w-10 h-10 mb-2 opacity-20" />
                          <p className="text-sm">Camera is currently inactive</p>
                        </div>
                      )}
                      
                      <video ref={videoRef} className={`w-full h-full object-cover ${!isCameraOpen && 'hidden'}`} />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {capturedImage && !isCameraOpen && (
                        <img src={capturedImage} className="w-full h-full object-cover animate-in fade-in" alt="Captured" />
                      )}

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                        {!isCameraOpen ? (
                          <Button onClick={startCamera} className="bg-white/90 hover:bg-white text-slate-900 backdrop-blur-md border-none shadow-xl px-6 rounded-full">
                            Start Camera
                          </Button>
                        ) : (
                          <Button onClick={capturePhoto} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl px-8 rounded-full">
                            Capture Moment
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={verifyFace} 
                        disabled={!capturedImage || isVerifying}
                        className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl transition-all disabled:opacity-50"
                      >
                        {isVerifying ? (
                          <span className="flex items-center gap-2">Processing...</span>
                        ) : (
                          <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Submit Attendance</span>
                        )}
                      </Button>
                      <p className="text-[11px] text-center text-slate-400">
                        Verification requires active location services and camera access.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* LEAVE SECTION */}
          <div className="lg:col-span-5">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Leave Application</CardTitle>
                <CardDescription>Request time away from the hostel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">From Date</label>
                    <input 
                      type="date" 
                      value={leaveFrom}
                      onChange={(e) => setLeaveFrom(e.target.value)}
                      className="w-full bg-slate-50 border-none text-sm p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">To Date</label>
                    <input 
                      type="date" 
                      value={leaveTo}
                      onChange={(e) => setLeaveTo(e.target.value)}
                      className="w-full bg-slate-50 border-none text-sm p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Reason for Leave</label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly explain the reason..."
                    className="w-full bg-slate-50 border-none text-sm p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                <Button 
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100" 
                  onClick={applyLeave}
                  disabled={!leaveFrom || !leaveTo || !reason}
                >
                  Submit Application
                </Button>

                {isOnLeave && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 rounded-xl text-emerald-700 text-xs font-bold border border-emerald-100">
                    <Check className="w-4 h-4" /> ACTIVE LEAVE STATUS
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;