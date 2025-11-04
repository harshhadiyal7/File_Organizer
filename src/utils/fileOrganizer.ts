/**
 * File Organizer Utility
 * Categorizes files based on their extensions
 */

export const FILE_CATEGORIES = {
  images: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'],
  pdfs: ['pdf'],
  documents: ['doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'csv'],
  videos: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'],
  audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'],
  archives: ['zip', 'rar', '7z', 'tar', 'gz'],
} as const;

export type FileCategory = keyof typeof FILE_CATEGORIES | 'other';

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Categorize a file based on its extension
 */
export const categorizeFile = (filename: string): FileCategory => {
  const extension = getFileExtension(filename);
  
  for (const [category, extensions] of Object.entries(FILE_CATEGORIES)) {
    if ((extensions as readonly string[]).includes(extension)) {
      return category as FileCategory;
    }
  }
  
  return 'other';
};

/**
 * Get folder path for a category
 */
export const getFolderPath = (category: FileCategory): string => {
  return `/${category}`;
};

/**
 * Simulate file organization with animation delay
 */
export const organizeFiles = async (
  files: File[],
  onProgress: (index: number, category: FileCategory) => void
): Promise<void> => {
  for (let i = 0; i < files.length; i++) {
    const category = categorizeFile(files[i].name);
    
    // Simulate organizing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    onProgress(i, category);
  }
};
