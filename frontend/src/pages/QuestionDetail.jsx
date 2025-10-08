import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionsAPI, answersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { Tag, Clock, MessageCircle, Edit, Trash2, Send } from 'lucide-react';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState(null);

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [id]);

  const fetchQuestionAndAnswers = async () => {
    try {
      setIsLoading(true);
      const [questionRes, answersRes] = await Promise.all([
        questionsAPI.getById(id),
        answersAPI.getByQuestion(id),
      ]);
      setQuestion(questionRes.data);
      setAnswers(answersRes.data || []);
    } catch (error) {
      showToast('Failed to load question', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    try {
      setIsSubmitting(true);
      await answersAPI.create({ questionid: id, answer: newAnswer });
      showToast('Answer posted successfully!', 'success');
      setNewAnswer('');
      fetchQuestionAndAnswers();
    } catch (error) {
      showToast('Failed to post answer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await questionsAPI.delete(id);
      showToast('Question deleted successfully', 'success');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      showToast('Failed to delete question', 'error');
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure you want to delete this answer?')) return;

    try {
      await answersAPI.delete(answerId);
      showToast('Answer deleted successfully', 'success');
      fetchQuestionAndAnswers();
    } catch (error) {
      showToast('Failed to delete answer', 'error');
    }
  };

  const handleUpdateAnswer = async (answerId, newContent) => {
    try {
      await answersAPI.update(answerId, { answer: newContent });
      showToast('Answer updated successfully', 'success');
      setEditingAnswer(null);
      fetchQuestionAndAnswers();
    } catch (error) {
      showToast('Failed to update answer', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Question not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={hideToast} />}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{question.title}</h1>
            {user?.userid === question.userid && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/questions/${id}/edit`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeleteQuestion}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-700 text-lg mb-4 whitespace-pre-wrap">{question.description}</p>

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
            <span>Asked by {question.username || 'Anonymous'}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          <div className="space-y-6 mb-8">
            {answers.map((answer) => (
              <div key={answer.answerid} className="border-b border-gray-200 pb-6 last:border-b-0">
                {editingAnswer === answer.answerid ? (
                  <div>
                    <textarea
                      defaultValue={answer.answer}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-2"
                      rows="4"
                      id={`edit-${answer.answerid}`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newContent = document.getElementById(`edit-${answer.answerid}`).value;
                          handleUpdateAnswer(answer.answerid, newContent);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAnswer(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">{answer.answer}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Answered by {answer.username || 'Anonymous'} on {formatDate(answer.created_at)}
                      </div>
                      {user?.userid === answer.userid && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingAnswer(answer.answerid)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnswer(answer.answerid)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}

            {answers.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No answers yet. Be the first to answer!
              </p>
            )}
          </div>

          {isAuthenticated ? (
            <form onSubmit={handleSubmitAnswer}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Answer</h3>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4"
                rows="5"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Posting...' : 'Post Answer'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">Please log in to post an answer</p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
