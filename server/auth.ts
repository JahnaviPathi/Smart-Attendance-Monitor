import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { GraduationCap, School, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const { login, register, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  if (user) return null;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12">
        <h1 className="text-xl font-bold">VIEW(A)</h1>
      </div>

      <div className="flex items-center justify-center p-6 bg-slate-50">
        <Tabs defaultValue="register" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm 
              onLogin={(data) => login.mutate(data)} 
              isPending={login.isPending} 
            />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm 
              onRegister={(data) => register.mutate(data)} 
              isPending={register.isPending} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function RegisterForm({ onRegister, isPending }) {

  const [role, setRole] = useState("student");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    rollNumber: "",
    classSection: "",
    teacherSecretCode: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("FORM DATA BEFORE SEND:", formData);

    const payload = {
      name: formData.name,
      email: formData.username,
      password: formData.password,
      role: role,

      roll_no: formData.rollNumber,
      section: formData.classSection,

      secret_code: formData.teacherSecretCode
    };

    console.log("PAYLOAD SENT TO API:", payload);

    onRegister(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <Input
            placeholder="Email"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          {role === "student" && (
            <>
              <Input
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={(e) =>
                  setFormData({ ...formData, rollNumber: e.target.value })
                }
              />

              <Input
                placeholder="Class / Section"
                value={formData.classSection}
                onChange={(e) =>
                  setFormData({ ...formData, classSection: e.target.value })
                }
              />
            </>
          )}

          {role === "teacher" && (
            <Input
              placeholder="Teacher Secret Code"
              value={formData.teacherSecretCode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  teacherSecretCode: e.target.value,
                })
              }
            />
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin mr-2" />}
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function LoginForm({ onLogin, isPending }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full mt-4">
            {isPending && <Loader2 className="animate-spin mr-2" />}
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
