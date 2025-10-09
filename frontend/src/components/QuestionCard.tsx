import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User } from 'lucide-react';

interface QuestionCardProps {
  question: {
    questionid: string;
    title: string;
    description: string;
    tag: string;
    username: string;
    created_at: string;
    answerCount?: number;
  };
}

const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <Link to={`/questions/${question.questionid}`}>
      <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
              {question.title}
            </h3>
            <Badge variant="secondary" className="shrink-0">
              {question.tag}
            </Badge>
          </div>
          
          <p className="text-muted-foreground line-clamp-2">
            {question.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{question.username}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {question.answerCount !== undefined && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{question.answerCount} {question.answerCount === 1 ? 'answer' : 'answers'}</span>
                </div>
              )}
              <time>
                {new Date(question.created_at).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default QuestionCard;
