
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusPanel from "@/components/StatusPanel";
import TrainingSection from "@/components/TrainingSection";
import RecognitionSection from "@/components/RecognitionSection";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("training");

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Face Recognition System</h1>
        <p className="text-muted-foreground">Powered by Facenet</p>
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
