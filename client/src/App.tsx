import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/AuthPage";
import StudentDashboard from "@/pages/StudentDashboard";
import StudentHistory from "@/pages/StudentHistory";
import TeacherDashboard from "@/pages/TeacherDashboard";
import TeacherStudents from "@/pages/TeacherStudents";
import StudentDetail from "@/pages/StudentDetail";
import { ProtectedRoute } from "@/components/ProtectedRoute";


function DashboardRouter({ user }: { user: any }) {
  return user.role === "teacher"
    ? <TeacherDashboard />
    : <StudentDashboard />;
}


function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      {/* Student Routes */}
<Route path="/dashboard">
  {() => (
    <ProtectedRoute
      component={DashboardRouter}
      allowedRoles={["student", "teacher"]}
    />
  )}
</Route>

      <Route path="/history">
        {() => <ProtectedRoute component={StudentHistory} allowedRoles={['student']} />}
      </Route>

      {/* Teacher Routes - Note: Teacher dashboard also uses /dashboard technically but we might redirect */}
      <Route path="/teacher">
         {() => <ProtectedRoute component={TeacherDashboard} allowedRoles={['teacher']} />}
      </Route>
      <Route path="/students">
         {() => <ProtectedRoute component={TeacherStudents} allowedRoles={['teacher']} />}
      </Route>
      <Route path="/students/:id">
         {() => <ProtectedRoute component={StudentDetail} allowedRoles={['teacher']} />}
      </Route>

      {/* Root redirect logic needs to be inside a component or handle via ProtectedRoute wrapper that checks role */}
      <Route path="/">
         {() => <Redirect to="/auth" />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
