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
  reporterName: string;
  driverName: string;
  siteName: string;
  supplierName: string;
  deliveryDate: string;
  unloadingStartTime: string;
  unloadingEndTime: string;
  minTemp: string;
  maxTemp: string;
  totalCount: string;
  deliveryDocumentNumber: string;
  deliveryDocumentDate: string;
  unloadingQuantity: string;
  initialMeasurement: string;
  finalMeasurement: string;
  totalMeasurement: string;
}

const DocumentRegistration = () => {
  const [apiKey, setApiKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentData>({
    reporterName: "",
    driverName: "",
    siteName: "",
    supplierName: "",
    deliveryDate: "",
    unloadingStartTime: "",
    unloadingEndTime: "",
    minTemp: "",
    maxTemp: "",
    totalCount: "",
    deliveryDocumentNumber: "",
    deliveryDocumentDate: "",
    unloadingQuantity: "",
    initialMeasurement: "",
    finalMeasurement: "",
    totalMeasurement: ""
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
      
      // Parse the extracted text and populate fields
      // This is a simplified version - you might want to improve the parsing logic
      const prompt = `
        בהתבסס על הטקסט הבא מתעודת משלוח, חלץ את הערכים הבאים ובמחזיר בפורמט JSON:
        {
          "driverName": "",
          "supplierName": "",
          "deliveryDate": "",
          "minTemp": "",
          "maxTemp": "",
          "totalCount": "",
          "deliveryDocumentNumber": "",
          "deliveryDocumentDate": "",
          "unloadingQuantity": "",
          "initialMeasurement": "",
          "finalMeasurement": "",
          "totalMeasurement": ""
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reporterName">שם מדווח</Label>
                <Input
                  id="reporterName"
                  value={documentData.reporterName}
                  onChange={(e) => handleInputChange('reporterName', e.target.value)}
                  placeholder="להשאיר ריק"
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
                <Label htmlFor="siteName">שם האתר</Label>
                <Input
                  id="siteName"
                  value={documentData.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  placeholder="להשאיר ריק"
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
                <Label htmlFor="deliveryDate">תאריך אספקה</Label>
                <Input
                  id="deliveryDate"
                  value={documentData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="unloadingStartTime">שעת התחלת פריקה</Label>
                <Input
                  id="unloadingStartTime"
                  value={documentData.unloadingStartTime}
                  onChange={(e) => handleInputChange('unloadingStartTime', e.target.value)}
                  placeholder="להשאיר ריק"
                />
              </div>

              <div>
                <Label htmlFor="unloadingEndTime">שעת סיום פריקה</Label>
                <Input
                  id="unloadingEndTime"
                  value={documentData.unloadingEndTime}
                  onChange={(e) => handleInputChange('unloadingEndTime', e.target.value)}
                  placeholder="להשאיר ריק"
                />
              </div>

              <div>
                <Label htmlFor="minTemp">טמפ' מינ'</Label>
                <Input
                  id="minTemp"
                  value={documentData.minTemp}
                  onChange={(e) => handleInputChange('minTemp', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="maxTemp">טמפ' מקס'</Label>
                <Input
                  id="maxTemp"
                  value={documentData.maxTemp}
                  onChange={(e) => handleInputChange('maxTemp', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="totalCount">סה"כ מונה</Label>
                <Input
                  id="totalCount"
                  value={documentData.totalCount}
                  onChange={(e) => handleInputChange('totalCount', e.target.value)}
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
                <Label htmlFor="deliveryDocumentDate">תאריך תעודת המשלוח</Label>
                <Input
                  id="deliveryDocumentDate"
                  value={documentData.deliveryDocumentDate}
                  onChange={(e) => handleInputChange('deliveryDocumentDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="unloadingQuantity">כמות לפריקה(תעודה)</Label>
                <Input
                  id="unloadingQuantity"
                  value={documentData.unloadingQuantity}
                  onChange={(e) => handleInputChange('unloadingQuantity', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="initialMeasurement">כמות לפי מדיד בתחילה</Label>
                <Input
                  id="initialMeasurement"
                  value={documentData.initialMeasurement}
                  onChange={(e) => handleInputChange('initialMeasurement', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="finalMeasurement">כמות לפי מדיד בסיום</Label>
                <Input
                  id="finalMeasurement"
                  value={documentData.finalMeasurement}
                  onChange={(e) => handleInputChange('finalMeasurement', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="totalMeasurement">סה''כ מדיד</Label>
                <Input
                  id="totalMeasurement"
                  value={documentData.totalMeasurement}
                  onChange={(e) => handleInputChange('totalMeasurement', e.target.value)}
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