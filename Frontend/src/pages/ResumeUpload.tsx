
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileText, Check, AlertCircle } from "lucide-react";
import { uploadResume } from "../../lib/api";
import { useToast } from "@/components/ui/use-toast";

const ResumeUpload = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [goal, setGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload your resume",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await uploadResume({
        pdf_file: file,
        goal: goal,
      });
      
      toast({
        title: "Resume uploaded successfully",
        description: "Your course recommendations are ready!",
      });
      
      navigate("/recommendations", { state: { recommendations: response.prediction } });
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your resume.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Resume Analysis</h1>
        <p className="text-lg text-gray-600 mt-2">
          Upload your resume to get course recommendations based on your experience
        </p>
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>Upload your resume in PDF format along with your career goal</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goal">Career Goal</Label>
              <Textarea
                id="goal"
                placeholder="Describe your career goal or what you want to learn"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume">Resume (PDF)</Label>
              <div
                className={`border-2 border-dashed rounded-md p-6 transition-colors ${
                  dragActive ? "border-brand-500 bg-brand-50" : "border-gray-300"
                } ${file ? "bg-green-50 border-green-300" : ""}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => setFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center">
                        <UploadCloud className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm font-medium text-gray-900">
                          Drag and drop your resume here
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          or click to browse files (PDF only)
                        </p>
                      </div>
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => document.getElementById("resume")?.click()}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Browse Files
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                <span>Maximum file size: 5MB. Only PDF files are accepted.</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !file || !goal}>
              {isSubmitting ? "Processing..." : "Upload and Get Recommendations"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResumeUpload;
