import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QuestionCard from '@/components/QuestionCard';
import Navbar from '@/components/Navbar';
import { questionsApi } from '@/services/api';
import { Search, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

interface Question {
  questionid: string;
  title: string;
  description: string;
  tag: string;
  username: string;
  created_at: string;
  answerCount?: number;
}

const Home = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Debounce search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const params: { tag?: string; q?: string } = {};
      if (selectedTag) params.tag = selectedTag;
      if (debouncedSearchQuery) params.q = debouncedSearchQuery;
      
      const response = await questionsApi.getAll(params);
      setQuestions(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load questions',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedTag, debouncedSearchQuery]);

  const popularTags = ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'CSS'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">All Questions</h1>
          <p className="text-muted-foreground">Browse and search through our community questions</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>Filter by tag:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedTag === '' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedTag('')}
              >
                All
              </Badge>
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Questions List */}
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
            <p className="text-muted-foreground">No questions found</p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedTag('');
            }}>
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
