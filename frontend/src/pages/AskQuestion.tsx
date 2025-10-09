import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { questionsApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { questionSchema } from '@/lib/validations';

const AskQuestion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    const validationResult = questionSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please check the form for errors',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await questionsApi.create({
        title: validationResult.data.title,
        description: validationResult.data.description,
        tag: validationResult.data.tag,
      });
      toast({
        title: 'Question posted!',
        description: 'Your question has been posted successfully',
      });
      navigate(`/questions/${response.data.questionid}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to post question',
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to questions
        </Button>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Ask a Question</h1>
              <p className="text-muted-foreground">
                Get help from the community by asking a clear and detailed question
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Question Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., How do I center a div in CSS?"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Be specific and imagine you're asking a question to another person
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Details</Label>
                <Textarea
                  id="description"
                  placeholder="Provide all the details someone would need to help you..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={10}
                  required
                  maxLength={5000}
                  className={`resize-none ${errors.description ? 'border-destructive' : ''}`}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Include all the information someone would need to answer your question
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag">Tag</Label>
                <Input
                  id="tag"
                  placeholder="e.g., JavaScript, React, CSS"
                  value={formData.tag}
                  onChange={handleChange}
                  required
                  maxLength={30}
                  className={errors.tag ? 'border-destructive' : ''}
                />
                {errors.tag && (
                  <p className="text-sm text-destructive">{errors.tag}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Add a tag to help others find your question
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Question'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AskQuestion;
