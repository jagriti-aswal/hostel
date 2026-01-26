// Mock data for the hostel attendance system

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  hostelName: string;
  roomNumber: string;
  email: string;
  profilePhoto: string;
  password: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  markedAt: string;
  status: 'present' | 'absent';
  verificationMethod: 'face' | 'manual';
  locationVerified: boolean;
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    rollNumber: 'CS2021001',
    hostelName: 'Lotus Hall',
    roomNumber: 'A-101',
    email: 'priya.sharma@college.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    password: 'student123'
  },
  {
    id: '2',
    name: 'Ananya Patel',
    rollNumber: 'CS2021002',
    hostelName: 'Lotus Hall',
    roomNumber: 'A-102',
    email: 'ananya.patel@college.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    password: 'student123'
  },
  {
    id: '3',
    name: 'Kavya Reddy',
    rollNumber: 'EC2021001',
    hostelName: 'Lotus Hall',
    roomNumber: 'B-201',
    email: 'kavya.reddy@college.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    password: 'student123'
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    rollNumber: 'ME2021001',
    hostelName: 'Lotus Hall',
    roomNumber: 'B-202',
    email: 'sneha.gupta@college.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    password: 'student123'
  },
  {
    id: '5',
    name: 'Riya Singh',
    rollNumber: 'IT2021001',
    hostelName: 'Lotus Hall',
    roomNumber: 'C-301',
    email: 'riya.singh@college.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    password: 'student123'
  },
  {
    id: '6',
    name: 'Divya Menon',
    rollNumber: 'CS2021003',
    hostelName: 'Rose Hall',
    roomNumber: 'A-101',
    email: 'divya.menon@college.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
    password: 'student123'
  },
  {
    id: '7',
    name: 'Meera Krishnan',
    rollNumber: 'EC2021002',
    hostelName: 'Rose Hall',
    roomNumber: 'A-102',
    email: 'meera.krishnan@college.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face',
    password: 'student123'
  },
  {
    id: '8',
    name: 'Aisha Khan',
    rollNumber: 'ME2021002',
    hostelName: 'Rose Hall',
    roomNumber: 'B-201',
    email: 'aisha.khan@college.edu',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    password: 'student123'
  }
];

export const mockAdmin = {
  id: 'admin1',
  name: 'Dr. Lakshmi Iyer',
  email: 'admin@college.edu',
  password: 'admin123',
  role: 'warden'
};

// Helper to get today's date string
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

// Storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'hostel_current_user',
  USER_TYPE: 'hostel_user_type',
  ATTENDANCE_RECORDS: 'hostel_attendance_records'
};

// Get attendance records from localStorage
export const getAttendanceRecords = (): AttendanceRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS);
  return stored ? JSON.parse(stored) : [];
};

// Save attendance record
export const saveAttendanceRecord = (record: AttendanceRecord) => {
  const records = getAttendanceRecords();
  const existingIndex = records.findIndex(
    r => r.studentId === record.studentId && r.date === record.date
  );
  
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(records));
};

// Check if student has marked attendance today
export const hasMarkedAttendanceToday = (studentId: string): boolean => {
  const records = getAttendanceRecords();
  const today = getTodayString();
  return records.some(r => r.studentId === studentId && r.date === today && r.status === 'present');
};

// Get today's attendance for all students
export const getTodayAttendance = (): Map<string, AttendanceRecord> => {
  const records = getAttendanceRecords();
  const today = getTodayString();
  const todayRecords = new Map<string, AttendanceRecord>();
  
  records.filter(r => r.date === today).forEach(r => {
    todayRecords.set(r.studentId, r);
  });
  
  return todayRecords;
};

// Check if current time is within attendance window (8:30 PM - 9:30 PM)
export const isWithinAttendanceWindow = (): boolean => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;
  
  // 8:30 PM = 20:30 = 1230 minutes
  // 9:30 PM = 21:30 = 1290 minutes
  const startTime = 20 * 60 + 30; // 8:30 PM
  const endTime = 21 * 60 + 30;   // 9:30 PM
  
  return currentMinutes >= startTime && currentMinutes <= endTime;
};

// For demo purposes - always return true
export const isWithinAttendanceWindowDemo = (): boolean => {
  return true;
};
