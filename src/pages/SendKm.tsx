import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Upload, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ImageCapture from "@/components/ImageCapture";
import ApiKeyInput from "@/components/ApiKeyInput";
import { extractTextFromImage } from "@/services/openai";

const SendKm = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [kilometer, setKilometer] = useState("");
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [kilometerImage, setKilometerImage] = useState<string | null>(null);
  const [isProcessingVehicle, setIsProcessingVehicle] = useState(false);
  const [isProcessingKm, setIsProcessingKm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const processImageWithAI = async (imageBase64: string, type: 'vehicle' | 'kilometer') => {
    if (!apiKey) {
      toast({
        title: "שגיאה",
        description: "יש להזין מפתח API של OpenAI תחילה",
        variant: "destructive",
      });
      return;
    }

    try {
      if (type === 'vehicle') {
        setIsProcessingVehicle(true);
        const result = await extractTextFromImage(imageBase64, 'vehicle', apiKey);
        setVehicleNumber(result);
        toast({
          title: "מספר רכב זוהה בהצלחה",
          description: "המספר נוסף לשדה מספר רכב",
        });
      } else {
        setIsProcessingKm(true);
        const result = await extractTextFromImage(imageBase64, 'kilometer', apiKey);
        setKilometer(result);
        toast({
          title: "קילומטר זוהה בהצלחה",
          description: "הקילומטר נוסף לשדה",
        });
      }
    } catch (error) {
      toast({
        title: "שגיאה בזיהוי",
        description: "לא ניתן לזהות את הטקסט בתמונה. נסה שוב.",
        variant: "destructive",
      });
      console.error('Error processing image:', error);
    } finally {
      if (type === 'vehicle') {
        setIsProcessingVehicle(false);
      } else {
        setIsProcessingKm(false);
      }
    }
  };

  const handleVehicleImageCapture = (imageBase64: string) => {
    setVehicleImage(imageBase64);
    processImageWithAI(imageBase64, 'vehicle');
  };

  const handleKilometerImageCapture = (imageBase64: string) => {
    setKilometerImage(imageBase64);
    processImageWithAI(imageBase64, 'kilometer');
  };

  const handleSend = async () => {
    if (!vehicleNumber || !kilometer) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      const apiUrl = `https://oye-oscam.co.il/UpdateMakor/Index?kilometer=${encodeURIComponent(kilometer)}&licenseid=${encodeURIComponent(vehicleNumber)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
      });

      if (response.ok) {
        toast({
          title: "נשלח בהצלחה!",
          description: "הנתונים נשלחו לשרת",
        });
        
        // Reset form
        setVehicleNumber("");
        setKilometer("");
        setVehicleImage(null);
        setKilometerImage(null);
      } else {
        throw new Error('Failed to send data');
      }
    } catch (error) {
      toast({
        title: "שגיאה בשליחה",
        description: "לא ניתן לשלוח את הנתונים. נסה שוב.",
        variant: "destructive",
      });
      console.error('Error sending data:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-3">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-blue-900">שליחת קילומטר</h1>
        </div>

        {/* API Key Input */}
        <ApiKeyInput onApiKeyChange={setApiKey} />

        <div className="space-y-6">
          {/* Vehicle Number Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Camera className="h-5 w-5 mr-2 text-blue-600" />
                מספר רכב
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageCapture
                onImageCapture={handleVehicleImageCapture}
                label="צלם/העלה תמונה של מספר הרכב"
                isProcessing={isProcessingVehicle}
              />
              {vehicleImage && (
                <div className="mt-3">
                  <img
                    src={vehicleImage}
                    alt="Vehicle"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="vehicleNumber">מספר רכב</Label>
                <Input
                  id="vehicleNumber"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="מספר הרכב יזוהה אוטומatically"
                  className="text-right"
                />
              </div>
            </CardContent>
          </Card>

          {/* Kilometer Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Camera className="h-5 w-5 mr-2 text-blue-600" />
                קילומטר
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageCapture
                onImageCapture={handleKilometerImageCapture}
                label="צלם/העלה תמונה של קילומטר הרכב"
                isProcessing={isProcessingKm}
              />
              {kilometerImage && (
                <div className="mt-3">
                  <img
                    src={kilometerImage}
                    alt="Kilometer"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="kilometer">קילומטר</Label>
                <Input
                  id="kilometer"
                  value={kilometer}
                  onChange={(e) => setKilometer(e.target.value)}
                  placeholder="הקילומטר יזוהה אוטומatically"
                  className="text-right"
                />
              </div>
            </CardContent>
          </Card>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!vehicleNumber || !kilometer || isSending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          >
            {isSending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                שולח...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                שלח
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendKm;
