import { X, Download, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileItem } from "./FileCard";

interface FilePreviewModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const FilePreviewModal = ({ file, isOpen, onClose }: FilePreviewModalProps) => {
  if (!file) return null;

  const handleDownload = () => {
    if (!file.dataUrl) return;
    
    const link = document.createElement('a');
    link.href = file.dataUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isImage = file.category === 'images';
  const isPDF = file.category === 'pdfs';
  const isViewable = isImage || isPDF;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold truncate">
                {file.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {file.type || 'Unknown type'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {file.dataUrl && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  {isPDF && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.dataUrl, '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {file.dataUrl ? (
            <>
              {isImage && (
                <div className="flex items-center justify-center bg-secondary/30 rounded-lg p-4">
                  <img 
                    src={file.dataUrl} 
                    alt={file.name}
                    className="max-w-full h-auto max-h-[60vh] rounded-lg object-contain"
                  />
                </div>
              )}

              {isPDF && (
                <div className="w-full h-[60vh] bg-secondary/30 rounded-lg overflow-hidden">
                  <iframe
                    src={file.dataUrl}
                    className="w-full h-full border-0"
                    title={file.name}
                  />
                </div>
              )}

              {!isViewable && (
                <div className="text-center py-12">
                  <div className="inline-flex flex-col items-center gap-4">
                    <div className="p-6 rounded-full bg-secondary text-muted-foreground">
                      <ExternalLink className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Preview not available
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        This file type cannot be previewed in the browser
                      </p>
                      <Button onClick={handleDownload} className="gap-2">
                        <Download className="w-4 h-4" />
                        Download to view
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                File data not available for preview
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;
