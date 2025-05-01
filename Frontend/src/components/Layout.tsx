
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { User, LogOut, BookOpen } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-brand-500" />
            <span className="text-xl font-bold text-brand-800">CourseCompass</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-brand-500 transition">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-brand-500 transition">
                  Profile
                </Link>
                <Link to="/resume" className="text-gray-600 hover:text-brand-500 transition">
                  Resume Upload
                </Link>
              </>
            ) : (
              <>
                <Link to="/about" className="text-gray-600 hover:text-brand-500 transition">
                  About
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-2">
                  <User className="h-5 w-5 text-brand-500" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} CourseCompass. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-brand-500 transition">
                Terms
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-500 transition">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-brand-500 transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
