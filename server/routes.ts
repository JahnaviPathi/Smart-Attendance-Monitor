import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  setupAuth(app);

  // === ATTENDANCE ===
  
  app.post(api.attendance.mark.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "student") {
      return res.status(401).send("Unauthorized");
    }
    
    try {
      const attendanceInput = z.object({
  imageUrl: z.string().optional(),
  questionnaire: z.object({
    understanding: z.number().min(1).max(5),
    sleepiness: z.number().min(1).max(5),
    stress: z.number().min(1).max(5),
    mood: z.string(),
  }),
});

const { imageUrl, questionnaire } =
  attendanceInput.parse(req.body);

      
      // --- MOCK AI ANALYSIS ---
      const expressions = ['neutral', 'happy', 'stressed', 'tired'];
      const detectedExpression = expressions[Math.floor(Math.random() * expressions.length)];
      
      let faceStressScore = 30; // base
      if (detectedExpression === 'stressed') faceStressScore = 80;
      if (detectedExpression === 'tired') faceStressScore = 70;
      if (detectedExpression === 'happy') faceStressScore = 10;
      
      faceStressScore = Math.min(100, Math.max(0, faceStressScore + (Math.random() * 20 - 10)));
      
      const qScore = (
        ((6 - questionnaire.understanding) * 20) + 
        (questionnaire.sleepiness * 20) +
        (questionnaire.stress * 20)
      ) / 3;
      
      const finalScore = Math.round((faceStressScore + qScore) / 2);
      
      const record = await storage.createAttendance({
        studentId: req.user!.id,
        status: "present",
        imageUrl,
        faceStressScore: Math.round(faceStressScore),
        questionnaireStressScore: Math.round(qScore),
        finalStressScore: finalScore,
        questionnaireResponse: questionnaire,
        faceAnalysisData: { expression: detectedExpression },
      });
      
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  app.get(api.attendance.history.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "student") {
      return res.status(401).send("Unauthorized");
    }
    const records = await storage.getAttendanceByStudent(req.user!.id);
    res.json(records);
  });

  // === TEACHER ===
  
  app.get(api.teacher.stats.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "teacher") {
      return res.status(401).send("Unauthorized");
    }
    
    const students = await storage.getAllStudents();
    const records = await storage.getAllAttendance();
    
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.timestamp?.toISOString().split('T')[0] === today);
    
    const totalStress = records.reduce((sum, r) => sum + (r.finalStressScore || 0), 0);
    const avgStress = records.length > 0 ? Math.round(totalStress / records.length) : 0;
    
    res.json({
      totalStudents: students.length,
      averageStress: avgStress,
      attendanceToday: todayRecords.length,
    });
  });
  
  app.get(api.teacher.students.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "teacher") {
      return res.status(401).send("Unauthorized");
    }
    const students = await storage.getAllStudents();
    res.json(students);
  });
  
  app.get(api.teacher.studentHistory.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "teacher") {
      return res.status(401).send("Unauthorized");
    }
    const studentId = parseInt(req.params.id);
    const records = await storage.getAttendanceByStudent(studentId);
    res.json(records);
  });

  // SEED DATA
  if (process.env.NODE_ENV !== 'production') {
    const existingStudents = await storage.getAllStudents();
    if (existingStudents.length === 0) {
      console.log('Seeding database...');
      const hashedPassword = await hashPassword('password123');
      
      // Create Teacher
      await storage.createUser({
        username: 'teacher@school.com',
        password: hashedPassword,
        role: 'teacher',
        name: 'Ms. Johnson',
        rollNumber: null,
        classSection: null,
      });

      // Create Student
      await storage.createUser({
        username: 'student@school.com',
        password: hashedPassword,
        role: 'student',
        name: 'John Doe',
        rollNumber: 'ROLL001',
        classSection: '10-A',
      });
      console.log('Database seeded!');
    }
  }

  return httpServer;
}
