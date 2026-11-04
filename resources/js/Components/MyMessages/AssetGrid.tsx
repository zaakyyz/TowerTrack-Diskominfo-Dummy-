import React from 'react';
import VideoThumbnail from '@/Components/VideoThumbnail';

export type Asset = {
  file_path: string;
  file_type?: string;
};

type AssetGridProps = {
  assets?: Array<Asset>;
  onPreview?: (asset: Asset) => void;
  className?: string;
};

export default function AssetGrid({ assets, onPreview, className = '' }: AssetGridProps) {
  if (!assets || assets.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 ${className}`}>
      {assets.map((a, i) => {
        const content = (
          <>
          {a.file_type === 'video' ? (
            <VideoThumbnail
              src={`/storage/${a.file_path}`}
              fileType="video"
              className="w-full aspect-video"
              showPlayButton={true}
              alt={`Video lampiran ${i + 1}`}
              loading="lazy"
            />
          ) : (
            <div className="relative w-full aspect-video bg-muted">
              <img 
                src={`/storage/${a.file_path}`} 
                className="w-full h-full object-contain"
                alt={`Gambar lampiran ${i + 1}`}
                loading="lazy"
                onError={(e) => {
                  // Was: src = '/images/placeholder-image.png' — a file that
                  // has never existed in public/images/. Pointing a failed
                  // image at a second missing image re-fires onError, and the
                  // browser retries until it gives up, logging a 404 each time.
                  // Hide the broken image and let the muted panel behind it
                  // stand in as the placeholder instead.
                  e.currentTarget.style.visibility = 'hidden';
                }}
              />
            </div>
          )}
          </>
        );
        const classes = 'block w-full rounded overflow-hidden border border-border bg-white text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
        return onPreview ? (
          <button key={i} type="button" className={classes} onClick={() => onPreview(a)} aria-label={`Lihat ${a.file_type === 'video' ? 'video' : 'gambar'} lampiran ${i + 1}`}>
            {content}
          </button>
        ) : (
          <div key={i} className={classes}>{content}</div>
        );
      })}
    </div>
  );
}





