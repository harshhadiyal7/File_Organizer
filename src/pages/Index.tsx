import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import FileUploadZone from "@/components/FileUploadZone";
import FolderView from "@/components/FolderView";
import { FileItem } from "@/components/FileCard";
import { categorizeFile, organizeFiles, FileCategory } from "@/utils/fileOrganizer";
import { saveFilesToStorage, loadFilesFromStorage } from "@/utils/storage";
import { FolderOpen, Sparkles, Files } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isOrganizing, setIsOrganizing] = useState(false);

  // Load files from storage on mount
  useEffect(() => {
    const loadedFiles = loadFilesFromStorage();
    setFiles(loadedFiles);
  }, []);

  // Save files to storage whenever they change
  useEffect(() => {
    if (files.length > 0) {
      saveFilesToStorage(files);
    }
  }, [files]);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    // Convert File objects to FileItem objects with data URLs
    const filePromises = selectedFiles.map(file => {
      return new Promise<FileItem>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            category: categorizeFile(file.name),
            status: 'pending' as const,
            dataUrl: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const newFiles = await Promise.all(filePromises);
    setFiles(prev => [...prev, ...newFiles]);
    setIsOrganizing(true);

    toast.info(`Organizing ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}...`);

    // Organize files with animation
    await organizeFiles(selectedFiles, (index, category) => {
      setFiles(prev => {
        const updated = [...prev];
        const fileIndex = prev.length - selectedFiles.length + index;
        
        if (updated[fileIndex]) {
          // First set to organizing
          updated[fileIndex] = { 
            ...updated[fileIndex], 
            status: 'organizing',
            category 
          };
          
          // Then after a short delay, set to organized
          setTimeout(() => {
            setFiles(current => {
              const final = [...current];
              if (final[fileIndex]) {
                final[fileIndex] = { ...final[fileIndex], status: 'organized' };
              }
              return final;
            });
          }, 400);
        }
        
        return updated;
      });
    });

    setIsOrganizing(false);
    toast.success(`Successfully organized ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}!`, {
      icon: <Sparkles className="w-4 h-4" />,
    });
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

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: 'var(--gradient-bg)',
      }}
    >
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
              <FolderOpen className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            File Organizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Automatically sort your files into organized folders. Just drag, drop, and watch the magic happen.
          </p>
        </header>

        {/* Upload Zone */}
        <section className="mb-12 animate-slide-up">
          <FileUploadZone
            onFilesSelected={handleFilesSelected}
            isDragging={isDragging}
            onDragStateChange={setIsDragging}
          />
        </section>

        {/* Organized Files */}
        {files.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-foreground">
                  Organized Files
                </h2>
                {isOrganizing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Organizing...</span>
                  </div>
                )}
              </div>
              
              <Link to="/my-files">
                <Button variant="outline" className="gap-2">
                  <Files className="w-4 h-4" />
                  View All Files
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {categories.map(category => (
                <FolderView
                  key={category}
                  category={category}
                  files={filesByCategory[category] || []}
                />
              ))}
            </div>
          </section>
        )}

        {/* Demo Instructions */}
        {files.length === 0 && (
          <section className="text-center mt-16 animate-fade-in">
            <div className="inline-block p-8 rounded-2xl bg-card border border-border" style={{ boxShadow: 'var(--shadow-md)' }}>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Try it out!
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Upload files with different extensions to see them automatically organized into folders:
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <code className="px-3 py-1 bg-secondary rounded-md text-foreground">.jpg, .png</code>
                <code className="px-3 py-1 bg-secondary rounded-md text-foreground">.pdf</code>
                <code className="px-3 py-1 bg-secondary rounded-md text-foreground">.doc, .txt</code>
                <code className="px-3 py-1 bg-secondary rounded-md text-foreground">.mp4</code>
                <code className="px-3 py-1 bg-secondary rounded-md text-foreground">.mp3</code>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
