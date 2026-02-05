import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type MarkAttendanceInput = z.infer<typeof api.attendance.mark.input>;

export function useAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const markAttendance = useMutation({
    mutationFn: async (data: MarkAttendanceInput) => {
      const res = await fetch(`/api${api.attendance.mark.path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.attendance.history.path],
      });
      toast({ title: "Attendance marked" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const history = useQuery({
    queryKey: [api.attendance.history.path],
    queryFn: async () => {
      const res = await fetch(`/api${api.attendance.history.path}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load history");
      return res.json();
    },
  });

  return {
    markAttendance,
    history: history.data,
  };
}
