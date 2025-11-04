import { FileText, Image, FileVideo, Music, Archive, File } from "lucide-react";

export interface FileItem {
  name: string;
  size: number;
  type: string;
  category: string;
  status: 'pending' | 'organizing' | 'organized';
  dataUrl?: string; // Base64 data URL for file preview
}

interface FileCardProps {
  file: FileItem;
  onFileClick?: (file: FileItem) => void;
}

const getFileIcon = (category: string) => {
  switch (category) {
    case 'images':
      return <Image className="w-5 h-5" />;
    case 'pdfs':
      return <FileText className="w-5 h-5" />;
    case 'documents':
      return <FileText className="w-5 h-5" />;
    case 'videos':
      return <FileVideo className="w-5 h-5" />;
    case 'audio':
      return <Music className="w-5 h-5" />;
    case 'archives':
      return <Archive className="w-5 h-5" />;
    default:
      return <File className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: string) => {
  const colors = {
    images: 'text-accent',
    pdfs: 'text-destructive',
    documents: 'text-primary',
    videos: 'text-success',
    audio: 'text-primary-glow',
    archives: 'text-muted-foreground',
    other: 'text-muted-foreground',
  };
  return colors[category as keyof typeof colors] || colors.other;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const FileCard = ({ file, onFileClick }: FileCardProps) => {
  const handleClick = () => {
    if (onFileClick && file.status === 'organized') {
      onFileClick(file);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        flex items-center gap-3 p-4 rounded-xl bg-card border border-border 
        hover:border-primary/50 transition-all duration-300 animate-slide-up
        ${file.status === 'organized' && onFileClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
      `}
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <div className={`${getCategoryColor(file.category)} shrink-0`}>
        {getFileIcon(file.category)}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
      </div>
      
      {file.status === 'organizing' && (
        <div className="shrink-0">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {file.status === 'organized' && (
        <div className="shrink-0 w-5 h-5 bg-success rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default FileCard;
