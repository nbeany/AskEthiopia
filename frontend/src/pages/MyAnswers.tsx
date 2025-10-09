import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { questionsApi, answersApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Answer {
  answerid: string;
  answer: string;
  questionid: string;
  created_at: string;
  questionTitle?: string;
}

const MyAnswers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyAnswers = async () => {
    try {
      setIsLoading(true);
      const questionsRes = await questionsApi.getAll();
      const allQuestions = questionsRes.data;
      
      // Fetch all answers and filter by current user
      const answersPromises = allQuestions.map((q: any) => 
        answersApi.getByQuestion(q.questionid)
          .then(res => res.data.map((a: any) => ({
            ...a,
            questionTitle: q.title,
            questionid: q.questionid,
          })))
      );
      
      const allAnswersArrays = await Promise.all(answersPromises);
      const allAnswers = allAnswersArrays.flat();
      
      // Filter answers by current user
      const myAnswers = allAnswers.filter(
        (a: any) => a.username === user?.username
      );
      
      setAnswers(myAnswers);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load your answers',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAnswers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">My Answers</h1>
          <p className="text-muted-foreground">
            View all your contributions to the community
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : answers.length > 0 ? (
          <div className="space-y-4">
            {answers.map((answer) => (
              <Card key={answer.answerid} className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>Answer to:</span>
                      <span className="font-medium text-foreground">
                        {answer.questionTitle}
                      </span>
                    </div>
                    <p className="text-foreground line-clamp-3">{answer.answer}</p>
                    <div className="text-sm text-muted-foreground">
                      <time>{new Date(answer.created_at).toLocaleDateString()}</time>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/questions/${answer.questionid}`)}
                    className="gap-2 shrink-0"
                  >
                    View
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">You haven't posted any answers yet</p>
            <Button onClick={() => navigate('/')}>
              Browse Questions
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAnswers;
