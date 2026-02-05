import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useTeacherStats() {
  return useQuery({
    queryKey: [api.teacher.stats.path],
    queryFn: async () => {
      const res = await fetch(api.teacher.stats.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.teacher.stats.responses[200].parse(await res.json());
    },
  });
}

export function useTeacherStudents() {
  return useQuery({
    queryKey: [api.teacher.students.path],
    queryFn: async () => {
      const res = await fetch(api.teacher.students.path);
      if (!res.ok) throw new Error("Failed to fetch students");
      return api.teacher.students.responses[200].parse(await res.json());
    },
  });
}

export function useStudentHistory(studentId: number | undefined) {
  return useQuery({
    queryKey: [api.teacher.studentHistory.path, studentId],
    enabled: !!studentId,
    queryFn: async () => {
      if (!studentId) throw new Error("Student ID required");
      const url = buildUrl(api.teacher.studentHistory.path, { id: studentId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch student history");
      return api.teacher.studentHistory.responses[200].parse(await res.json());
    },
  });
}
