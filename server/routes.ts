import type { Express } from "express";
import type { Server } from "http";
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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  /* =========================
     ATTENDANCE
  ========================= */

  app.post(api.attendance.mark.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user!.role !== "student") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const attendanceInput = z.object({
        imageUrl: z.string().min(1),
        questionnaire: z.object({
          understanding: z.number().min(1).max(5),
          sleepiness: z.number().min(1).max(5),
          stress: z.number().min(1).max(5),
          mood: z.string(),
        }),
      });

      const { imageUrl, questionnaire } =
        attendanceInput.parse(req.body);

      // ---- MOCK AI ----
      const expressions = ["neutral", "happy", "stressed", "tired"];
      const detectedExpression =
        expressions[Math.floor(Math.random() * expressions.length)];

      let faceStressScore = 30;
      if (detectedExpression === "stressed") faceStressScore = 80;
      if (detectedExpression === "tired") faceStressScore = 70;
      if (detectedExpression === "happy") faceStressScore = 10;

      const qScore =
        ((6 - questionnaire.understanding) * 20 +
          questionnaire.sleepiness * 20 +
          questionnaire.stress * 20) /
        3;

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
        return res.status(400).json({ message: "Validation error" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.attendance.history.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user!.role !== "student") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const records = await storage.getAttendanceByStudent(req.user!.id);
    res.json(records);
  });

  /* =========================
     TEACHER
  ========================= */

  app.get(api.teacher.stats.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user!.role !== "teacher") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const students = await storage.getAllStudents();
    const records = await storage.getAllAttendance();

    const today = new Date().toISOString().split("T")[0];
    const todayRecords = records.filter(
      (r) => r.timestamp?.toISOString().split("T")[0] === today
    );

    const totalStress = records.reduce(
      (sum, r) => sum + (r.finalStressScore || 0),
      0
    );

    res.json({
      totalStudents: students.length,
      averageStress:
        records.length > 0
          ? Math.round(totalStress / records.length)
          : 0,
      attendanceToday: todayRecords.length,
    });
  });

  app.get(api.teacher.students.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user!.role !== "teacher") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { classSection } = req.query;

    const students = classSection
      ? await storage.getStudentsByClass(String(classSection))
      : await storage.getAllStudents();

    res.json(students);
  });

  app.get(api.teacher.studentHistory.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user!.role !== "teacher") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const studentId = Number(req.params.id);
    const records = await storage.getAttendanceByStudent(studentId);
    res.json(records);
  });

  /* =========================
     SEED (DEV ONLY)
  ========================= */

  if (process.env.NODE_ENV !== "production") {
    const existingStudents = await storage.getAllStudents();
    if (existingStudents.length === 0) {
      const hashedPassword = await hashPassword("password123");

      await storage.createUser({
        username: "teacher@school.com",
        password: hashedPassword,
        role: "teacher",
        name: "Ms. Johnson",
        rollNumber: null,
        classSection: null,
      });

      await storage.createUser({
        username: "student@school.com",
        password: hashedPassword,
        role: "student",
        name: "John Doe",
        rollNumber: "ROLL001",
        classSection: "10-A",
      });
    }
  }

  return httpServer;
}
