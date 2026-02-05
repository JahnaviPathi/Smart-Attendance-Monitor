import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // Email
  password: text("password").notNull(),
  role: text("role").notNull(), // 'student' | 'teacher'
  name: text("name").notNull(),
  
  // Student specific
  rollNumber: text("roll_number"), // Unique for students
  classSection: text("class_section"),
  
  // Teacher specific
  // No specific fields stored, just role
});

export const attendanceRecords = pgTable("attendance_records", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").notNull(), // 'present'
  imageUrl: text("image_url"),
  
  // Stress Analysis
  faceStressScore: integer("face_stress_score"), // 0-100
  questionnaireStressScore: integer("questionnaire_stress_score"), // 0-100
  finalStressScore: integer("final_stress_score"), // 0-100
  
  // Data
  questionnaireResponse: jsonb("questionnaire_response"), // { sleepiness: 1-5, mood: 'happy', ... }
  faceAnalysisData: jsonb("face_analysis_data"), // { expression: 'neutral', ... }
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertAttendanceSchema = z.object({
  imageUrl: z.string().optional(),

  questionnaireResponse: z.object({
    understanding: z.number().min(1).max(5),
    sleepiness: z.number().min(1).max(5),
    stress: z.number().min(1).max(5),
    mood: z.string(),
  }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type CreateUserRequest = InsertUser & { teacherSecretCode?: string };
