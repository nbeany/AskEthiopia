import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import QuestionCard from '@/components/QuestionCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface Question {
  questionid: string;
  title: string;
  description: string;
  tag: string;
  username: string;
  userid: string;
}

const MyQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchMyQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getAll();
      const myQuestions = response.data.filter((q: Question) => q.userid === user?.userid);
      setQuestions(myQuestions);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch your questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyQuestions();
  }, []);

  const handleDelete = async (questionid: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await questionsAPI.delete(questionid);
      await fetchMyQuestions();
      toast({
        title: "Success",
        description: "Question deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">My Questions</h1>
          <Button onClick={() => navigate('/ask')}>
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't asked any questions yet</p>
            <Button onClick={() => navigate('/ask')}>Ask Your First Question</Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {questions.map((question) => (
              <div key={question.questionid} className="relative group">
                <QuestionCard {...question} />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(question.questionid);
                    }}
                  >
                    Delete
                  </Button>
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
