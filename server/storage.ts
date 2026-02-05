import { users, attendanceRecords, type User, type InsertUser, type AttendanceRecord, type InsertAttendance } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student Specific
  getUserByRollNumber(rollNumber: string): Promise<User | undefined>;
  
  // Attendance
  createAttendance(record: InsertAttendance): Promise<AttendanceRecord>;
  getAttendanceByStudent(studentId: number): Promise<AttendanceRecord[]>;
  getAllAttendance(): Promise<AttendanceRecord[]>;
  
  // Teacher
  getAllStudents(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByRollNumber(rollNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.rollNumber, rollNumber));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async createAttendance(record: InsertAttendance): Promise<AttendanceRecord> {
    const [newRecord] = await db.insert(attendanceRecords).values(record).returning();
    return newRecord;
  }
  
  async getAttendanceByStudent(studentId: number): Promise<AttendanceRecord[]> {
    return await db.select()
      .from(attendanceRecords)
      .where(eq(attendanceRecords.studentId, studentId))
      .orderBy(desc(attendanceRecords.timestamp));
  }
  
  async getAllAttendance(): Promise<AttendanceRecord[]> {
    return await db.select()
      .from(attendanceRecords)
      .orderBy(desc(attendanceRecords.timestamp));
  }
  
  async getAllStudents(): Promise<User[]> {
    return await db.select()
      .from(users)
      .where(eq(users.role, "student"));
  }
}

export const storage = new DatabaseStorage();
