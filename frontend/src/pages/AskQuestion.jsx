import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { PlusCircle } from 'lucide-react';

const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await questionsAPI.create(formData);
      showToast('Question posted successfully!', 'success');
      setTimeout(() => {
        navigate(`/questions/${response.data.questionid}`);
      }, 1000);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to post question', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={hideToast} />}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <PlusCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Question Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., How do I center a div in CSS?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Be specific and imagine you're asking a question to another person
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Question Details
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="8"
                placeholder="Include all the information someone would need to answer your question"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide context, what you've tried, and what you're trying to achieve
              </p>
            </div>

            <div>
              <label htmlFor="tag" className="block text-sm font-semibold text-gray-700 mb-2">
                Tag (Optional)
              </label>
              <input
                type="text"
                id="tag"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="e.g., javascript, react, css"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Add a tag to help others find your question
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Question'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
