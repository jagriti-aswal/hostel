// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { 
//   mockStudents, 
//   getTodayAttendance, 
//   AttendanceRecord,
//   getTodayString 
// } from '@/lib/mockData';
// import { 
//   Shield, 
//   LogOut, 
//   Users, 
//   CheckCircle2, 
//   XCircle, 
//   Search,
//   Calendar,
//   Clock,
//   MapPin,
//   Home
// } from 'lucide-react';

// const AdminDashboard: React.FC = () => {
//   const { user, logout, userType } = useAuth();
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [todayAttendance, setTodayAttendance] = useState<Map<string, AttendanceRecord>>(new Map());

//   useEffect(() => {
//     if (userType !== 'admin') {
//       navigate('/');
//     }
//   }, [userType, navigate]);

//   useEffect(() => {
//     // Refresh attendance data
//     const refreshAttendance = () => {
//       setTodayAttendance(getTodayAttendance());
//     };
    
//     refreshAttendance();
//     const interval = setInterval(refreshAttendance, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const filteredStudents = mockStudents.filter(student =>
//     student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     student.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const presentCount = mockStudents.filter(s => todayAttendance.has(s.id)).length;
//   const absentCount = mockStudents.length - presentCount;
//   const attendanceRate = Math.round((presentCount / mockStudents.length) * 100);

//   const today = new Date();
//   const formattedDate = today.toLocaleDateString('en-US', { 
//     weekday: 'long', 
//     year: 'numeric', 
//     month: 'long', 
//     day: 'numeric' 
//   });

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 glass border-b">
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
//               <Shield className="w-5 h-5 text-background" />
//             </div>
//             <div>
//               <h1 className="font-semibold text-foreground">Smart Hostel</h1>
//               <p className="text-xs text-muted-foreground">Admin Dashboard</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="text-sm text-muted-foreground hidden sm:block">
//               Welcome, {user.email}
//             </span>
//             <Button variant="ghost" size="sm" onClick={handleLogout}>
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-6">
//         {/* Date Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6"
//         >
//           <div className="flex items-center gap-2 text-muted-foreground mb-1">
//             <Calendar className="w-4 h-4" />
//             <span className="text-sm">{formattedDate}</span>
//           </div>
//           <h2 className="text-3xl font-bold text-foreground">Today's Attendance</h2>
//         </motion.div>

//         {/* Stats Cards */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
//         >
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Students</p>
//                   <p className="text-3xl font-bold text-foreground">{mockStudents.length}</p>
//                 </div>
//                 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
//                   <Users className="w-6 h-6 text-primary" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Present</p>
//                   <p className="text-3xl font-bold text-status-present">{presentCount}</p>
//                 </div>
//                 <div className="w-12 h-12 rounded-xl bg-status-present-light flex items-center justify-center">
//                   <CheckCircle2 className="w-6 h-6 text-status-present" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Absent</p>
//                   <p className="text-3xl font-bold text-status-absent">{absentCount}</p>
//                 </div>
//                 <div className="w-12 h-12 rounded-xl bg-status-absent-light flex items-center justify-center">
//                   <XCircle className="w-6 h-6 text-status-absent" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="gradient-primary text-primary-foreground">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm opacity-80">Attendance Rate</p>
//                   <p className="text-3xl font-bold">{attendanceRate}%</p>
//                 </div>
//                 <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
//                   <Clock className="w-6 h-6" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Student List */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <Card>
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <CardTitle>Student Attendance List</CardTitle>
//                   <CardDescription>
//                     View and monitor today's attendance records
//                   </CardDescription>
//                 </div>
//                 <div className="relative w-full sm:w-72">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search students..."
//                     className="pl-10"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="rounded-lg border overflow-hidden">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-muted/50">
//                       <TableHead className="w-12">#</TableHead>
//                       <TableHead>Student</TableHead>
//                       <TableHead className="hidden md:table-cell">Roll Number</TableHead>
//                       <TableHead className="hidden sm:table-cell">Room</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead className="hidden lg:table-cell">Time</TableHead>
//                       <TableHead className="hidden lg:table-cell">Verification</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredStudents.map((student, index) => {
//                       const attendance = todayAttendance.get(student.id);
//                       const isPresent = !!attendance;
                      
