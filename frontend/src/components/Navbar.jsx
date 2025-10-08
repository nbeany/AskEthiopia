import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Home, PlusCircle, User, LogOut, LogIn } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              <MessageCircle className="w-7 h-7" />
              <span>Q&A Hub</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/ask"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask Question</span>
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user?.firstname || 'Profile'}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/my-questions"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg"
                    >
                      My Questions
                    </Link>
                    <Link
                      to="/my-answers"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      My Answers
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
