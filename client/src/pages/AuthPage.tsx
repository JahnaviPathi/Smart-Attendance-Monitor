import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { GraduationCap, School } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const { login, register, user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in using useEffect
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  if (user) return null;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-serif font-bold">VIEW(A)</h1>
          </div>
        </div>

        <div className="z-10 max-w-lg">
          <h2 className="text-4xl font-serif font-bold mb-6 leading-tight">
            Smart Attendance & <br/> <span className="text-blue-400">Student Wellbeing</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            A comprehensive platform connecting attendance tracking with mental health monitoring. 
            Ensuring every student is present, engaged, and supported.
          </p>
        </div>

        <div className="z-10 text-sm text-slate-500">
          © 2026 VIEW(A) System. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Forms */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden mb-8">
            <h1 className="text-2xl font-serif font-bold text-slate-900">VIEW(A)</h1>
            <p className="text-slate-500">Welcome back</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
              <TabsTrigger value="login" className="text-base">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="text-base">Create Account</TabsTrigger>
            </TabsList>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="login">
                <LoginForm onLogin={(data) => login.mutate(data)} isPending={login.isPending} />
              </TabsContent>

              <TabsContent value="register">
                <RegisterForm onRegister={(data) => register.mutate(data)} isPending={register.isPending} />
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onLogin, isPending }: { onLogin: (data: any) => void, isPending: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username / Email</Label>
            <Input 
              id="username" 
              placeholder="student@school.edu"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <Button type="submit" className="w-full h-11 text-base" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RegisterForm({ onRegister, isPending }: { onRegister: (data: any) => void, isPending: boolean }) {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    rollNumber: "",
    classSection: "",
    teacherSecretCode: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({ ...formData, role });
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Select your role to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div 
            className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${role === 'student' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}
            onClick={() => setRole("student")}
          >
            <GraduationCap className={`h-6 w-6 mb-2 ${role === 'student' ? 'text-primary' : 'text-slate-400'}`} />
            <div className="font-semibold text-sm">Student</div>
          </div>
          <div 
            className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${role === 'teacher' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}
            onClick={() => setRole("teacher")}
          >
            <School className={`h-6 w-6 mb-2 ${role === 'teacher' ? 'text-primary' : 'text-slate-400'}`} />
            <div className="font-semibold text-sm">Teacher</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-username">Username</Label>
              <Input 
                id="reg-username" 
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input 
              id="reg-password" 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {role === "student" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roll">Roll Number</Label>
                <Input 
                  id="roll" 
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Class/Section</Label>
                <Input 
                  id="section" 
                  value={formData.classSection}
                  onChange={(e) => setFormData({...formData, classSection: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="secret">Teacher Secret Code</Label>
              <Input 
                id="secret" 
                type="password"
                placeholder="Required for teacher access"
                value={formData.teacherSecretCode}
                onChange={(e) => setFormData({...formData, teacherSecretCode: e.target.value})}
              />
            </div>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isPending}>
             {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { Loader2 } from "lucide-react";
