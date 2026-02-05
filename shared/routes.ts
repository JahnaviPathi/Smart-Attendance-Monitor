import { z } from 'zod';
import { insertUserSchema, insertAttendanceSchema, users, attendanceRecords } from './schema';

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

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema.extend({ teacherSecretCode: z.string().optional() }),
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  attendance: {
    mark: {
      method: 'POST' as const,
      path: '/api/attendance',
      input: z.object({
        imageUrl: z.string(),
        questionnaire: z.object({
          understanding: z.number().min(1).max(5),
          sleepiness: z.number().min(1).max(5),
          stress: z.number().min(1).max(5),
          mood: z.string(),
        }),
      }),
      responses: {
        201: z.custom<typeof attendanceRecords.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/attendance/history',
      responses: {
        200: z.array(z.custom<typeof attendanceRecords.$inferSelect>()),
      },
    },
  },
  teacher: {
    stats: {
      method: 'GET' as const,
      path: '/api/teacher/stats',
      responses: {
        200: z.object({
          totalStudents: z.number(),
          averageStress: z.number(),
          attendanceToday: z.number(),
        }),
      },
    },
    students: {
      method: 'GET' as const,
      path: '/api/teacher/students',
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    studentHistory: {
      method: 'GET' as const,
      path: '/api/teacher/students/:id/history',
      responses: {
        200: z.array(z.custom<typeof attendanceRecords.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
