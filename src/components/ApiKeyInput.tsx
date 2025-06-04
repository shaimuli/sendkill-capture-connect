
import React, { useEffect } from "react";

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange }) => {
  // API Key קבוע - החלף את המפתח הזה במפתח שלך
  const FIXED_API_KEY = "sk-YOUR_OPENAI_API_KEY_HERE";

  useEffect(() => {
    // שלח את המפתח הקבוע לקומפוננטה הראשית
    onApiKeyChange(FIXED_API_KEY);
  }, [onApiKeyChange]);

  // הקומפוננטה לא מציגה כלום כיוון שהמפתח קבוע
  return null;
};

export default ApiKeyInput;
