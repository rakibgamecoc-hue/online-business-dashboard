import { useUploadQueue } from '../context/UploadQueueContext';

const statusLabel = {
  synced: { text: 'Synced', color: 'bg-emerald-500', icon: '✓' },
  pending: { text: 'Pending', color: 'bg-yellow-500', icon: '●' },
  uploading: { text: 'Uploading', color: 'bg-blue-500', icon: '⟳' },
  error: { text: 'Error', color: 'bg-red-500', icon: '⚠' },
};

function UploadStatusBadge() {
  const { status, pendingCount, flushQueue } = useUploadQueue();
  const current = statusLabel[status] || statusLabel.synced;

  return (
    <button
      type="button"
      onClick={flushQueue}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white ${current.color} shadow-lg shadow-black/20 hover:opacity-90 transition-opacity duration-150`}
      aria-label="Retry pending uploads"
    >
      <span>{current.icon}</span>
      <span>{current.text}</span>
      {pendingCount > 0 && <span className="rounded-full bg-black/20 px-2">{pendingCount}</span>}
      {status === 'error' && <span className="text-[10px] uppercase tracking-[0.16em] text-white/80">retry</span>}
    </button>
  );
}

export default UploadStatusBadge;
