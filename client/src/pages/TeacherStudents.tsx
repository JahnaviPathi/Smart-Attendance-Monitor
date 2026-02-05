import { Sidebar } from "@/components/Sidebar";
import { useTeacherStudents } from "@/hooks/use-teacher";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function TeacherStudents() {
const { data: students, isLoading } = useTeacherStudents();
const [search, setSearch] = useState("");
const [classSection, setClassSection] = useState("");
const classSections = Array.from(
  new Set(
    (students ?? [])
      .map((s) => s.classSection)
      .filter(Boolean)
  )
);




const filtered = students?.filter((s) => {
  const searchLower = search.toLowerCase();

  const matchesSearch =
    s.name.toLowerCase().includes(searchLower) ||
    s.rollNumber?.toLowerCase().includes(searchLower) ||
    s.classSection?.toLowerCase().includes(searchLower);

  const matchesClass =
    classSection === ""
      ? true
      : s.classSection === classSection;

  return matchesSearch && matchesClass;
});


  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Student Directory</h1>
            <p className="text-slate-500">Manage and view detailed reports for all students.</p>
          </div>
<div className="flex gap-4 items-center">
  {/* Search */}
  <div className="relative w-64">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
    <Input 
      placeholder="Search students..." 
      className="pl-9 bg-white"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  {/* Class / Section Filter */}
  <select
    value={classSection}
    onChange={(e) => setClassSection(e.target.value)}
    className="border rounded-md px-3 py-2 bg-white text-sm"
  >
    <option value="">All Classes</option>

    {classSections.map((cls) => (
      <option key={cls} value={cls}>
        {cls}
      </option>
    ))}
  </select>
</div>

        </header>

        <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4">Class/Section</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered?.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                        {student.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{student.rollNumber || '-'}</td>
                  <td className="px-6 py-4 text-slate-500">{student.classSection || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/students/${student.id}`} className="text-primary hover:underline font-medium">
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