//                       return (
//                         <TableRow key={student.id} className="hover:bg-muted/30">
//                           <TableCell className="font-medium text-muted-foreground">
//                             {index + 1}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-3">
//                               <img
//                                 src={student.profilePhoto}
//                                 alt={student.name}
//                                 className="w-10 h-10 rounded-full object-cover"
//                               />
//                               <div>
//                                 <p className="font-medium">{student.name}</p>
//                                 <p className="text-sm text-muted-foreground md:hidden">
//                                   {student.rollNumber}
//                                 </p>
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell className="hidden md:table-cell">
//                             {student.rollNumber}
//                           </TableCell>
//                           <TableCell className="hidden sm:table-cell">
//                             <div className="flex items-center gap-1">
//                               <Home className="w-3 h-3 text-muted-foreground" />
//                               {student.roomNumber}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <Badge 
//                               variant={isPresent ? "default" : "secondary"}
//                               className={isPresent ? "bg-status-present hover:bg-status-present/90" : "bg-status-absent-light text-status-absent"}
//                             >
//                               {isPresent ? (
//                                 <>
//                                   <CheckCircle2 className="w-3 h-3 mr-1" />
//                                   Present
//                                 </>
//                               ) : (
//                                 <>
//                                   <XCircle className="w-3 h-3 mr-1" />
//                                   Absent
//                                 </>
//                               )}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="hidden lg:table-cell text-muted-foreground">
//                             {attendance ? (
//                               new Date(attendance.markedAt).toLocaleTimeString('en-US', {
//                                 hour: '2-digit',
//                                 minute: '2-digit'
//                               })
//                             ) : (
//                               '-'
//                             )}
//                           </TableCell>
//                           <TableCell className="hidden lg:table-cell">
//                             {attendance ? (
//                               <div className="flex items-center gap-2">
//                                 {attendance.locationVerified && (
//                                   <Badge variant="outline" className="text-xs">
//                                     <MapPin className="w-3 h-3 mr-1" />
//                                     GPS
//                                   </Badge>
//                                 )}
//                                 <Badge variant="outline" className="text-xs">
//                                   Face ID
//                                 </Badge>
//                               </div>
//                             ) : (
//                               '-'
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </div>
              
//               {filteredStudents.length === 0 && (
//                 <div className="text-center py-12">
//                   <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
//                   <p className="text-muted-foreground">No students found matching your search.</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

// import React, { useEffect, useMemo, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import axios from "axios"; 
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';

// import {
//   mockStudents,
//   getTodayAttendance,
//   AttendanceRecord,
// } from '@/lib/mockData';

// import {
//   Shield,
//   LogOut,
//   Users,
//   CheckCircle2,
//   XCircle,
//   Search,
//   Calendar,
//   Clock,
//   MapPin,
//   Home,
//   Plus,
//   X,
// } from 'lucide-react';

// const AdminDashboard: React.FC = () => {
//   const { user, logout, userType } = useAuth();
//   const navigate = useNavigate();

//   const [search, setSearch] = useState('');
//   const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(
//     new Map()
//   );
//   const [showAddStudent, setShowAddStudent] = useState(false);
//   const [formData, setFormData] = useState({
//   name: "",
//   email: "",
//   password: "",
//   rollNumber: "",
//   roomNumber: "",
// });
// const [photo, setPhoto] = useState<File | null>(null);

//   /* ---------------- AUTH GUARD ---------------- */
//   useEffect(() => {
//     if (userType !== 'admin') navigate('/');
//   }, [userType, navigate]);

//   /* ------------- ATTENDANCE REFRESH ------------ */
//   useEffect(() => {
//     const refresh = () => setAttendance(getTodayAttendance());
//     refresh();

//     const interval = setInterval(refresh, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   /* ---------------- DERIVED DATA ---------------- */
//   const filteredStudents = useMemo(() => {
//     const q = search.toLowerCase();
//     return mockStudents.filter(
//       (s) =>
//         s.name.toLowerCase().includes(q) ||
//         s.rollNumber.toLowerCase().includes(q) ||
//         s.roomNumber.toLowerCase().includes(q)
//     );
//   }, [search]);

//   const presentCount = mockStudents.filter((s) =>
//     attendance.has(s.id)
//   ).length;

//   const total = mockStudents.length;
//   const absentCount = total - presentCount;
//   const attendanceRate = Math.round((presentCount / total) * 100);

//   const todayLabel = new Date().toLocaleDateString('en-US', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });
//  // 👈 top of file me imports ke saath

// // 👇 AdminDashboard component ke andar
// const handleAddStudent = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       data.append(key, value);
//     });

//     if (photo) data.append("photo", photo);

//     await axios.post("http://localhost:5000/api/admin/students", data, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     alert("Student added successfully");

//   } catch (error) {
//     console.error(error);
//     alert("Failed to add student");
//   }
// };

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-background">
//       {/* ================= HEADER ================= */}
//       <header className="sticky top-0 z-50 glass border-b">
//         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
//               <Shield className="w-5 h-5 text-background" />
//             </div>
//             <div>
//               <h1 className="font-semibold">Smart Hostel</h1>
//               <p className="text-xs text-muted-foreground">
//                 Admin Dashboard
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button size="sm" onClick={() => setShowAddStudent(true)}>
//               <Plus className="w-4 h-4 mr-2" />
//               Add Student
//             </Button>

