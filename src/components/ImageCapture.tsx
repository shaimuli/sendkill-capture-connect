
import React, { useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ImageCaptureProps {
  onImageCapture: (imageBase64: string) => void;
  label: string;
  isProcessing?: boolean;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ 
  onImageCapture, 
  label, 
  isProcessing = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageBase64 = e.target?.result as string;
          onImageCapture(imageBase64);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "שגיאה",
          description: "יש לבחור קובץ תמונה בלבד",
          variant: "destructive",
        });
      }
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCameraClick}
          disabled={isProcessing}
          className="h-20 flex-col space-y-2"
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Camera className="h-6 w-6" />
          )}
          <span className="text-xs">{isProcessing ? "מעבד..." : "צלם"}</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={handleCameraClick}
          disabled={isProcessing}
          className="h-20 flex-col space-y-2"
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
          <span className="text-xs">{isProcessing ? "מעבד..." : "העלה"}</span>
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 text-center">{label}</p>
    </div>
  );
};

export default ImageCapture;
