import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const retake = () => {
    setImage(null);
    onCapture("");
  };

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="relative w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-inner border-2 border-slate-200">
        {image ? (
          <img 
            src={image} 
            alt="Captured" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <Webcam
            audio={false}
            height={720}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={720}
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay grid for face positioning */}
        {!image && (
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border-2 border-dashed border-white rounded-full"></div>
            <div className="w-full h-full flex items-center justify-center">
               <p className="text-white font-medium bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">Position face in circle</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!image ? (
          <Button 
            onClick={capture} 
            size="lg"
            className="rounded-full h-16 w-16 p-0 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Camera className="h-8 w-8" />
          </Button>
        ) : (
          <Button 
            onClick={retake} 
            variant="outline" 
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retake Photo
          </Button>
        )}
      </div>
    </div>
  );
}