//             <Button variant="ghost" size="sm" onClick={logout}>
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* ================= MAIN ================= */}
//       <main className="container mx-auto px-4 py-6">
//         {/* Date */}
//         <Card className="mb-6">
//   <CardHeader>
//     <CardTitle>Add New Student</CardTitle>
//   </CardHeader>
//   <CardContent className="space-y-3">
//     <Input placeholder="Name" onChange={e => setFormData({ ...formData, name: e.target.value })} />
//     <Input placeholder="Email" onChange={e => setFormData({ ...formData, email: e.target.value })} />
//     <Input type="password" placeholder="Password" onChange={e => setFormData({ ...formData, password: e.target.value })} />
//     <Input placeholder="Roll Number" onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} />
//     <Input placeholder="Room Number" onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} />
//     <Input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />

//     <Button onClick={handleAddStudent}>Add Student</Button>
//   </CardContent>
// </Card>

//         <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
//           <div className="flex items-center gap-2 text-muted-foreground mb-1">
//             <Calendar className="w-4 h-4" />
//             <span className="text-sm">{todayLabel}</span>
//           </div>
//           <h2 className="text-3xl font-bold">Today’s Attendance</h2>
//         </motion.div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
//           <Stat label="Total Students" value={total} icon={<Users />} />
//           <Stat label="Present" value={presentCount} icon={<CheckCircle2 />} />
//           <Stat label="Absent" value={absentCount} icon={<XCircle />} />
//           <Stat
//             label="Attendance Rate"
//             value={`${attendanceRate}%`}
//             icon={<Clock />}
//             highlight
//           />
//         </div>

//         {/* Student Table */}
//         <Card>
//           <CardHeader>
//             <div className="flex flex-col sm:flex-row justify-between gap-4">
//               <div>
//                 <CardTitle>Student Attendance List</CardTitle>
//                 <CardDescription>
//                   Monitor today’s attendance
//                 </CardDescription>
//               </div>
//               <div className="relative w-full sm:w-72">
//                 <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search students..."
//                   className="pl-10"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//               </div>
//             </div>
//           </CardHeader>

//           <CardContent>
//             <div className="border rounded-lg overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>#</TableHead>
//                     <TableHead>Student</TableHead>
//                     <TableHead className="hidden md:table-cell">
//                       Roll
//                     </TableHead>
//                     <TableHead className="hidden sm:table-cell">
//                       Room
//                     </TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {filteredStudents.map((s, i) => {
//                     const record = attendance.get(s.id);
//                     const present = !!record;

//                     return (
//                       <TableRow key={s.id}>
//                         <TableCell>{i + 1}</TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-3">
//                             <img
//                               src={s.profilePhoto}
//                               className="w-9 h-9 rounded-full"
//                             />
//                             <div>
//                               <p className="font-medium">{s.name}</p>
//                               <p className="text-xs text-muted-foreground">
//                                 {s.rollNumber}
//                               </p>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell className="hidden md:table-cell">
//                           {s.rollNumber}
//                         </TableCell>
//                         <TableCell className="hidden sm:table-cell">
//                           <Home className="inline w-3 h-3 mr-1" />
//                           {s.roomNumber}
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             className={
//                               present
//                                 ? 'bg-status-present'
//                                 : 'bg-status-absent-light text-status-absent'
//                             }
//                           >
//                             {present ? 'Present' : 'Absent'}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </main>

//       {/* =============== ADD STUDENT MODAL =============== */}
//       <AnimatePresence>
//         {showAddStudent && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-background rounded-xl w-full max-w-md p-6"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">Add Student</h3>
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   onClick={() => setShowAddStudent(false)}
//                 >
//                   <X />
//                 </Button>
//               </div>

//               <div className="space-y-3">
//                 <Input placeholder="Student Name" />
//                 <Input placeholder="Roll Number" />
//                 <Input placeholder="Room Number" />
//                 <Input placeholder="Profile Photo URL" />

//                 <Button className="w-full mt-2">
//                   Save Student
//                 </Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// /* ---------------- SMALL STAT CARD ---------------- */
// const Stat = ({
//   label,
//   value,
//   icon,
//   highlight = false,
// }: any) => (
//   <Card className={highlight ? 'gradient-primary text-primary-foreground' : ''}>
//     <CardContent className="p-6 flex justify-between items-center">
//       <div>
//         <p className="text-sm opacity-80">{label}</p>
//         <p className="text-2xl font-bold">{value}</p>
//       </div>
//       {icon}
//     </CardContent>
//   </Card>
// );

// export default AdminDashboard;





import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from "axios"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  // mockStudents,
  getTodayAttendance,
  AttendanceRecord,
} from '@/lib/mockData';

