import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import QuestionCard from '@/components/QuestionCard';
import { questionsApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Question {
  questionid: string;
  title: string;
  description: string;
  tag: string;
  username: string;
  created_at: string;
  answerCount?: number;
}

const MyQuestions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await questionsApi.getAll();
      // Filter questions by current user
      const myQuestions = response.data.filter(
        (q: Question) => q.username === user?.username
      );
      setQuestions(myQuestions);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load your questions',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">My Questions</h1>
            <p className="text-muted-foreground">
              Manage and track your posted questions
            </p>
          </div>
          <Button onClick={() => navigate('/ask')} className="gap-2">
            <Plus className="h-4 w-4" />
            Ask Question
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionCard key={question.questionid} question={question} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">You haven't asked any questions yet</p>
            <Button onClick={() => navigate('/ask')}>
              Ask Your First Question
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyQuestions;
