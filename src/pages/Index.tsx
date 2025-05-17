
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, AlertCircle } from "lucide-react";
import StatusPanel from "@/components/StatusPanel";
import TrainingSection from "@/components/TrainingSection";
import RecognitionSection from "@/components/RecognitionSection";
import { apiService } from "@/services/apiService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("training");
  const [apiUrl, setApiUrl] = useState<string>(apiService.getApiUrl());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleApiUrlChange = () => {
    apiService.setApiUrl(apiUrl);
    setIsSettingsOpen(false);
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="text-center mb-10 relative">
        <h1 className="text-3xl font-bold mb-2">Face Recognition System</h1>
        <p className="text-muted-foreground">Powered by Facenet</p>
        
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-0 top-0"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>API Settings</DialogTitle>
              <DialogDescription>
                Configure the connection to your backend server.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  If your Flask server is running locally, use http://localhost:5000/api.
                  For remote servers, use the full URL to the API.
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="api-url" className="text-sm font-medium">
                    API Base URL
                  </label>
                  <Input
                    id="api-url"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://localhost:5000/api"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleApiUrlChange}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <StatusPanel />
        </div>
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="recognition">Recognition</TabsTrigger>
            </TabsList>
            <TabsContent value="training">
              <TrainingSection />
            </TabsContent>
            <TabsContent value="recognition">
              <RecognitionSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <footer className="text-center text-sm text-muted-foreground mt-12">
        <p>Face Recognition System Interface · Powered by Facenet</p>
      </footer>
    </div>
  );
};

export default Index;
