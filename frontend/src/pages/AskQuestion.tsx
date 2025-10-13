import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await questionsAPI.create(formData);
      toast({
        title: "Success!",
        description: "Your question has been posted",
      });
      navigate(`/questions/${response.data.questionid}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to post question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Ask a Question</CardTitle>
            <CardDescription>
              Share your question with the community and get answers from experts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Question Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., How do I center a div?"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Be specific and imagine you're asking a question to another person
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Include all the information someone would need to answer your question"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag">Tag</Label>
                <Input
                  id="tag"
                  name="tag"
                  placeholder="e.g., JavaScript, React, CSS"
                  value={formData.tag}
                  onChange={handleChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Add a tag to help others find your question
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Posting...' : 'Post Question'}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AskQuestion;
