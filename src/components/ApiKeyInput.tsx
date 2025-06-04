
import React, { useState, useEffect } from "react";
import { Settings, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
    } else {
      // If no API key is saved, show the input expanded
      setIsExpanded(true);
    }
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      onApiKeyChange(apiKey.trim());
      toast({
        title: "API Key נשמר",
        description: "המפתח נשמר בהצלחה במכשיר",
      });
      setIsExpanded(false);
    }
  };

  const handleDeleteApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey("");
    onApiKeyChange("");
    toast({
      title: "API Key נמחק",
      description: "המפתח נמחק מהמכשיר",
    });
    setIsExpanded(true);
  };

  if (!isExpanded && apiKey) {
    return (
      <div className="mb-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center">
          <Settings className="h-4 w-4 mr-2 text-green-600" />
          <span className="text-sm text-green-700">API Key מוגדר</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="text-xs"
          >
            ערוך
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteApiKey}
            className="text-xs text-red-600 hover:text-red-700"
          >
            מחק
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          הגדרות OpenAI API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="apiKey" className="text-xs">
            מפתח API של OpenAI (נשמר רק במכשיר שלך)
          </Label>
          <div className="flex space-x-2 mt-1">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="text-sm pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleSaveApiKey}
            size="sm"
            className="text-xs"
            disabled={!apiKey.trim()}
          >
            שמור
          </Button>
          {apiKey && (
            <Button
              variant="outline"
              onClick={() => setIsExpanded(false)}
              size="sm"
              className="text-xs"
            >
              ביטול
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
