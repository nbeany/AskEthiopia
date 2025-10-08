import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { questionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { MessageCircle, Edit, Trash2, Tag, Clock } from 'lucide-react';

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchMyQuestions();
  }, []);

  const fetchMyQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await questionsAPI.getAll();
      const myQuestions = response.data.filter((q) => q.userid === user?.userid);
      setQuestions(myQuestions);
    } catch (error) {
      showToast('Failed to load your questions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await questionsAPI.delete(id);
      showToast('Question deleted successfully', 'success');
      fetchMyQuestions();
    } catch (error) {
      showToast('Failed to delete question', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={hideToast} />}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Questions</h1>
          <Link
            to="/ask"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ask New Question
          </Link>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-6">Start sharing your questions with the community!</p>
            <Link
              to="/ask"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Ask Your First Question
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.questionid}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      to={`/questions/${question.questionid}`}
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition block mb-2"
                    >
                      {question.title}
                    </Link>
                    <p className="text-gray-600 mb-3 line-clamp-2">{question.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {question.tag && (
                        <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                          <Tag className="w-3 h-3" />
                          {question.tag}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(question.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/questions/${question.questionid}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(question.questionid)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuestions;
