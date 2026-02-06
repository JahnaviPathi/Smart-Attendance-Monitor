import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type MarkAttendanceInput = z.infer<typeof api.attendance.mark.input>;

export function useAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ===============================
  // MARK ATTENDANCE
  // ===============================
  const markAttendance = useMutation({
    mutationFn: async (data: MarkAttendanceInput) => {
      const validated = api.attendance.mark.input.parse(data);

      const res = await fetch(`/api${api.attendance.mark.path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔴 REQUIRED for passport session
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to mark attendance");
      }

      return api.attendance.mark.responses[201].parse(await res.json());
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.attendance.history.path],
      });

      toast({
        title: "Attendance Marked",
        description: "Your presence and wellbeing have been recorded.",
      });
    },

    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ===============================
  // ATTENDANCE HISTORY
  // ===============================
  const historyQuery = useQuery({
    queryKey: [api.attendance.history.path],
    queryFn: async () => {
      const res = await fetch(`/api${api.attendance.history.path}`, {
        credentials: "include", // 🔴 REQUIRED
      });

      if (!res.ok) {
        throw new Error("Failed to fetch attendance history");
      }

      return api.attendance.history.responses[200].parse(await res.json());
    },
  });

  return {
    markAttendance,
    history: historyQuery.data,
    isLoadingHistory: historyQuery.isLoading,
  };
}
