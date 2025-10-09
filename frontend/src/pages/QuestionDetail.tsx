import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import AnswerCard from '@/components/AnswerCard';
import { questionsApi, answersApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { User, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { answerSchema } from '@/lib/validations';

interface Question {
  questionid: string;
  title: string;
  description: string;
  tag: string;
  username: string;
  userid: string;
  created_at: string;
}

interface Answer {
  answerid: string;
  answer: string;
  username: string;
  userid: string;
  created_at: string;
}

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [answerError, setAnswerError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestionAndAnswers = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const [questionRes, answersRes] = await Promise.all([
        questionsApi.getById(id),
        answersApi.getByQuestion(id)
      ]);
      
      setQuestion(questionRes.data);
      setAnswers(answersRes.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load question',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [id]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setAnswerError('');
    
    // Validate answer
    const validationResult = answerSchema.safeParse({ answer: newAnswer });
    if (!validationResult.success) {
      setAnswerError(validationResult.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      await answersApi.create({ 
        questionid: id, 
        answer: validationResult.data.answer 
      });
      toast({
        title: 'Answer posted',
        description: 'Your answer has been added successfully',
      });
      setNewAnswer('');
      fetchQuestionAndAnswers();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to post answer',
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!id || !confirm('Are you sure you want to delete this question?')) return;

    try {
      await questionsApi.delete(id);
      toast({
        title: 'Question deleted',
        description: 'The question has been removed',
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete',
        description: 'Could not delete the question',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 text-center">
          <p className="text-muted-foreground">Question not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // SECURITY NOTE: Ownership check below is for UI only.
  // Backend MUST verify ownership using JWT token before allowing modifications.
  // Never trust client-side authorization - treat this as cosmetic only.
  const isOwner = user?.id === question.userid;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 space-y-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to questions
        </Button>

        {/* Question */}
        <Card className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold">{question.title}</h1>
              <Badge>{question.tag}</Badge>
            </div>
            
            <p className="text-foreground text-lg whitespace-pre-wrap">{question.description}</p>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{question.username}</span>
                <span>•</span>
                <time>{new Date(question.created_at).toLocaleDateString()}</time>
              </div>
              
              {isOwner && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate(`/edit-question/${question.questionid}`)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    onClick={handleDeleteQuestion}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Answers Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          
          <div className="space-y-4">
            {answers.map((answer) => (
              <AnswerCard 
                key={answer.answerid} 
                answer={answer} 
                onUpdate={fetchQuestionAndAnswers}
              />
            ))}
          </div>
        </div>

        {/* Answer Form */}
        {user ? (
          <Card className="p-6">
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <h3 className="text-xl font-semibold">Your Answer</h3>
              <Textarea
                placeholder="Write your answer here..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={8}
                required
                maxLength={5000}
                className={`resize-none ${answerError ? 'border-destructive' : ''}`}
              />
              {answerError && (
                <p className="text-sm text-destructive">{answerError}</p>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post Answer'}
              </Button>
            </form>
          </Card>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to post an answer</p>
            <Button onClick={() => navigate('/login')}>Login</Button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default QuestionDetail;
