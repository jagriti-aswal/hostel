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

// ✅ Proper in-memory variable
let attendanceRecords: AttendanceRecord[] = getAttendanceRecords();

// Save attendance record
export const saveAttendanceRecord = (record: AttendanceRecord) => {
  // Remove old record for same student
  attendanceRecords = attendanceRecords.filter(
    (r) => r.studentId !== record.studentId
  );

  attendanceRecords.push(record);

  // Save to localStorage
  localStorage.setItem(
    STORAGE_KEYS.ATTENDANCE_RECORDS,
    JSON.stringify(attendanceRecords)
  );
};

// Check if student has marked attendance today
export const hasMarkedAttendanceToday = (studentId: string) => {
  const record = attendanceRecords.find(
    (r) => r.studentId === studentId
  );

  if (!record) return false;

  const now = new Date().getTime();
  const markedTime = new Date(record.markedAt).getTime();

  const differenceInSeconds = (now - markedTime) / 1000;

  // TEST MODE — reset after 30 seconds
  if (differenceInSeconds > 30) {
    return false;
  }

  return true;
};

// Get today's attendance for all students
export const getTodayAttendance = (): Map<string, AttendanceRecord> => {
  const records = getAttendanceRecords();
  const today = getTodayString();
  const todayRecords = new Map<string, AttendanceRecord>();

  records
    .filter((r) => r.date === today)
    .forEach((r) => {
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

  const startTime = 20 * 60 + 30; // 8:30 PM
  const endTime = 21 * 60 + 30;   // 9:30 PM

  return currentMinutes >= startTime && currentMinutes <= endTime;
};

// Demo mode (always allow)
export const isWithinAttendanceWindowDemo = (): boolean => {
  return true;
};