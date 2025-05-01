import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Helper function to validate recommendations data
const validateRecommendations = (data: any): string | null => {
  // Check if data exists
  if (!data) return null;
  
  // Handle different response formats
  if (typeof data === 'string') {
    return data;
  } else if (typeof data === 'object') {
    // Case 1: Direct Gemini response containing roadmap, skills, etc.
    if (data.roadmap || data.skills_to_learn || data.recommended_courses) {
      try {
        return JSON.stringify(data, null, 2);
      } catch (e) {
        console.error("Failed to stringify direct Gemini response:", e);
      }
    }
    
    // Case 2: Some APIs might return { prediction: "text" } or { text: "content" }
    if (data.prediction && typeof data.prediction === 'string') {
      return data.prediction;
    } else if (data.prediction && typeof data.prediction === 'object') {
      try {
        return JSON.stringify(data.prediction, null, 2);
      } catch (e) {
        console.error("Failed to stringify prediction object:", e);
      }
    }
    
    // Case 3: Other simple object properties
    if (data.text && typeof data.text === 'string') {
      return data.text;
    } else if (data.content && typeof data.content === 'string') {
      return data.content;
    }
    
    // If no known property is found, try JSON stringify the whole object
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      console.error("Failed to stringify recommendation data:", e);
      return null;
    }
  }
  
  return null;
};
 
