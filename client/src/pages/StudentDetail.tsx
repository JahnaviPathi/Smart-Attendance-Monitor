import { Sidebar } from "@/components/Sidebar";
import { useStudentHistory } from "@/hooks/use-teacher";
import { useRoute } from "wouter";
import { StressChart } from "@/components/StressChart";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function StudentDetail() {
  const [match, params] = useRoute("/students/:id");
  const studentId = match ? parseInt(params.id) : undefined;
  
  const { data: history, isLoading } = useStudentHistory(studentId);

  // We assume the student details (name etc) might come from a separate call or passed in, 
  // but for now we'll focus on the stats visualization which is the core requirement.
  
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <Link href="/students" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Students
        </Link>

        {isLoading ? (
           <div className="flex justify-center py-20">
             <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
           </div>
        ) : (
          <div className="space-y-8">
            <header>
              <h1 className="text-3xl font-serif font-bold text-slate-900">Student Report</h1>
              <p className="text-slate-500">Comprehensive view of attendance and stress levels.</p>
            </header>

            <div className="bg-white p-6 rounded-xl border border-border/50 shadow-sm">
               <StressChart data={history?.map(h => ({ date: h.timestamp!, score: h.finalStressScore || 0 })) || []} height={400} />
            </div>

            <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="font-semibold text-slate-900">Attendance Log</h3>
               </div>
               <table className="w-full text-sm text-left">
                <thead className="text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Stress Score</th>
                    <th className="px-6 py-3">Mood (Self-Reported)</th>
                    <th className="px-6 py-3">Expression (AI)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history?.map((record) => {
                     const mood = (record.questionnaireResponse as any)?.mood || '-';
                     const expression = (record.faceAnalysisData as any)?.expression || 'neutral';
                     
                     return (
                      <tr key={record.id}>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {record.timestamp ? format(new Date(record.timestamp), "PPP p") : "-"}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                             (record.finalStressScore || 0) > 70 ? 'bg-red-500' : 'bg-green-500'
                           }`}></span>
                           {record.finalStressScore}%
                        </td>
                        <td className="px-6 py-4 capitalize">{mood}</td>
                        <td className="px-6 py-4 capitalize text-slate-500">{expression}</td>
                      </tr>
                     );
                  })}
                  {history?.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400">No records available.</td></tr>
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
