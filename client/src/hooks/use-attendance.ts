import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

type MarkAttendanceInput = typeof api.attendance.mark.input._type;

export function useAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const markAttendanceMutation = useMutation({
    mutationFn: async (data: MarkAttendanceInput) => {
      const validated = api.attendance.mark.input.parse(data);

      const res = await fetch(api.attendance.mark.path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Attendance failed");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.attendance.history.path],
      });
      toast({
        title: "Attendance Marked",
        description: "Check-in successful",
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

  const historyQuery = useQuery({
    queryKey: [api.attendance.history.path],
    queryFn: async () => {
      const res = await fetch(api.attendance.history.path, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load history");
      }

      return res.json();
    },
  });

  return {
    markAttendance: markAttendanceMutation,
    history: historyQuery.data,
    isLoadingHistory: historyQuery.isLoading,
  };
}
