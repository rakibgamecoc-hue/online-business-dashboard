import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import API from '../api/axios';

const UploadQueueContext = createContext(null);
const STORAGE_KEY = 'bd-analytics-upload-queue';

const loadQueue = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveQueue = (queue) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to save upload queue', error);
  }
};

export function UploadQueueProvider({ children }) {
  const [queue, setQueue] = useState(loadQueue);
  const [status, setStatus] = useState(queue.length ? 'pending' : 'synced');
  const [isProcessing, setIsProcessing] = useState(false);

  const persistQueue = useCallback((nextQueue) => {
    setQueue(nextQueue);
    saveQueue(nextQueue);
  }, []);

  const processQueue = useCallback(async () => {
    const nextQueue = [...loadQueue()];

    if (!nextQueue.length) {
      setStatus('synced');
      return;
    }

    setIsProcessing(true);
    setStatus('uploading');

    while (nextQueue.length) {
      const item = nextQueue[0];
      try {
        await API.post(item.endpoint, item.payload);
        nextQueue.shift();
        persistQueue(nextQueue);
      } catch (error) {
        setStatus('error');
        setIsProcessing(false);
        return;
      }
    }

    setStatus('synced');
    setIsProcessing(false);
  }, [persistQueue]);

  useEffect(() => {
    if (queue.length > 0) {
      setStatus('pending');
      processQueue();
    } else {
      setStatus('synced');
    }
  }, [queue.length, processQueue]);

  const addToQueue = useCallback(
    (endpoint, payload) => {
      const nextQueue = [
        ...loadQueue(),
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          endpoint,
          payload,
          createdAt: new Date().toISOString(),
        },
      ];
      persistQueue(nextQueue);
      setStatus('pending');
    },
    [persistQueue],
  );

  const flushQueue = useCallback(() => {
    processQueue();
  }, [processQueue]);

  const value = useMemo(
    () => ({
      pendingCount: queue.length,
      status,
      isProcessing,
      addToQueue,
      flushQueue,
      queue,
    }),
    [queue.length, status, isProcessing, addToQueue, flushQueue, queue],
  );

  return <UploadQueueContext.Provider value={value}>{children}</UploadQueueContext.Provider>;
}

export const useUploadQueue = () => {
  const context = useContext(UploadQueueContext);
  if (!context) {
    throw new Error('useUploadQueue must be used within UploadQueueProvider');
  }
  return context;
};
