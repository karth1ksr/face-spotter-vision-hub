
import { toast } from "@/components/ui/sonner";

const API_URL = 'http://localhost:5000/api';

export interface StatusResponse {
  trained: boolean;
  recognitionRunning: boolean;
}

export interface RecognitionParams {
  camera_id: string;
  cam_no: number;
  cam_location: string;
}

class ApiService {
  async checkStatus(): Promise<StatusResponse> {
    try {
      const [trainStatus, recognitionStatus] = await Promise.all([
        fetch(`${API_URL}/status`).then(res => res.json()),
        fetch(`${API_URL}/recognize/status`).then(res => res.json())
      ]);
      
      return {
        trained: trainStatus.trained || false,
        recognitionRunning: recognitionStatus.running || false
      };
    } catch (error) {
      console.error("Failed to check status:", error);
      toast.error("Failed to connect to backend server.");
      return { trained: false, recognitionRunning: false };
    }
  }

  async trainModel(formData: FormData): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/train-folder`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const result = await response.json();
      toast.success("Training initiated successfully");
      return true;
    } catch (error) {
      console.error("Failed to train model:", error);
      toast.error("Failed to train model. Please check backend service.");
      return false;
    }
  }

  async startRecognition(params: RecognitionParams): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/recognize/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      toast.success("Recognition started successfully");
      return true;
    } catch (error) {
      console.error("Failed to start recognition:", error);
      toast.error("Failed to start recognition. Please check backend service.");
      return false;
    }
  }

  async stopRecognition(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/recognize/stop`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      toast.success("Recognition stopped successfully");
      return true;
    } catch (error) {
      console.error("Failed to stop recognition:", error);
      toast.error("Failed to stop recognition. Please check backend service.");
      return false;
    }
  }
}

export const apiService = new ApiService();
