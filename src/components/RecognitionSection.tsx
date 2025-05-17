
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiService } from "@/services/apiService";
import { toast } from "@/components/ui/sonner";
import { Loader } from "lucide-react";

const RecognitionSection = () => {
  const [cameraType, setCameraType] = useState<"webcam" | "ip">("webcam");
  const [ipCameraUrl, setIpCameraUrl] = useState<string>("");
  const [cameraIndex, setCameraIndex] = useState<string>("0");
  const [cameraLocation, setCameraLocation] = useState<string>("lobby");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartRecognition = async () => {
    setIsLoading(true);
    
    try {
      const camera_id = cameraType === "webcam" ? cameraIndex : ipCameraUrl;
      
      if (cameraType === "ip" && !ipCameraUrl) {
        toast.error("Please enter an IP camera URL");
        return;
      }
      
      const success = await apiService.startRecognition({
        camera_id,
        cam_no: parseInt(cameraIndex || "0", 10),
        cam_location: cameraLocation || "unknown"
      });
      
      if (success) {
        setIsRunning(true);
      }
    } catch (error) {
      console.error("Failed to start recognition:", error);
      toast.error("Failed to start recognition");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopRecognition = async () => {
    setIsLoading(true);
    
    try {
      const success = await apiService.stopRecognition();
      
      if (success) {
        setIsRunning(false);
      }
    } catch (error) {
      console.error("Failed to stop recognition:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Face Recognition</CardTitle>
        <CardDescription>
          Configure camera settings and start face recognition
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="camera-type">Camera Type</Label>
          <Select
            value={cameraType}
            onValueChange={(value: "webcam" | "ip") => setCameraType(value)}
          >
            <SelectTrigger id="camera-type">
              <SelectValue placeholder="Select camera type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webcam">Webcam</SelectItem>
              <SelectItem value="ip">IP Camera</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {cameraType === "ip" && (
          <div className="space-y-2">
            <Label htmlFor="ip-camera-url">IP Camera URL</Label>
            <Input
              id="ip-camera-url"
              type="text"
              placeholder="http://192.168.1.101:8080/video"
              value={ipCameraUrl}
              onChange={(e) => setIpCameraUrl(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="camera-index">Camera Index</Label>
          <Input
            id="camera-index"
            type="number"
            min="0"
            placeholder="0"
            value={cameraIndex}
            onChange={(e) => setCameraIndex(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="camera-location">Camera Location</Label>
          <Input
            id="camera-location"
            type="text"
            placeholder="library, cafeteria, etc."
            value={cameraLocation}
            onChange={(e) => setCameraLocation(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        {!isRunning ? (
          <Button
            onClick={handleStartRecognition}
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              "Start Recognition"
            )}
          </Button>
        ) : (
          <Button
            onClick={handleStopRecognition}
            disabled={isLoading}
            variant="destructive"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Stopping...
              </>
            ) : (
              "Stop Recognition"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecognitionSection;
