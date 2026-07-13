import { useUploadQueue } from '../context/UploadQueueContext';
import { useState } from 'react';

const statusLabel = {
  synced: { text: 'Synced', color: 'bg-emerald-500', icon: '✓' },
  pending: { text: 'Pending', color: 'bg-yellow-500', icon: '●' },
  uploading: { text: 'Uploading', color: 'bg-blue-500', icon: '⟳' },
  error: { text: 'Error', color: 'bg-red-500', icon: '⚠' },
};

function getGreeting(name) {
  const hour = new Date().getHours();
  const when = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `${when}${name ? ', ' + name : ''}`;
}

function UploadStatusBadge({ user }) {
  const { status, pendingCount, flushQueue, isProcessing, syncVersion } = useUploadQueue();
  const current = statusLabel[status] || statusLabel.synced;
  const [showPopover, setShowPopover] = useState(false);

  const lastSyncText = `Sync version ${syncVersion}`;

  return (
    <>
      {/* Greeting inline (keeps header layout) */}
      <div className="hidden sm:inline-flex items-center">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-slate-900 bg-white border border-gray-200 shadow-sm">
          <span>{getGreeting(user?.name)}</span>
        </div>
      </div>

      {/* Small fixed pill at top-right for backup status */}
      <button
        onClick={() => setShowPopover((v) => !v)}
        title="Backup status"
        className="fixed top-3 right-3 z-50 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs shadow-lg border border-white"
      >
        <span className="w-2 h-2 bg-white/80 rounded-full inline-block" />
        <span className="font-medium">{status === 'synced' ? 'Backed up' : current.text}</span>
      </button>

      {showPopover && (
        <div className="fixed top-12 right-3 z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">Backup Status</div>
            <div className="text-xs text-gray-500">{status}</div>
          </div>
          <div className="text-xs text-gray-600 mb-2">{lastSyncText}</div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-gray-700">Pending</div>
            <div className="text-sm font-medium">{pendingCount}</div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button onClick={flushQueue} className="btn-primary w-full">Retry Sync</button>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadStatusBadge;
