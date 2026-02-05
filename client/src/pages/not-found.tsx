import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md mx-4 shadow-xl border-none">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">Page Not Found</h1>
          <p className="text-slate-500">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button className="w-full">Return Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
