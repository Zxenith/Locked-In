
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Book, CheckCircle, BarChart, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Discover Your Ideal Learning Path with AI-Powered Recommendations
              </h1>
              <p className="text-lg text-gray-700">
                CourseCompass uses advanced AI to analyze your skills, goals, and learning style to 
                create personalized course recommendations that accelerate your career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
                  className="font-semibold text-base px-6"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/about")}
                  className="font-semibold text-base px-6"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative animate-fade-in">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-brand-100 rounded-full filter blur-3xl opacity-70"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-70"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80" 
                  alt="Students learning" 
                  className="rounded-lg shadow-xl relative z-10 max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="hidden md:block absolute bottom-0 left-0 w-full h-24 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How CourseCompass Works</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our platform uses AI to match your unique profile with thousands of courses 
              to create a personalized learning path.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Tell us about your skills, experience, learning style, and career goals so we can understand your unique needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your profile and matches it with courses from top educational platforms.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <Book className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Learning Path</h3>
              <p className="text-gray-600">
                Receive a personalized roadmap with recommended courses, resources, and a timeline tailored to your goals.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-brand-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of learners who have accelerated their careers with CourseCompass's personalized recommendations.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
            className="font-semibold text-brand-600"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
          </Button>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Here's what people are saying about their experience with CourseCompass
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-brand-200 flex items-center justify-center mr-3">
                  <span className="font-semibold text-brand-600">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jane Doe</h4>
                  <p className="text-sm text-gray-500">Software Developer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "CourseCompass helped me transition from marketing to web development with a perfectly tailored learning path. I'm now working as a junior developer!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-brand-200 flex items-center justify-center mr-3">
                  <span className="font-semibold text-brand-600">MS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael Smith</h4>
                  <p className="text-sm text-gray-500">Data Analyst</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The AI recommendations were spot-on! I was able to upskill in data science while working full-time, and got promoted within 6 months."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-brand-200 flex items-center justify-center mr-3">
                  <span className="font-semibold text-brand-600">AL</span>
                </div>
                <div>
                  <h4 className="font-semibold">Aria Lee</h4>
                  <p className="text-sm text-gray-500">UX Designer</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I uploaded my resume and got a perfect roadmap for transitioning from graphic design to UX. The resources were invaluable!"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join CourseCompass Today</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Create your account now and start getting personalized course recommendations
            to accelerate your career.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
          >
            {isAuthenticated ? "Go to Dashboard" : "Create Free Account"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;

// Import missing icon
function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
