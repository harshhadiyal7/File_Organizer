import { Folder, ChevronRight } from "lucide-react";
import { useState } from "react";
import FileCard, { FileItem } from "./FileCard";

interface FolderViewProps {
  category: string;
  files: FileItem[];
  onFileClick?: (file: FileItem) => void;
}

const getFolderName = (category: string): string => {
  const names = {
    images: 'Images',
    pdfs: 'PDFs',
    documents: 'Documents',
    videos: 'Videos',
    audio: 'Audio',
    archives: 'Archives',
    other: 'Other Files',
  };
  return names[category as keyof typeof names] || 'Other Files';
};

const FolderView = ({ category, files, onFileClick }: FolderViewProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (files.length === 0) return null;

  return (
    <div 
      className="rounded-xl border border-border bg-card overflow-hidden animate-scale-in"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
      >
        <Folder className="w-5 h-5 text-primary" />
        <span className="flex-1 text-left font-semibold text-foreground">
          {getFolderName(category)}
        </span>
        <span className="text-sm text-muted-foreground">
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </span>
        <ChevronRight 
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
        />
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 space-y-2 border-t border-border">
          {files.map((file, index) => (
            <FileCard 
              key={`${file.name}-${index}`} 
              file={file} 
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderView;
