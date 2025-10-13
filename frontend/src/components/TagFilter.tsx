import { Badge } from '@/components/ui/badge';

interface TagFilterProps {
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

const popularTags = ['JavaScript', 'React', 'Node.js', 'Python', 'CSS', 'TypeScript'];

const TagFilter = ({ selectedTag, onTagSelect }: TagFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selectedTag === null ? 'default' : 'outline'}
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onTagSelect(null)}
      >
        All
      </Badge>
      {popularTags.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTag === tag ? 'default' : 'outline'}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onTagSelect(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default TagFilter;
