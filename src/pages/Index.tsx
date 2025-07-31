
import { Link } from "react-router-dom";
import { Home, Send, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">SendKILL APP</h1>
          <p className="text-blue-600">מערכת דיווח קילומטר</p>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">מסך הבית</CardTitle>
                  <CardDescription>חזרה לעמוד הראשי</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Link to="/send-km">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-blue-900">שליחת קילומטר</CardTitle>
                    <CardDescription className="text-blue-700">דיווח קילומטר חדש</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/document-registration">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-green-900">רישום תעודה</CardTitle>
                    <CardDescription className="text-green-700">זיהוי תעודת משלוח</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Features Preview */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">תכונות האפליקציה</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border">
              <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">צילום מספר רכב</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border">
              <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">צילום קילומטר</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
