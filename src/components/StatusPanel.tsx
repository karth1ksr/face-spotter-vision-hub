
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService, StatusResponse } from "@/services/apiService";
import { Check, X, Loader } from "lucide-react";

const StatusPanel = () => {
  const [status, setStatus] = useState<StatusResponse>({
    trained: false,
    recognitionRunning: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const currentStatus = await apiService.checkStatus();
      setStatus(currentStatus);
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Poll status every 5 seconds
    const intervalId = setInterval(fetchStatus, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const StatusIndicator = ({ active }: { active: boolean }) => (
    <div className="flex items-center">
      {active ? (
        <Check className="h-5 w-5 mr-2 text-green-500" />
      ) : (
        <X className="h-5 w-5 mr-2 text-red-500" />
      )}
      <span className={active ? "text-green-400" : "text-red-400"}>
        {active ? "Active" : "Inactive"}
      </span>
    </div>
  );

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          System Status
          {isLoading && <Loader className="h-4 w-4 ml-2 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Model Trained:</span>
          <StatusIndicator active={status.trained} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Recognition Running:</span>
          <StatusIndicator active={status.recognitionRunning} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusPanel;
