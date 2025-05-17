
import { toast } from "@/components/ui/sonner";

// Make API URL configurable - default to localhost for local development
const DEFAULT_API_URL = 'http://localhost:5000/api';
const getApiUrl = () => {
  // This allows us to configure the API URL from the UI
  return localStorage.getItem('api_url') || DEFAULT_API_URL;
};

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
      const apiUrl = getApiUrl();
      const [trainStatus, recognitionStatus] = await Promise.all([
        fetch(`${apiUrl}/status`).then(res => res.json()),
        fetch(`${apiUrl}/recognize/status`).then(res => res.json())
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
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/train-folder`, {
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
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/recognize/start`, {
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
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/recognize/stop`, {
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

  // New function to update the API URL
  setApiUrl(url: string): void {
    if (url && url.trim() !== '') {
      localStorage.setItem('api_url', url.trim());
      toast.success(`API URL updated to: ${url}`);
    }
  }

  // Get the current API URL
  getApiUrl(): string {
    return getApiUrl();
  }
}

export const apiService = new ApiService();
