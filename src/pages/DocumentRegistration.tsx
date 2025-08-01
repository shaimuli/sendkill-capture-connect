import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import ImageCapture from "@/components/ImageCapture";
import ApiKeyInput from "@/components/ApiKeyInput";
import { extractTextFromImage } from "@/services/openai";

interface DocumentData {
  deliveryDate: string;
}

const DocumentRegistration = () => {
  const [apiKey, setApiKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData>({
    deliveryDate: ""
  });

  const handleImageCapture = async (imageBase64: string) => {
    if (!apiKey) {
      toast({
        title: "שגיאה",
        description: "יש להגדיר מפתח OpenAI API קודם",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const extractedText = await extractTextFromImage(imageBase64, 'kilometer', apiKey);
      
      // Parse the extracted text and get delivery date only
      const prompt = `
        בהתבסס על הטקסט הבא מתעודת משלוח, חלץ את תאריך האספקה והחזר בפורמט JSON:
        {
          "deliveryDate": ""
        }
        
        טקסט: ${extractedText}
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process document');
      }

      const data = await response.json();
      const result = data.choices[0]?.message?.content?.trim() || '';
      
      try {
        const parsedData = JSON.parse(result);
        setDocumentData(prev => ({
          ...prev,
          ...parsedData
        }));
        
        toast({
          title: "הצלחה",
          description: "התעודה זוהתה בהצלחה",
        });
      } catch (parseError) {
        toast({
          title: "שגיאה",
          description: "לא ניתן לפרסר את הנתונים מהתעודה",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לעבד את התעודה. נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: keyof DocumentData, value: string) => {
    setDocumentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    toast({
      title: "הצלחה",
      description: "התעודה נרשמה בהצלחה",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              חזרה
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-green-900">רישום תעודה</h1>
            <p className="text-green-600">זיהוי תעודת משלוח</p>
          </div>
        </div>

        {/* API Key Input */}
        <ApiKeyInput onApiKeyChange={setApiKey} />

        {/* Image Capture */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">צילום תעודת משלוח</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageCapture
              onImageCapture={handleImageCapture}
              label="צלם או העלה תעודת משלוח"
              isProcessing={isProcessing}
            />
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">פרטי התעודה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deliveryDate">תאריך אספקה</Label>
              <Input
                id="deliveryDate"
                value={documentData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
              />
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              רשום תעודה
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentRegistration;