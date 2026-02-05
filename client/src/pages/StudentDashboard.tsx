import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { WebcamCapture } from "@/components/WebcamCapture";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAttendance } from "@/hooks/use-attendance";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Smile, Meh, Frown } from "lucide-react";

export default function StudentDashboard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [image, setImage] = useState<string>("");
  const { markAttendance } = useAttendance();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user?.role === "teacher") {
      setLocation("/teacher");
    }
  }, [user, setLocation]);
  
  const [formData, setFormData] = useState({
    understanding: 3,
    sleepiness: 3,
    stress: 3,
    mood: "neutral"
  });

  const handleCapture = (imgSrc: string) => {
    setImage(imgSrc);
    // Automatically move to next step after brief delay if captured
    if (imgSrc) setTimeout(() => setStep(2), 500);
  };

  const handleSubmit = () => {
    markAttendance.mutate(
      {
        imageUrl: image,
        questionnaire: formData
      },
      {
        onSuccess: () => setStep(3)
      }
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-serif font-bold text-slate-900">Welcome, {user?.name}</h1>
            <p className="text-slate-500 mt-2">Let's mark your attendance and check in on how you're doing.</p>
          </header>

          {/* Progress Stepper */}
          <div className="flex items-center justify-center mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                  ${step >= s ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}
                `}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 bg-slate-200 mx-2 ${step > s ? 'bg-primary' : ''}`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="border-none shadow-lg">
                  <CardHeader className="text-center pb-2">
                    <CardTitle>Attendance Capture</CardTitle>
                    <CardDescription>Position your face clearly in the frame</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <WebcamCapture onCapture={handleCapture} />
                    {image && (
                      <div className="flex justify-center mt-6">
                        <Button onClick={() => setStep(2)}>Next: Wellbeing Check-in</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle>Daily Wellbeing Check-in</CardTitle>
                    <CardDescription>How are you feeling today? This helps us support you better.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Sliders */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label>Understanding Level (Previous Class)</Label>
                          <span className="text-sm font-medium text-slate-500">{formData.understanding}/5</span>
                        </div>
                        <Slider 
                          value={[formData.understanding]} 
                          onValueChange={(val) => setFormData({...formData, understanding: val[0]})} 
                          max={5} min={1} step={1} 
                          className="py-2"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Confused</span>
                          <span>Crystal Clear</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label>Sleepiness Level</Label>
                          <span className="text-sm font-medium text-slate-500">{formData.sleepiness}/5</span>
                        </div>
                        <Slider 
                          value={[formData.sleepiness]} 
                          onValueChange={(val) => setFormData({...formData, sleepiness: val[0]})} 
                          max={5} min={1} step={1} 
                          className="py-2"
                        />
                         <div className="flex justify-between text-xs text-slate-400">
                          <span>Wide Awake</span>
                          <span>Exhausted</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label>Stress Level</Label>
                          <span className="text-sm font-medium text-slate-500">{formData.stress}/5</span>
                        </div>
                        <Slider 
                          value={[formData.stress]} 
                          onValueChange={(val) => setFormData({...formData, stress: val[0]})} 
                          max={5} min={1} step={1} 
                          className="py-2"
                        />
                         <div className="flex justify-between text-xs text-slate-400">
                          <span>Chill</span>
                          <span>Overwhelmed</span>
                        </div>
                      </div>
                    </div>

                    {/* Mood Radio */}
                    <div className="space-y-3">
                      <Label>Current Mood</Label>
                      <RadioGroup 
                        value={formData.mood} 
                        onValueChange={(val) => setFormData({...formData, mood: val})}
                        className="flex gap-4"
                      >
                        {[
                          { val: 'happy', icon: Smile, label: 'Happy' },
                          { val: 'neutral', icon: Meh, label: 'Neutral' },
                          { val: 'sad', icon: Frown, label: 'Sad/Upset' }
                        ].map(({ val, icon: Icon, label }) => (
                          <div key={val} className="flex-1">
                            <RadioGroupItem value={val} id={val} className="peer sr-only" />
                            <Label 
                              htmlFor={val} 
                              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer hover:border-slate-300 transition-all"
                            >
                              <Icon className="h-6 w-6 mb-2 text-slate-500 peer-data-[state=checked]:text-primary" />
                              <span className="text-sm font-medium">{label}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                      <Button onClick={handleSubmit} className="flex-1" disabled={markAttendance.isPending}>
                        {markAttendance.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Check-in
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">You're All Set!</h2>
                <p className="text-slate-500 mb-8">Your attendance has been marked for today.</p>
                <Button onClick={() => window.location.href = '/history'} variant="outline">View My History</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
