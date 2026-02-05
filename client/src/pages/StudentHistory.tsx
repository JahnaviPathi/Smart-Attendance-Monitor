import { Sidebar } from "@/components/Sidebar";
import { useAttendance } from "@/hooks/use-attendance";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { StressChart } from "@/components/StressChart";

export default function StudentHistory() {
  const { history, isLoadingHistory } = useAttendance();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900">My History</h1>
          <p className="text-slate-500">Track your attendance and wellbeing over time.</p>
        </header>

        {isLoadingHistory ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Chart Section */}
            <div className="w-full">
              <StressChart 
                data={history?.map(h => ({ date: h.timestamp!, score: h.finalStressScore || 0 })) || []} 
              />
            </div>

            {/* List Section */}
            <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Photo</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Stress Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history?.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {record.timestamp ? format(new Date(record.timestamp), "MMM d, yyyy") : "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {record.timestamp ? format(new Date(record.timestamp), "h:mm a") : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {record.imageUrl ? (
                          <img 
                            src={record.imageUrl} 
                            alt="Your capture" 
                            className="h-10 w-14 object-cover rounded border border-slate-200"
                          />
                        ) : (
                          <div className="h-10 w-14 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Present
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                (record.finalStressScore || 0) > 70 ? 'bg-red-500' : 
                                (record.finalStressScore || 0) > 40 ? 'bg-yellow-500' : 'bg-green-500'
                              }`} 
                              style={{ width: `${record.finalStressScore || 0}%` }}
                            />
                          </div>
                          <span className="text-slate-500">{record.finalStressScore}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {history?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                        No attendance records found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
