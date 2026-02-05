import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import cors from "cors";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  // ✅ CORS FIRST (before session)
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // ✅ SESSION
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super_secret_session_key",
      resave: false,
      saveUninitialized: false,
      store: new session.MemoryStore(),
      cookie: {
        httpOnly: true,
        secure: app.get("env") === "production",
        sameSite: app.get("env") === "production" ? "none" : "lax",
      },
    })
  );

  // ✅ PASSPORT
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user || false);
  });

  // ===== ROUTES =====

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, role, name, rollNumber, classSection, teacherSecretCode } = req.body;

      if (await storage.getUserByUsername(username)) {
        return res.status(400).json({ message: "User already exists" });
      }

      if (role === "teacher" && teacherSecretCode !== "teach123") {
        return res.status(403).json({ message: "Invalid teacher code" });
      }

      const hashedPassword = await hashPassword(password);

      const user = await storage.createUser({
        username,
        password: hashedPassword,
        role,
        name,
        rollNumber: role === "student" ? rollNumber : null,
        classSection: role === "student" ? classSection : null,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    res.json(req.user);
  });
}
