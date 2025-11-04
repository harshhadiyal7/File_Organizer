import { FileItem } from "@/components/FileCard";

const STORAGE_KEY = 'file_organizer_files';

/**
 * Save files to localStorage
 */
export const saveFilesToStorage = (files: FileItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (error) {
    console.error('Error saving files to storage:', error);
  }
};

/**
 * Load files from localStorage
 */
export const loadFilesFromStorage = (): FileItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading files from storage:', error);
  }
  return [];
};

/**
 * Clear all files from storage
 */
export const clearFilesFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing files from storage:', error);
  }
};
