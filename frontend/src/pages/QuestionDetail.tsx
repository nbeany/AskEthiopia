import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { questionsAPI, answersAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import AnswerCard from '@/components/AnswerCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { User } from 'lucide-react';

interface Question {
  questionid: string;
  title: string;
  description: string;
  tag: string;
  username: string;
  userid: string;
}

interface Answer {
  answerid: string;
  answer: string;
  username: string;
  userid: string;
}

const QuestionDetail = () => {
  const { questionid } = useParams<{ questionid: string }>();
  const { isAuthenticated } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestionAndAnswers = async () => {
    if (!questionid) return;
    
    try {
      setLoading(true);
      const [questionResponse, answersResponse] = await Promise.all([
        questionsAPI.getById(questionid),
        answersAPI.getByQuestionId(questionid),
      ]);
      setQuestion(questionResponse.data);
      setAnswers(answersResponse.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch question details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [questionid]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionid || !newAnswer.trim()) return;

    try {
      setSubmitting(true);
      await answersAPI.create({ questionid, answer: newAnswer });
      setNewAnswer('');
      await fetchQuestionAndAnswers();
      toast({
        title: "Success",
        description: "Your answer has been posted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to post answer",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAnswer = async (answerid: string, answer: string) => {
    try {
      await answersAPI.update(answerid, { answer });
      await fetchQuestionAndAnswers();
      toast({
        title: "Success",
        description: "Answer updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update answer",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnswer = async (answerid: string) => {
    if (!confirm('Are you sure you want to delete this answer?')) return;
    
    try {
      await answersAPI.delete(answerid);
      await fetchQuestionAndAnswers();
      toast({
        title: "Success",
        description: "Answer deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete answer",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Question not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-3xl font-bold">{question.title}</CardTitle>
              <Badge className="bg-tag text-tag-foreground shrink-0">{question.tag}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <User className="h-4 w-4" />
              <span>Asked by {question.username}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{question.description}</p>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          <div className="space-y-4">
            {answers.map((answer) => (
              <AnswerCard
                key={answer.answerid}
                {...answer}
                onUpdate={handleUpdateAnswer}
                onDelete={handleDeleteAnswer}
              />
            ))}
          </div>
        </div>

        {isAuthenticated ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <Textarea
                  placeholder="Write your answer here..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="min-h-[150px]"
                  required
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Answer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Please <a href="/login" className="text-primary hover:underline">login</a> to post an answer
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
