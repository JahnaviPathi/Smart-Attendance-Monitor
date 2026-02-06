import { z } from "zod";
import {
  insertUserSchema,
  insertAttendanceSchema,
  users,
  attendanceRecords,
} from "./schema";

/* =========================
   ERROR SCHEMAS
========================= */
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

/* =========================
   API ROUTES
========================= */
export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/register",
      input: insertUserSchema.extend({
        teacherSecretCode: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },

    login: {
      method: "POST" as const,
      path: "/api/login",
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },

    logout: {
      method: "POST" as const,
      path: "/api/logout",
      responses: {
        200: z.void(),
      },
    },

    me: {
      method: "GET" as const,
      path: "/api/user",
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },

  attendance: {
    mark: {
      method: "POST" as const,
      path: "/api/attendance/mark",
      input: insertAttendanceSchema,
      responses: {
        201: z.custom<typeof attendanceRecords.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },

    history: {
      method: "GET" as const,
      path: "/api/attendance/history",
      responses: {
        200: z.array(z.custom<typeof attendanceRecords.$inferSelect>()),
      },
    },
  },

  teacher: {
    stats: {
      method: "GET" as const,
      path: "/api/teacher/stats",
      responses: {
        200: z.object({
          totalStudents: z.number(),
          averageStress: z.number(),
          attendanceToday: z.number(),
        }),
      },
    },

    students: {
      method: "GET" as const,
      path: "/api/teacher/students",
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },

    studentHistory: {
      method: "GET" as const,
      path: "/api/teacher/students/:id/history",
      responses: {
        200: z.array(z.custom<typeof attendanceRecords.$inferSelect>()),
      },
    },
  },
};

/* =========================
   URL BUILDER
========================= */
export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, String(value));
    }
  }

  return url;
}
