import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FolderView from "@/components/FolderView";
import FilePreviewModal from "@/components/FilePreviewModal";
import { FileItem } from "@/components/FileCard";
import { loadFilesFromStorage, clearFilesFromStorage } from "@/utils/storage";
import { FileCategory } from "@/utils/fileOrganizer";
import { Upload, Trash2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const MyFiles = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const loadedFiles = loadFilesFromStorage();
    setFiles(loadedFiles);
  }, []);

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => setSelectedFile(null), 300);
  };

  const handleClearAll = () => {
    if (files.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear all files? This action cannot be undone.')) {
      clearFilesFromStorage();
      setFiles([]);
      toast.success('All files cleared successfully');
    }
  };

  // Group files by category
  const filesByCategory = files.reduce((acc, file) => {
    if (!acc[file.category]) {
      acc[file.category] = [];
    }
    acc[file.category].push(file);
    return acc;
  }, {} as Record<string, FileItem[]>);

  const categories: FileCategory[] = ['images', 'pdfs', 'documents', 'videos', 'audio', 'archives', 'other'];

  // Calculate total file size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'var(--gradient-bg)' }}
    >
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                My Files
              </h1>
              <p className="text-muted-foreground">
                {files.length} file{files.length !== 1 ? 's' : ''} organized
                {files.length > 0 && ` · ${formatBytes(totalSize)}`}
              </p>
            </div>

            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload More
                </Button>
              </Link>
              {files.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleClearAll}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Files Display */}
        {files.length > 0 ? (
          <section className="animate-slide-up">
            <div className="grid gap-4">
              {categories.map(category => (
                <FolderView
                  key={category}
                  category={category}
                  files={filesByCategory[category] || []}
                  onFileClick={handleFileClick}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-block p-12 rounded-2xl bg-card border border-border" style={{ boxShadow: 'var(--shadow-md)' }}>
              <div className="mb-6 flex justify-center">
                <div className="p-6 rounded-full bg-secondary text-muted-foreground">
                  <FolderOpen className="w-16 h-16" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                No files yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Upload your first files to get started with automatic organization
              </p>
              <Link to="/">
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Files
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal 
        file={selectedFile}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
};

export default MyFiles;
