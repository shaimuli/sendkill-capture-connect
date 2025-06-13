
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isKeySet, setIsKeySet] = useState(false);

  const handleApiKeySubmit = () => {
    if (apiKey.startsWith("sk-")) {
      onApiKeyChange(apiKey);
      setIsKeySet(true);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (!value) {
      setIsKeySet(false);
      onApiKeyChange("");
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-blue-900">
          <Key className="h-5 w-5 mr-2" />
          מפתח API של OpenAI (נשמר רק במכשיר שלך)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-blue-800">
            מפתח OpenAI API
          </Label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
                disabled={isKeySet}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {!isKeySet ? (
              <Button
                onClick={handleApiKeySubmit}
                disabled={!apiKey.startsWith("sk-")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                הגדר
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsKeySet(false);
                  setApiKey("");
                  onApiKeyChange("");
                }}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                שנה
              </Button>
            )}
          </div>
        </div>
        {isKeySet && (
          <p className="text-sm text-green-700 bg-green-100 p-2 rounded">
            ✓ מפתח API הוגדר בהצלחה
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
