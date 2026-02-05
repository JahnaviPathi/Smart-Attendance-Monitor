import { z } from "zod";

export const api = {
  attendance: {
    mark: {
      path: "/api/attendance/mark",
      input: z.object({
        imageUrl: z.string().optional(),
        questionnaire: z.object({
          understanding: z.number().min(1).max(5),
          sleepiness: z.number().min(1).max(5),
          stress: z.number().min(1).max(5),
          mood: z.string(),
        }),
      }),
      responses: {
        201: z.any(),
      },
    },

    history: {
      path: "/api/attendance/history",
      responses: {
        200: z.array(z.any()),
      },
    },
  },

  teacher: {
    stats: {
      path: "/api/teacher/stats",
    },
    students: {
      path: "/api/teacher/students",
    },
    studentHistory: {
      path: "/api/teacher/students/:id",
    },
  },
};
