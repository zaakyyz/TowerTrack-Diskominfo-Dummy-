import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import type { Asset } from './AssetGrid';

type Props = {
  asset: Asset | null;
  onClose: () => void;
};

export default function AssetPreviewDialog({ asset, onClose }: Props) {
  return (
    <Dialog open={asset !== null} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/85" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-6">
        <DialogPanel className="flex w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-foreground shadow-xl">
          <div className="flex items-center justify-between border-b border-white/20 px-4 py-3">
            <DialogTitle className="text-sm font-medium text-white">Pratinjau lampiran</DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-2 text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Tutup pratinjau"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {asset && (
            <div className="flex max-h-[calc(100vh-8rem)] items-center justify-center overflow-auto">
              {asset.file_type === 'video' ? (
                <video src={`/storage/${asset.file_path}`} controls className="max-h-[calc(100vh-8rem)] max-w-full" />
              ) : (
                <img src={`/storage/${asset.file_path}`} alt="Lampiran pesan ukuran penuh" className="max-h-[calc(100vh-8rem)] max-w-full object-contain" />
              )}
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
