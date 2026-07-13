import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
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

const normalizePayload = (endpoint, payload) => {
  if (endpoint === '/pathao-payout') {
    return {
      date: payload.date || payload.payoutDate,
      amountBDT: payload.amountBDT,
      consignmentId: payload.consignmentId,
    };
  }
  if (endpoint === '/dollar-wallet') {
    return {
      date: payload.date,
      amountUSD: payload.amountUSD ?? payload.usdReceived,
      totalBDT: payload.totalBDT ?? payload.bdtSpent,
      rateBDT: payload.rateBDT ?? (payload.rate ? Number(payload.rate) : undefined),
    };
  }
  return payload;
};

export function UploadQueueProvider({ children }) {
  const [queue, setQueue] = useState(loadQueue);
  const [status, setStatus] = useState(queue.length ? 'pending' : 'synced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncVersion, setSyncVersion] = useState(0);

  const persistQueue = useCallback((nextQueue) => {
    setQueue(nextQueue);
    saveQueue(nextQueue);
  }, []);

  const processQueue = useCallback(async () => {
    const nextQueue = [...loadQueue()];

    // #region agent log
    fetch('http://127.0.0.1:7415/ingest/84e3ad2c-0dc5-40c6-8a93-97543617c946',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d155c8'},body:JSON.stringify({sessionId:'d155c8',location:'UploadQueueContext.jsx:processQueue:start',message:'processQueue invoked',data:{queueLen:nextQueue.length,isProcessing,firstItem:nextQueue[0]?{endpoint:nextQueue[0].endpoint,payload:nextQueue[0].payload}:null},timestamp:Date.now(),hypothesisId:'C,D,E'})}).catch(()=>{});
    // #endregion

    if (!nextQueue.length) {
      setStatus('synced');
      return;
    }

    setIsProcessing(true);
    setStatus('uploading');

    while (nextQueue.length) {
      const item = nextQueue[0];
      const payload = normalizePayload(item.endpoint, item.payload);
      try {
        const response = await API.post(item.endpoint, payload);
        // #region agent log
        fetch('http://127.0.0.1:7415/ingest/84e3ad2c-0dc5-40c6-8a93-97543617c946',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d155c8'},body:JSON.stringify({sessionId:'d155c8',runId:'post-fix',location:'UploadQueueContext.jsx:processQueue:success',message:'Queue item uploaded',data:{endpoint:item.endpoint,status:response.status,remaining:nextQueue.length-1},timestamp:Date.now(),hypothesisId:'A,B'})}).catch(()=>{});
        // #endregion
        nextQueue.shift();
        persistQueue(nextQueue);
      } catch (error) {
        const errorMsg = error?.response?.data?.message || error?.message || 'Upload failed';
        toast.error(`Sync failed: ${errorMsg}`);
        // #region agent log
        fetch('http://127.0.0.1:7415/ingest/84e3ad2c-0dc5-40c6-8a93-97543617c946',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d155c8'},body:JSON.stringify({sessionId:'d155c8',runId:'post-fix',location:'UploadQueueContext.jsx:processQueue:error',message:'Queue item failed',data:{endpoint:item.endpoint,payload,normalizedFrom:item.payload,status:error?.response?.status,errorMsg,isProcessing},timestamp:Date.now(),hypothesisId:'A,B,C'})}).catch(()=>{});
        // #endregion
        setStatus('error');
        setIsProcessing(false);
        return;
      }
    }

    setStatus('synced');
    setIsProcessing(false);
    setSyncVersion((current) => current + 1);
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
    // #region agent log
    fetch('http://127.0.0.1:7415/ingest/84e3ad2c-0dc5-40c6-8a93-97543617c946',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d155c8'},body:JSON.stringify({sessionId:'d155c8',location:'UploadQueueContext.jsx:flushQueue',message:'Retry clicked',data:{status,isProcessing,queueLen:queue.length,localStorageLen:loadQueue().length},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    processQueue();
  }, [processQueue, status, isProcessing, queue.length]);

  const value = useMemo(
    () => ({
      pendingCount: queue.length,
      status,
      isProcessing,
      syncVersion,
      addToQueue,
      flushQueue,
      queue,
    }),
    [queue.length, status, isProcessing, syncVersion, addToQueue, flushQueue, queue],
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
