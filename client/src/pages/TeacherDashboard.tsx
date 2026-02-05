import { Sidebar } from "@/components/Sidebar";
import { useTeacherStats, useTeacherStudents } from "@/hooks/use-teacher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, CheckCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function TeacherDashboard() {
  const { data: stats, isLoading: loadingStats } = useTeacherStats();
  const { data: students, isLoading: loadingStudents } = useTeacherStudents();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900">Class Overview</h1>
          <p className="text-slate-500">Monitor class attendance and realtime wellbeing metrics.</p>
        </header>

        {loadingStats ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-none shadow-sm shadow-blue-900/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Students</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalStudents}</div>
                <p className="text-xs text-slate-400 mt-1">Registered in system</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm shadow-blue-900/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Avg. Class Stress</CardTitle>
                <AlertTriangle className={`h-4 w-4 ${(stats?.averageStress || 0) > 50 ? 'text-red-500' : 'text-yellow-500'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.averageStress}%</div>
                <p className="text-xs text-slate-400 mt-1">Based on today's check-ins</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm shadow-blue-900/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Attendance Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.attendanceToday}</div>
                <p className="text-xs text-slate-400 mt-1">Students present</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="bg-white rounded-xl border border-border/50 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Recent Student Activity</h2>
            <Link href="/students" className="text-sm text-primary font-medium hover:underline">View All Students</Link>
          </div>

          {loadingStudents ? (
             <div className="h-32 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students?.slice(0, 6).map((student) => (
                <Link key={student.id} href={`/students/${student.id}`} className="block">
                  <div className="p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 hover:bg-white group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {student.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">Roll: {student.rollNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
