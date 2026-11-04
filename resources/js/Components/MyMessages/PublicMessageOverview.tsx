import { router } from '@inertiajs/react';
import LocationCard from './LocationCard';
import { formatDateFull } from '@/utils/dateHelpers';
import { getStatusColor } from '@/utils/statusHelpers';
import type { Report, Feedback } from '@/types/messages';

type PublicMessage = Report | Feedback;

type Props = {
  type: 'Keluhan' | 'Masukan';
  message: PublicMessage;
  returnUrl: string;
  buttonLabel: string;
};

export function PublicMessageHero({ type, message, returnUrl, buttonLabel }: Props) {
  const status = getStatusColor(message.status);

  return (
    <div className="bg-primary text-white border-b border-primary-hover">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-6">
        <button
          type="button"
          onClick={() => router.visit(returnUrl)}
          className="inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7 7-7-7 7-7" />
          </svg>
          {buttonLabel}
        </button>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Detail {type} #{message.id}</h1>
          <span
            className="inline-flex items-center rounded px-2.5 py-1 text-sm font-semibold"
            style={{ backgroundColor: status.bg, color: status.text }}
          >
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PublicMessageOverview({ message, type }: { message: PublicMessage; type: 'Keluhan' | 'Masukan' }) {
  const report = type === 'Keluhan' ? message as Report : null;
  const feedback = type === 'Masukan' ? message as Feedback : null;
  const sender = message.user?.name || report?.reporter_name || feedback?.sender_name || 'Tamu';

  return (
    <div className="bg-card rounded-lg border border-border p-5 sm:p-6 mb-6">
      <section aria-labelledby="message-content-heading">
        <h2 id="message-content-heading" className="text-xl font-semibold text-foreground mb-3">Isi Pesan</h2>
        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">{message.message}</p>
      </section>

      <div className="mt-6 border-t border-border pt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-sm text-muted-foreground">Pengirim</div>
          <div className="font-medium text-foreground">{sender}{!message.user_id && <span className="ml-2 text-xs font-normal text-muted-foreground">(Tamu)</span>}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Waktu kirim</div>
          <time dateTime={message.created_at} className="font-medium text-foreground">{formatDateFull(message.created_at)}</time>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Kategori</div>
          <div className="font-medium text-foreground">{message.category || 'Belum ditentukan'}</div>
        </div>
        <LocationCard
          tower={message.tower}
          reportable={report?.reportable}
          feedbackable={feedback?.feedbackable}
          reportableType={report?.reportable_type}
          feedbackableType={feedback?.feedbackable_type}
          plain
        />
      </div>
    </div>
  );
}
