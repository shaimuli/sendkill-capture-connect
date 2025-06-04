
import React, { useEffect } from "react";

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange }) => {
  // API Key קבוע - החלף את המפתח הזה במפתח שלך
  const FIXED_API_KEY = "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";

  useEffect(() => {
    // שלח את המפתח הקבוע לקומפוננטה הראשית
    onApiKeyChange(FIXED_API_KEY);
  }, [onApiKeyChange]);

  // הקומפוננטה לא מציגה כלום כיוון שהמפתח קבוע
  return null;
};

export default ApiKeyInput;
