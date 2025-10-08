import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionsAPI } from '../services/api';
import { Search, Tag, MessageCircle, Clock } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, [selectedTag]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (selectedTag) params.tag = selectedTag;

      const response = await questionsAPI.getAll(params);
      setQuestions(response.data);
    } catch (error) {
      showToast('Failed to load questions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchQuestions();
      return;
    }

    try {
      setIsLoading(true);
      const response = await questionsAPI.getAll({ q: searchQuery });
      setQuestions(response.data);
    } catch (error) {
      showToast('Search failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={hideToast} />}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Questions</h1>

          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedTag === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {['javascript', 'react', 'node', 'python', 'css'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions found</h3>
            <p className="text-gray-500">Be the first to ask a question!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <Link
                key={question.questionid}
                to={`/questions/${question.questionid}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition">
                      {question.title}
                    </h3>
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
                      <span>by {question.username || 'Anonymous'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
