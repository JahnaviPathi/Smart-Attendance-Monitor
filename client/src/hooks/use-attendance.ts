import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const markAttendanceMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.attendance.mark.path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to mark attendance");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.attendance.history.path],
      });
      toast({
        title: "Attendance marked",
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
