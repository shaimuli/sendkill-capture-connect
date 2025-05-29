
import React from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

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

  const takePicture = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl) {
        onImageCapture(image.dataUrl);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לפתוח את המצלמה",
        variant: "destructive",
      });
    }
  };

  const selectImage = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      if (image.dataUrl) {
        onImageCapture(image.dataUrl);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לבחור תמונה",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={takePicture}
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
          onClick={selectImage}
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
