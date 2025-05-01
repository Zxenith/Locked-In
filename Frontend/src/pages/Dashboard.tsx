import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, Upload, User, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
    
    // Check if user has completed profile
    if (user?.user_data && user.user_data.career_goal) {
      setHasProfile(true);
    } else {
      // If user is authenticated but hasn't completed profile, show toast suggestion
      if (!isLoading && isAuthenticated && user) {
        toast({
          title: "Complete your profile",
          description: "Fill out your profile to get personalized course recommendations",
        });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user, toast]);

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
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <p className="text-lg text-gray-600 mt-2">
          Get personalized course recommendations tailored to your goals
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-500" />
              <span>Complete Your Profile</span>
            </CardTitle>
            <CardDescription>Fill out your career preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {hasProfile 
                ? "You've already completed your profile. You can update it anytime."
                : "Tell us about your career goals and preferences to get personalized course recommendations."}
            </p>
            <Button 
              variant="default" 
              className="w-full flex items-center justify-between"
              onClick={() => navigate("/profile")}
            >
              <span>{hasProfile ? "Update Profile" : "Complete Profile"}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-brand-500" />
              <span>Upload Resume</span>
            </CardTitle>
            <CardDescription>Get recommendations from your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Upload your resume to get personalized course recommendations based on your experience and skills.
            </p>
            <Button 
              variant="default" 
              className="w-full flex items-center justify-between"
              onClick={() => navigate("/resume")}
            >
              <span>Upload Resume</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-500" />
              <span>View Recommendations</span>
            </CardTitle>
            <CardDescription>See your personalized learning path</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {hasProfile 
                ? "Check out your personalized course recommendations and learning path."
                : "Complete your profile first to get course recommendations."}
            </p>
            <Button 
              variant={hasProfile ? "default" : "outline"} 
              className="w-full flex items-center justify-between"
              onClick={() => hasProfile ? navigate("/recommendations") : navigate("/profile")}
              disabled={!hasProfile}
            >
              <span>{hasProfile ? "View Recommendations" : "Complete Profile First"}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-lg p-6 border border-brand-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900">Ready to accelerate your career?</h2>
            <p className="mt-2 text-gray-700">
              Get personalized course recommendations based on your career goals, skills, and learning style.
              Our AI-powered system will create a tailored learning path to help you reach your goals.
            </p>
            <div className="mt-4">
              <Button 
                variant="default" 
                className="font-semibold"
                onClick={() => navigate("/profile")}
              >
                Get Started
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="rounded-full bg-brand-100 p-6 animate-pulse">
              <BookOpen className="h-16 w-16 text-brand-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