import {
  Shield,
  LogOut,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Calendar,
  Clock,
  MapPin,
  Home,
  Plus,
  X,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, logout, userType } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(
    new Map()
  );
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  rollNumber: "",
  roomNumber: "",
});
const [photo, setPhoto] = useState<File | null>(null);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (userType !== 'admin') navigate('/');
  }, [userType, navigate]);

    useEffect(() => {
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  fetchStudents();
}, []);
  /* ------------- ATTENDANCE REFRESH ------------ */
  useEffect(() => {
    const refresh = () => setAttendance(getTodayAttendance());
    refresh();

    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- DERIVED DATA ---------------- */
  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    // return mockStudents.filter(
    //   (s) =>
    //     s.name.toLowerCase().includes(q) ||
    //     s.rollNumber.toLowerCase().includes(q) ||
    //     s.roomNumber.toLowerCase().includes(q)
    // );
    return students.filter(
  (s) =>
    s.name?.toLowerCase().includes(q) ||
    s.rollNumber?.toLowerCase().includes(q) ||
    s.roomNumber?.toLowerCase().includes(q)
);
  }, [search,students]);

  const presentCount = students.filter((s) =>
    attendance.has(s._id)
  ).length;

  const total = students.length;
  const absentCount = total - presentCount;
  const attendanceRate = Math.round((presentCount / total) * 100);

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
 // 👈 top of file me imports ke saath

// 👇 AdminDashboard component ke andar
const handleAddStudent = async () => {
  try {
    const token = localStorage.getItem("token");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (photo) data.append("photo", photo);

    await axios.post("http://localhost:5000/api/admin/students", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Student added successfully");

  } catch (error) {
    console.error(error);
    alert("Failed to add student");
  }
};

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="font-semibold">Smart Hostel</h1>
              <p className="text-xs text-muted-foreground">
                Admin Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => setShowAddStudent(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>

            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="container mx-auto px-4 py-6">
        {/* Date */}
        <Card className="mb-6">
  <CardHeader>
    <CardTitle>Add New Student</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    <Input placeholder="Name" onChange={e => setFormData({ ...formData, name: e.target.value })} />
    <Input placeholder="Email" onChange={e => setFormData({ ...formData, email: e.target.value })} />
    <Input type="password" placeholder="Password" onChange={e => setFormData({ ...formData, password: e.target.value })} />
    <Input placeholder="Roll Number" onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} />
    <Input placeholder="Room Number" onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} />
    <Input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />

    <Button onClick={handleAddStudent}>Add Student</Button>
  </CardContent>
</Card>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{todayLabel}</span>
          </div>
          <h2 className="text-3xl font-bold">Today’s Attendance</h2>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          <Stat label="Total Students" value={total} icon={<Users />} />
          <Stat label="Present" value={presentCount} icon={<CheckCircle2 />} />
          <Stat label="Absent" value={absentCount} icon={<XCircle />} />
          <Stat
            label="Attendance Rate"
            value={`${attendanceRate}%`}
            icon={<Clock />}
            highlight
          />
        </div>

        {/* Student Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>Student Attendance List</CardTitle>
                <CardDescription>
                  Monitor today’s attendance
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Roll
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Room
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredStudents.map((s, i) => {
                    const record = attendance.get(s._id);
                    const present = !!record;

                    return (
                      <TableRow key={s._id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {/* <img
                              src={s.profilePhoto}
                              className="w-9 h-9 rounded-full"
                            /> */}
                            <img
  src={`http://localhost:5000${s.photo}`}
  className="w-9 h-9 rounded-full"
/>
                            <div>
                              <p className="font-medium">{s.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {s.rollNumber}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {s.rollNumber}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Home className="inline w-3 h-3 mr-1" />
                          {s.roomNumber}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              present
                                ? 'bg-status-present'
                                : 'bg-status-absent-light text-status-absent'
                            }
                          >
                            {present ? 'Present' : 'Absent'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* =============== ADD STUDENT MODAL =============== */}
      <AnimatePresence>
        {showAddStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-background rounded-xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Student</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowAddStudent(false)}
                >
                  <X />
                </Button>
              </div>

              <div className="space-y-3">
                <Input placeholder="Student Name" />
                <Input placeholder="Roll Number" />
                <Input placeholder="Room Number" />
                <Input placeholder="Profile Photo URL" />

                <Button className="w-full mt-2">
                  Save Student
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- SMALL STAT CARD ---------------- */
const Stat = ({
  label,
  value,
  icon,
  highlight = false,
}: any) => (
  <Card className={highlight ? 'gradient-primary text-primary-foreground' : ''}>
    <CardContent className="p-6 flex justify-between items-center">
      <div>
        <p className="text-sm opacity-80">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {icon}
    </CardContent>
  </Card>
);

export default AdminDashboard;


// this is my adminDashboard but i cant see any student 
// may be i dint add any routes in server.js