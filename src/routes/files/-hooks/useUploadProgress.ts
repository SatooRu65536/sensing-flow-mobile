import { useRef, useState } from 'react';

export function useUploadProgress(callback?: (progress: number) => void) {
  const [progress, setProgress] = useState<number>(0);
  const folderSizeRef = useRef<number>(0);
  const uploadedSizeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateProgress = () => {
    const total = folderSizeRef.current;
    if (total > 0) {
      setProgress(uploadedSizeRef.current / total);
      if (callback) callback(uploadedSizeRef.current / total);
    }
    timerRef.current = null;
  };

  const scheduleUpdate = () => {
    if (timerRef.current) return;
    timerRef.current = setTimeout(calculateProgress, 500);
  };

  const addUploadedSize = (size: number) => {
    uploadedSizeRef.current += size;
    scheduleUpdate();
  };

  const setFolderSize = (size: number) => {
    folderSizeRef.current = size;
  };

  const resetProgress = () => {
    uploadedSizeRef.current = 0;
    folderSizeRef.current = 0;
    setProgress(0);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return { setFolderSize, addUploadedSize, progress, resetProgress };
}
