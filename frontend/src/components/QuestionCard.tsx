import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, User } from 'lucide-react';

interface QuestionCardProps {
  questionid: string;
  title: string;
  description: string;
  tag: string;
  username: string;
  answerCount?: number;
}

const QuestionCard = ({ questionid, title, description, tag, username, answerCount = 0 }: QuestionCardProps) => {
  return (
    <Link to={`/questions/${questionid}`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="bg-tag text-tag-foreground shrink-0">
              {tag}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{username}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{answerCount} {answerCount === 1 ? 'answer' : 'answers'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default QuestionCard;
