import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuestionDetail from './pages/QuestionDetail';
import AskQuestion from './pages/AskQuestion';
import MyQuestions from './pages/MyQuestions';
import MyAnswers from './pages/MyAnswers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route
              path="/ask"
              element={
                <PrivateRoute>
                  <AskQuestion />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-questions"
              element={
                <PrivateRoute>
                  <MyQuestions />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-answers"
              element={
                <PrivateRoute>
                  <MyAnswers />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
