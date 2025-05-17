
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/apiService";
import { toast } from "@/components/ui/sonner";
import { Loader } from "lucide-react";
import DirectoryInput from "./DirectoryInput";

const TrainingSection = () => {
  const [selectedFolder, setSelectedFolder] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFolderSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      setSelectedFolder(files);
      toast.info(`${files.length} items selected`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFolder || selectedFolder.length === 0) {
      toast.error("Please select training folders first");
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      // Convert FileList to an array and append each file
      Array.from(selectedFolder).forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      
      await apiService.trainModel(formData);
    } catch (error) {
      console.error("Training error:", error);
      toast.error("Failed to process training data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Training</CardTitle>
        <CardDescription>
          Upload folders containing face images to train the model
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DirectoryInput
            onChange={handleFolderSelect}
            className="border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:border-primary transition-colors"
          >
            <div className="text-muted-foreground">
              <p className="mb-2">Click to select folders</p>
              <p className="text-sm">Each folder should contain images of one person</p>
            </div>
            {selectedFolder && (
              <div className="mt-4 text-primary">
                {selectedFolder.length} items selected
              </div>
            )}
          </DirectoryInput>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={!selectedFolder || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Training in Progress...
            </>
          ) : (
            "Train Model"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrainingSection;