const Recommendations = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // State to store recommendations
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Parse the recommendations into sections
  const [parsedRecommendations, setParsedRecommendations] = useState<{
    courseList: string[];
    roadmap: string[];
    resources: string[];
    rawText: string;
  }>({
    courseList: [],
    roadmap: [],
    resources: [],
    rawText: "",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
    
    // Get recommendations from location state, if available
    if (location.state && location.state.recommendations) {
      console.log("Raw location state recommendations:", location.state.recommendations);
      const validatedRecommendations = validateRecommendations(location.state.recommendations);
      console.log("Validated recommendations:", validatedRecommendations);
      
      if (validatedRecommendations) {
        setRecommendations(validatedRecommendations);
      } else {
        console.error("Invalid recommendations format received");
        setLoading(true);
        
        toast({
          title: "Invalid recommendations format",
          description: "There was an issue processing your recommendations",
          variant: "destructive",
        });
        navigate("/profile");
      }
    } else {
      console.log("Location state:", location.state);
      setLoading(true);
      
      // After navigating from ProfileForm, if there are no recommendations,
      // it's likely due to one of these causes:
      // 1. User accessed this page directly without going through the form
      // 2. There was an error in the API response
      // 3. The state was lost during navigation
      
      toast({
        title: "No recommendations found",
        description: "Please complete your profile first",
        variant: "destructive",
      });
      navigate("/profile");
    }
  }, [isAuthenticated, isLoading, navigate, location.state, toast]);

  useEffect(() => {
    if (recommendations) {
      // Parse the recommendation text
      try {
        const text = recommendations.toString();
        
        // Check if the text is JSON
        let jsonData = null;
        try {
          jsonData = JSON.parse(text);
        } catch (e) {
          // Not JSON, will use text parsing
        }
        
        if (jsonData) {
          // Handle JSON data from Gemini API
          console.log("Parsed JSON data:", jsonData);
          
          const sections: { courseList: string[], roadmap: string[], resources: string[] } = {
            courseList: [],
            roadmap: [],
            resources: []
          };
          
          // Extract recommended courses
          if (jsonData.recommended_courses && Array.isArray(jsonData.recommended_courses)) {
            jsonData.recommended_courses.forEach((course: any, index: number) => {
              sections.courseList.push(
                `${index + 1}. ${course.title} - ${course.platform}\n` +
                `   Difficulty: ${course.difficulty}\n` +
                `   URL: ${course.url || 'Not provided'}`
              );
            });
          }
          
          // Extract roadmap
          if (jsonData.roadmap && Array.isArray(jsonData.roadmap)) {
            jsonData.roadmap.forEach((step: any) => {
              let stepText = `Week ${step.week}: ${step.focus}\n`;
              
              if (step.tasks && Array.isArray(step.tasks)) {
                stepText += "Tasks:\n" + step.tasks.map((task: string) => `- ${task}`).join("\n");
              }
              
              if (step.project) {
                stepText += `\nProject: ${step.project}`;
              }
              
              sections.roadmap.push(stepText);
            });
          }
          
          // Extract learning resources
          if (jsonData.learning_resources && Array.isArray(jsonData.learning_resources)) {
            jsonData.learning_resources.forEach((resource: any, index: number) => {
              sections.resources.push(
                `${index + 1}. ${resource.type}: ${resource.title || resource.name}\n` +
                (resource.author ? `   Author: ${resource.author}\n` : '') +
                (resource.url ? `   URL: ${resource.url}` : '')
              );
            });
          }
          
          // Add career tips to resources
          if (jsonData.career_tips && Array.isArray(jsonData.career_tips)) {
            sections.resources.push(
              "Career Tips:\n" + jsonData.career_tips.map((tip: string) => `- ${tip}`).join("\n")
            );
          }
          
          // Add skills to learn to courses
          if (jsonData.skills_to_learn && Array.isArray(jsonData.skills_to_learn)) {
            sections.courseList.unshift(
              "Skills to Learn:\n" + 
              jsonData.skills_to_learn.map((skill: any, index: number) => 
                `${index + 1}. ${skill.name} (${skill.category})`
              ).join("\n")
            );
          }
          
          setParsedRecommendations({
            ...sections,
            rawText: text
          });
        } else {
          // Use the existing text parsing logic for non-JSON responses
          console.log("Using text parsing for non-JSON response");
          
          // Simple parsing based on common patterns in the response
          const sections: { courseList: string[], roadmap: string[], resources: string[] } = {
            courseList: [],
            roadmap: [],
            resources: []
          };
          
          // Split by double newlines to get paragraphs
          const paragraphs = text.split(/\n\n+/);
          
          // Process each paragraph
          paragraphs.forEach(paragraph => {
            // Trim and check for empty paragraphs
            const trimmed = paragraph.trim();
            if (!trimmed) return;
            
            // Check for course listings (numbered or bulleted lists)
            if (/^(\d+\.|-)/.test(trimmed)) {
              sections.courseList.push(trimmed);
            }
            // Check for roadmap-like content (contains "step", "phase", "month", or "week")
            else if (/\b(step|phase|month|week)\b/i.test(trimmed)) {
              sections.roadmap.push(trimmed);
            }
            // Check for resource-like content (contains "resource", "link", "http", or "www")
            else if (/\b(resource|link|http|www)\b/i.test(trimmed)) {
              sections.resources.push(trimmed);
            }
            // Add to general course list if it doesn't fit other categories
            else {
              sections.courseList.push(trimmed);
            }
          });
          
          setParsedRecommendations({
            ...sections,
            rawText: text
          });
        }
      } catch (error) {
        console.error("Error parsing recommendations:", error);
        setParsedRecommendations({
          courseList: [],
          roadmap: [],
          resources: [],
          rawText: recommendations.toString()
        });
      }
    }
  }, [recommendations]);
  
  const handleFeedback = (type: 'like' | 'dislike') => {
    toast({
      title: type === 'like' ? "Thank you for your feedback!" : "We'll improve our recommendations",
      description: type === 'like' 
        ? "We're glad you found these recommendations helpful." 
        : "We appreciate your feedback and will use it to improve.",
    });
  };

  const handleExportPDF = () => {
    // Placeholder for PDF export functionality
    toast({
      title: "Export feature coming soon",
      description: "The ability to export recommendations as PDF will be available soon.",
    });
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Personalized Learning Path</h1>
        <p className="text-lg text-gray-600 mt-2">
          Based on your profile, here are our AI-powered course recommendations
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Course Recommendations</CardTitle>
          <CardDescription>
            Tailored courses and learning path based on your career goals and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="courses">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="courses">Recommended Courses</TabsTrigger>
              <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
              <TabsTrigger value="resources">Additional Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses" className="animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Courses to Consider</h3>
                {parsedRecommendations.courseList.length > 0 ? (
                  parsedRecommendations.courseList.map((course, index) => (
                    <Card key={index} className="card-hover">
                      <CardContent className="p-4">
                        <div 
                          className="prose prose-blue max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: course.replace(/(\d+\.\s|\-\s)/g, '<strong>$1</strong>')
                                        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-brand-600 hover:text-brand-800">$1</a>')
                                        .replace(/\n/g, '<br/>')
                          }}
                        />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-600">No specific courses were recommended. Check the other tabs for more information.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="roadmap" className="animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Your Learning Journey</h3>
                {parsedRecommendations.roadmap.length > 0 ? (
                  parsedRecommendations.roadmap.map((step, index) => (
                    <Card key={index} className="card-hover">
                      <CardContent className="p-4">
                        <div 
                          className="prose prose-blue max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: step.replace(/(Step \d+|Phase \d+|Month \d+|Week \d+):/g, '<strong>$1:</strong>')
                                      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-brand-600 hover:text-brand-800">$1</a>')
                                      .replace(/\n/g, '<br/>')
                          }}
                        />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                    <p className="text-amber-800">
                      {parsedRecommendations.rawText ? (
                        "We couldn't detect a specific learning roadmap in the recommendations. Please check the raw recommendations for more details."
                      ) : (
                        "No learning roadmap is available. Please complete your profile to get personalized recommendations."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Additional Resources</h3>
                {parsedRecommendations.resources.length > 0 ? (
                  parsedRecommendations.resources.map((resource, index) => (
                    <Card key={index} className="card-hover">
                      <CardContent className="p-4">
                        <div 
                          className="prose prose-blue max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: resource.replace(/(\d+\.\s|\-\s)/g, '<strong>$1</strong>')
                                        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-brand-600 hover:text-brand-800 flex items-center"><span>$1</span><ExternalLink className="h-3 w-3 ml-1" /></a>')
                                        .replace(/\n/g, '<br/>')
                          }}
                        />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-600">No additional resources were specifically recommended.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <h4 className="font-medium">General Learning Platforms</h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex items-center">
                            <a href="https://www.coursera.org" target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 flex items-center">
                              Coursera <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </li>
                          <li className="flex items-center">
                            <a href="https://www.udemy.com" target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 flex items-center">
                              Udemy <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </li>
                          <li className="flex items-center">
                            <a href="https://www.edx.org" target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 flex items-center">
                              edX <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </li>
                        </ul>
                      </Card>
                      <Card className="p-4">
                        <h4 className="font-medium">Community Resources</h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex items-center">
                            <a href="https://stackoverflow.com" target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 flex items-center">
                              Stack Overflow <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </li>
                          <li className="flex items-center">
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 flex items-center">
                              GitHub <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </li>
                          <li className="flex items-center">
                            <a href="https://www.reddit.com/r/learnprogramming/" target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 flex items-center">
                              r/learnprogramming <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </li>
                        </ul>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="text-sm text-gray-500">Was this helpful?</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1"
                onClick={() => handleFeedback('like')}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Yes</span>
              </Button>
              <Button 
                variant="outline"
                size="sm" 
                className="flex items-center space-x-1"
                onClick={() => handleFeedback('dislike')}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>No</span>
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1"
                onClick={handleExportPDF}
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate("/profile")}
              >
                Update Preferences
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Show raw recommendations for debugging/development */}
      {false && parsedRecommendations.rawText && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Raw Recommendations</CardTitle>
            <CardDescription>Full text of AI-generated recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
              {parsedRecommendations.rawText}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Debug component for troubleshooting recommendation issues */}
      {/* <Card className="mt-8 border-red-300">
        <CardHeader className="bg-red-50">
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>Information for troubleshooting recommendation issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Location State:</h3>
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md overflow-auto max-h-[200px]">
                {JSON.stringify(location.state, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-medium">Raw Recommendations State:</h3>
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md overflow-auto max-h-[200px]">
                {JSON.stringify(recommendations, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-medium">Parsed Recommendations:</h3>
              <div className="text-sm">
                <p><strong>Course List Items:</strong> {parsedRecommendations.courseList.length}</p>
                <p><strong>Roadmap Items:</strong> {parsedRecommendations.roadmap.length}</p>
                <p><strong>Resource Items:</strong> {parsedRecommendations.resources.length}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <h3 className="font-medium text-blue-700">Troubleshooting Steps:</h3>
              <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                <li>Check that the <code>response.prediction</code> from API exists</li>
                <li>Verify that the API is returning the expected JSON structure</li>
                <li>Make sure React Router state is properly passing between pages</li>
                <li>If data is in wrong format, adjust the <code>validateRecommendations</code> function</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Recommendations;
