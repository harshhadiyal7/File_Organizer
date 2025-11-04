import { Upload } from "lucide-react";
import { useCallback } from "react";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isDragging: boolean;
  onDragStateChange: (isDragging: boolean) => void;
}

const FileUploadZone = ({ onFilesSelected, isDragging, onDragStateChange }: FileUploadZoneProps) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange(true);
  }, [onDragStateChange]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange(false);
  }, [onDragStateChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onDragStateChange(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected, onDragStateChange]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed 
        transition-all duration-300 p-12 text-center cursor-pointer
        ${isDragging 
          ? 'border-primary bg-primary/5 scale-[1.02]' 
          : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
        }
      `}
      style={{ 
        boxShadow: isDragging ? 'var(--shadow-glow)' : 'var(--shadow-md)',
      }}
    >
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="File upload input"
      />
      
      <div className="flex flex-col items-center gap-4 pointer-events-none">
        <div 
          className={`
            rounded-full p-6 transition-all duration-300
            ${isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-secondary text-primary'}
          `}
        >
          <Upload className={`w-12 h-12 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`} />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {isDragging ? 'Drop files here!' : 'Drop files to organize'}
          </h3>
          <p className="text-muted-foreground">
            or click to browse your computer
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground mt-2">
          <span className="px-3 py-1 bg-secondary rounded-full">Images</span>
          <span className="px-3 py-1 bg-secondary rounded-full">PDFs</span>
          <span className="px-3 py-1 bg-secondary rounded-full">Documents</span>
          <span className="px-3 py-1 bg-secondary rounded-full">Videos</span>
          <span className="px-3 py-1 bg-secondary rounded-full">Audio</span>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;
