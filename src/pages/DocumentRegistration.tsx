
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

interface DocumentData {
  deliveryDate: string;
  driverName: string;
  supplierName: string;
  deliveryDocumentNumber: string;
  documentDate: string;
  minTemperature: string;
  maxTemperature: string;
}

const DocumentRegistration = () => {
  const [apiKey, setApiKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData>({
    deliveryDate: "",
    driverName: "",
    supplierName: "",
    deliveryDocumentNumber: "",
    documentDate: "",
    minTemperature: "",
    maxTemperature: ""
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
      // Direct API call to extract all document data from image
      const prompt = `
        Extract the following information from this Hebrew delivery document and return ONLY valid JSON in this exact format:
        {
          "deliveryDate": "DD/MM/YYYY",
          "driverName": "driver name",
          "supplierName": "supplier name", 
          "deliveryDocumentNumber": "document number",
          "documentDate": "DD/MM/YYYY",
          "minTemperature": "min temp",
          "maxTemperature": "max temp"
        }
        
        Look for:
        - Supplier name: Find the company name at the top of the document (like "סונול ישראל בע"מ")
        - Driver name: Look for the driver's name (like "יוסי רוטברג"), not other names
        - Delivery document number: Find the document number in the middle-top area of the document (not numbers like 303913968)
        - Delivery date (תאריך אספקה): The delivery date
        - Document date (תאריך תעודת המשלוח): The document creation date
        - Minimum temperature: Find the "טמפ' במילוי" table and extract the LOWEST temperature value
        - Maximum temperature: Find the "טמפ' במילוי" table and extract the HIGHEST temperature value
        
        If any field is not found, use empty string "".
        Return ONLY the JSON, no other text.
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
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageBase64
                  }
                }
              ]
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
        console.log('OpenAI response:', result);
        
        // Clean the result - remove any markdown formatting and fix JSON issues
        let cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Fix potential JSON parsing issues with Hebrew quotes
        cleanResult = cleanResult.replace(/בע"מ/g, 'בע״מ');
        
        console.log('Cleaned result:', cleanResult);
        
        const parsedData = JSON.parse(cleanResult);
        setDocumentData(prev => ({
          ...prev,
          ...parsedData
        }));
        
        toast({
          title: "הצלחה",
          description: "התעודה זוהתה בהצלחה",
        });
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.log('Raw result:', result);
        toast({
          title: "שגיאה",
          description: `לא ניתן לפרסר את הנתונים מהתעודה. התשובה שהתקבלה: ${result}`,
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

            <div>
              <Label htmlFor="driverName">שם נהג</Label>
              <Input
                id="driverName"
                value={documentData.driverName}
                onChange={(e) => handleInputChange('driverName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="supplierName">שם ספק</Label>
              <Input
                id="supplierName"
                value={documentData.supplierName}
                onChange={(e) => handleInputChange('supplierName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="deliveryDocumentNumber">מספר תעודת משלוח</Label>
              <Input
                id="deliveryDocumentNumber"
                value={documentData.deliveryDocumentNumber}
                onChange={(e) => handleInputChange('deliveryDocumentNumber', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="documentDate">תאריך תעודת המשלוח</Label>
              <Input
                id="documentDate"
                value={documentData.documentDate}
                onChange={(e) => handleInputChange('documentDate', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minTemperature">טמפ׳ מינ׳</Label>
                <Input
                  id="minTemperature"
                  value={documentData.minTemperature}
                  onChange={(e) => handleInputChange('minTemperature', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="maxTemperature">טמפ׳ מקס׳</Label>
                <Input
                  id="maxTemperature"
                  value={documentData.maxTemperature}
                  onChange={(e) => handleInputChange('maxTemperature', e.target.value)}
                />
              </div>
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
