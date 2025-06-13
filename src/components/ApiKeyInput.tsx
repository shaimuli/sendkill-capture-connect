
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange }) => {
  // החלף את הטקסט הזה במפתח OpenAI האמיתי שלך
  const FIXED_API_KEY: string = "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";
  
  const isValidApiKey = FIXED_API_KEY !== "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" && FIXED_API_KEY.startsWith("sk-");

  useEffect(() => {
    if (isValidApiKey) {
      onApiKeyChange(FIXED_API_KEY);
    }
  }, [onApiKeyChange, isValidApiKey]);

  if (!isValidApiKey) {
    return (
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-medium">נדרש להגדיר מפתח OpenAI</p>
              <p className="text-sm">יש להחליף את הערך בקובץ ApiKeyInput.tsx במפתח האמיתי</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default ApiKeyInput;
