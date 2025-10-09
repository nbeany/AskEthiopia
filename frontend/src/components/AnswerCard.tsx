import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User, Edit, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { answersApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { answerSchema } from '@/lib/validations';

interface AnswerCardProps {
  answer: {
    answerid: string;
    answer: string;
    username: string;
    created_at: string;
    userid: string;
  };
  onUpdate: () => void;
}

const AnswerCard = ({ answer, onUpdate }: AnswerCardProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState(answer.answer);
  const [editError, setEditError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // SECURITY NOTE: Ownership check below is for UI only.
  // Backend MUST verify ownership using JWT token before allowing modifications.
  // Never trust client-side authorization - treat this as cosmetic only.
  const isOwner = user?.id === answer.userid;

  const handleUpdate = async () => {
    setEditError('');
    
    // Validate answer
    const validationResult = answerSchema.safeParse({ answer: editedAnswer });
    if (!validationResult.success) {
      setEditError(validationResult.error.errors[0].message);
      return;
    }

    try {
      await answersApi.update(answer.answerid, { 
        answer: validationResult.data.answer 
      });
      toast({
        title: 'Answer updated',
        description: 'Your answer has been updated successfully',
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to update',
        description: 'Could not update your answer',
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this answer?')) return;
    
    setIsDeleting(true);
    try {
      await answersApi.delete(answer.answerid);
      toast({
        title: 'Answer deleted',
        description: 'Your answer has been removed',
      });
      onUpdate();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete',
        description: 'Could not delete your answer',
      });
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              rows={5}
              maxLength={5000}
              className={`resize-none ${editError ? 'border-destructive' : ''}`}
            />
            {editError && (
              <p className="text-sm text-destructive">{editError}</p>
            )}
            <div className="flex gap-2">
              <Button onClick={handleUpdate} size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  setEditedAnswer(answer.answer);
                  setEditError('');
                }} 
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-foreground whitespace-pre-wrap">{answer.answer}</p>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{answer.username}</span>
                <span>•</span>
                <time>{new Date(answer.created_at).toLocaleDateString()}</time>
              </div>
              
              {isOwner && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="ghost" 
                    size="sm"
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    variant="ghost" 
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default AnswerCard;
