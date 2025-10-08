import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionsAPI, answersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { MessageCircle, Edit, Trash2, Clock } from 'lucide-react';

const MyAnswers = () => {
  const [myAnswers, setMyAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchMyAnswers();
  }, []);

  const fetchMyAnswers = async () => {
    try {
      setIsLoading(true);
      const questionsRes = await questionsAPI.getAll();
      const allQuestions = questionsRes.data;

      const answersPromises = allQuestions.map((q) =>
        answersAPI.getByQuestion(q.questionid).then((res) => ({
          question: q,
          answers: res.data || [],
        }))
      );

      const results = await Promise.all(answersPromises);
      const userAnswers = results
        .flatMap((result) =>
          result.answers
            .filter((a) => a.userid === user?.userid)
            .map((a) => ({
              ...a,
              questionTitle: result.question.title,
              questionId: result.question.questionid,
            }))
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setMyAnswers(userAnswers);
    } catch (error) {
      showToast('Failed to load your answers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (answerId) => {
    if (!window.confirm('Are you sure you want to delete this answer?')) return;

    try {
      await answersAPI.delete(answerId);
      showToast('Answer deleted successfully', 'success');
      fetchMyAnswers();
    } catch (error) {
      showToast('Failed to delete answer', 'error');
    }
  };

  const handleUpdate = async (answerId) => {
    const newContent = document.getElementById(`edit-${answerId}`).value;
    if (!newContent.trim()) return;

    try {
      await answersAPI.update(answerId, { answer: newContent });
      showToast('Answer updated successfully', 'success');
      setEditingAnswer(null);
      fetchMyAnswers();
    } catch (error) {
      showToast('Failed to update answer', 'error');
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Answers</h1>

        {myAnswers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No answers yet</h3>
            <p className="text-gray-500 mb-6">Start helping others by answering questions!</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Questions
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {myAnswers.map((answer) => (
              <div
                key={answer.answerid}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6"
              >
                <Link
                  to={`/questions/${answer.questionId}`}
                  className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition block mb-3"
                >
                  {answer.questionTitle}
                </Link>

                {editingAnswer === answer.answerid ? (
                  <div>
                    <textarea
                      id={`edit-${answer.answerid}`}
                      defaultValue={answer.answer}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-3"
                      rows="4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(answer.answerid)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAnswer(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 mb-4 whitespace-pre-wrap">{answer.answer}</p>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDate(answer.created_at)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingAnswer(answer.answerid)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(answer.answerid)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAnswers;
