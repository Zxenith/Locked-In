
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { submitProfile } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const ProfileForm = () => {
  const { isAuthenticated, isLoading, user, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age_group: "",
    current_role: "",
    industry: "",
    experience: "",
    career_goal: "",
    new_career: "",
    career_switch: "no",
    skills: [] as string[],
    learning_style: "",
    time_commitment: "",
    budget: "",
  });
  
  const [currentSkill, setCurrentSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Pre-fill form with user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
      
      // If user has already filled profile data, pre-fill the form
      if (user.user_data) {
        const userData = user.user_data;
        setFormData(prev => ({
          ...prev,
          age_group: userData.age_group || "",
          current_role: userData.current_role || "",
          industry: userData.industry || "",
          experience: userData.experience || "",
          career_goal: userData.career_goal || "",
          new_career: userData.new_career || "",
          career_switch: userData.career_switch || "no",
          skills: userData.skills || [],
          learning_style: userData.learning_style || "",
          time_commitment: userData.time_commitment || "",
          budget: userData.budget || "",
        }));
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (currentSkill.trim() !== "" && !formData.skills.includes(currentSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await submitProfile(formData);
      
      // Refresh user profile to get latest data
      await refreshUserProfile();
      
      toast({
        title: "Profile submitted successfully",
        description: "Your course recommendations are ready!",
      });
      
      // Navigate to recommendations page and pass the data
      navigate("/recommendations", { state: { recommendations: response.prediction } });
    } catch (error: any) {
      console.error("Error submitting profile:", error);
      toast({
        title: "Submission failed",
        description: error.message || "There was an error processing your profile information.",
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
        <h1 className="text-3xl font-bold text-gray-900">Career Profile</h1>
        <p className="text-lg text-gray-600 mt-2">
          Help us understand your goals to provide personalized course recommendations
        </p>
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Your Career Information</CardTitle>
          <CardDescription>Fill out the form below to get tailored recommendations</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age_group">Age Group</Label>
                <Select 
                  value={formData.age_group} 
                  onValueChange={(value) => handleSelectChange("age_group", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current_role">Current Role</Label>
                <Input
                  id="current_role"
                  name="current_role"
                  placeholder="e.g., Software Engineer"
                  value={formData.current_role}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => handleSelectChange("industry", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select 
                  value={formData.experience} 
                  onValueChange={(value) => handleSelectChange("experience", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="career_goal">Career Goal</Label>
              <Textarea
                id="career_goal"
                name="career_goal"
                placeholder="Describe your career goal in detail"
                value={formData.career_goal}
                onChange={handleChange}
                className="min-h-[100px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Are you looking to switch careers?</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="career_switch_yes"
                    name="career_switch"
                    value="yes"
                    checked={formData.career_switch === "yes"}
                    onChange={handleChange}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                  />
                  <Label htmlFor="career_switch_yes" className="text-sm font-normal">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="career_switch_no"
                    name="career_switch"
                    value="no"
                    checked={formData.career_switch === "no"}
                    onChange={handleChange}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                  />
                  <Label htmlFor="career_switch_no" className="text-sm font-normal">No</Label>
                </div>
              </div>
            </div>
            
            {formData.career_switch === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="new_career">New Career Path</Label>
                <Input
                  id="new_career"
                  name="new_career"
                  placeholder="e.g., Data Science"
                  value={formData.new_career}
                  onChange={handleChange}
                  required={formData.career_switch === "yes"}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="currentSkill"
                  placeholder="Enter a skill and press Add"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="learning_style">Preferred Learning Style</Label>
                <Select 
                  value={formData.learning_style} 
                  onValueChange={(value) => handleSelectChange("learning_style", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select learning style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visual">Visual</SelectItem>
                    <SelectItem value="Auditory">Auditory</SelectItem>
                    <SelectItem value="Reading/Writing">Reading/Writing</SelectItem>
                    <SelectItem value="Kinesthetic">Kinesthetic (Hands-on)</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time_commitment">Time Commitment</Label>
                <Select 
                  value={formData.time_commitment} 
                  onValueChange={(value) => handleSelectChange("time_commitment", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 hours/week">1-3 hours/week</SelectItem>
                    <SelectItem value="4-6 hours/week">4-6 hours/week</SelectItem>
                    <SelectItem value="7-10 hours/week">7-10 hours/week</SelectItem>
                    <SelectItem value="10+ hours/week">10+ hours/week</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Select 
                value={formData.budget} 
                onValueChange={(value) => handleSelectChange("budget", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free courses only</SelectItem>
                  <SelectItem value="0-50">$0-$50</SelectItem>
                  <SelectItem value="50-200">$50-$200</SelectItem>
                  <SelectItem value="200-500">$200-$500</SelectItem>
                  <SelectItem value="500+">$500+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit and Get Recommendations"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfileForm;
