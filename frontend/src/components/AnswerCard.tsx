import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User, Edit2, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AnswerCardProps {
  answerid: string;
  answer: string;
  username: string;
  userid: string;
  onUpdate: (answerid: string, answer: string) => Promise<void>;
  onDelete: (answerid: string) => Promise<void>;
}

const AnswerCard = ({ answerid, answer, username, userid, onUpdate, onDelete }: AnswerCardProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState(answer);
  const isAuthor = user?.userid === userid;

  const handleUpdate = async () => {
    await onUpdate(answerid, editedAnswer);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAnswer(answer);
    setIsEditing(false);
  };

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="font-medium">{username}</span>
          </div>
          {isAuthor && !isEditing && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(answerid)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpdate}>
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-foreground whitespace-pre-wrap">{answer}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AnswerCard;
