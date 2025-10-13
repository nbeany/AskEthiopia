import { useState, useEffect } from 'react';
import { questionsAPI } from '@/services/api';
import QuestionCard from '@/components/QuestionCard';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

interface Question {
  questionid: string;
  title: string;
  description: string;
  tag: string;
  username: string;
  answerCount?: number;
}

const Home = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedTag) params.tag = selectedTag;
      if (searchQuery) params.q = searchQuery;
      
      const response = await questionsAPI.getAll(params);
      setQuestions(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedTag, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold text-foreground">All Questions</h1>
          <SearchBar onSearch={handleSearch} />
          <TagFilter selectedTag={selectedTag} onTagSelect={handleTagSelect} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions found. Be the first to ask!</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {questions.map((question) => (
              <QuestionCard key={question.questionid} {...question} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
