
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Lightbulb, Book, BarChart4, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const About = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About CourseCompass</h1>
        <p className="text-xl text-gray-600">
          Using AI to create personalized learning paths for career advancement
        </p>
      </div>
      
      <div className="space-y-12">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-gray-600">
                At CourseCompass, we believe that everyone deserves access to high-quality, 
                personalized education that aligns with their career goals and learning style. 
                Our mission is to eliminate the guesswork from course selection by using AI 
                to match learners with the perfect educational resources.
              </p>
              <p className="text-gray-600">
                We're dedicated to helping individuals accelerate their career growth through
                targeted, efficient learning paths tailored to their unique needs.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80"
                  alt="Students collaborating"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>
        
        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Profile Creation</h3>
                <p className="text-gray-600">
                  Create your profile with your skills, experience, learning preferences, and career goals.
                  Or upload your resume for automatic analysis.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart4 className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600">
                  Our sophisticated AI analyzes your profile and matches it with courses from top
                  educational platforms based on multiple factors.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                  <Book className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized Recommendations</h3>
                <p className="text-gray-600">
                  Receive a tailored learning path with recommended courses, resources, and
                  a timeline designed to achieve your career goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose CourseCompass</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Trophy className="h-5 w-5 text-brand-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">AI-Powered Intelligence</h3>
                <p className="text-gray-600 mt-1">
                  Our advanced AI algorithms analyze thousands of courses to find the perfect match for your skills,
                  learning style, and career goals.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Trophy className="h-5 w-5 text-brand-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Save Time and Money</h3>
                <p className="text-gray-600 mt-1">
                  Avoid wasted time and resources on courses that don't align with your goals. 
                  Our recommendations focus on what truly matters for your career advancement.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Trophy className="h-5 w-5 text-brand-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Continuous Improvement</h3>
                <p className="text-gray-600 mt-1">
                  Our system gets smarter with every user recommendation. Your feedback helps improve
                  the platform for everyone while keeping your recommendations up-to-date.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Technology</h2>
          <p className="text-gray-600">
            CourseCompass leverages cutting-edge AI technology, including advanced natural language
            processing and machine learning algorithms, to understand your unique profile and match
            it with the most relevant educational resources from across the web.
          </p>
          <p className="text-gray-600 mt-4">
            Our platform integrates with major course providers to ensure you always have access to
            the latest and most relevant content tailored to your career path.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-lg p-8 border border-brand-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Learning Journey Today</h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Join thousands of users who've accelerated their careers with CourseCompass's
              personalized learning recommendations.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
              className="font-semibold text-base px-6"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
