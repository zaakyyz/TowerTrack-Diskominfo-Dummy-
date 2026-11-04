import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CommentForm from '@/Components/MyMessages/CommentForm';
import CommentList from '@/Components/MyMessages/CommentList';
import AssetGrid from '@/Components/MyMessages/AssetGrid';
import AssetPreviewDialog from '@/Components/MyMessages/AssetPreviewDialog';
import MessageResponseTimeline, { MessageResponseItem } from '@/Components/MyMessages/MessageResponseTimeline';
import MessageResponseForm from '@/Components/MyMessages/MessageResponseForm';
import MessageActionDialog from '@/Components/MyMessages/MessageActionDialog';
import { PublicMessageHero, PublicMessageOverview } from '@/Components/MyMessages/PublicMessageOverview';
import { Comment } from '@/Components/MyMessages/CommentItem';
import { getStatusColor } from '@/utils/statusHelpers';
import { useCanRespond } from '@/Hooks/useCanRespond';
import { useReturnUrl } from '@/utils/navigationUtils';
import type { Report } from '@/types/messages';

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

type PaginationData = {
  data: Comment[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: PaginationLink[];
};

type ShowReportProps = {
  report: Report;
  statuses?: Array<{ id: number; name: string; slug: string; color: string; icon: string }>;
  comments?: PaginationData;
  commentCount?: number;
};

export default function ShowReport({ report, statuses = [], comments, commentCount }: ShowReportProps) {
  const { auth } = usePage().props as any;
  const [previewAsset, setPreviewAsset] = useState<{ file_path: string; file_type?: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: number; name: string } | null>(null);
  const [isResponseModalOpen, setResponseModalOpen] = useState(false);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);

  const handleCommentSuccess = React.useCallback(() => {
    setReplyingTo(null);
    router.reload({ only: ['report', 'comments', 'commentCount'] });
  }, [router]);

  const handleResponseSuccess = React.useCallback(() => {
    router.reload({ only: ['report'] });
  }, [router]);

  const handleReply = (commentId: number, authorName: string) => {
    setReplyingTo({ id: commentId, name: authorName });
    setCommentModalOpen(true);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const authUser = auth?.user;
  const isAuthenticated = Boolean(authUser);

  const { canRespond, responseDescription } = useCanRespond({
    user_id: report.user_id,
    email: report.email,
    phone: report.reporter_phone,
    phoneField: 'reporter_phone',
    messageType: 'report',
  });

  const responseStatusResolver = (statusValue: string | null | undefined) => {
    return getStatusColor(statusValue ?? '');
  };

  const { returnUrl, buttonLabel } = useReturnUrl();

  const headerContent = <PublicMessageHero type="Keluhan" message={report} returnUrl={returnUrl} buttonLabel={buttonLabel} />;

  return (
    <MainLayout title={`Detail Keluhan #${report.id}`} currentPage="/my-messages" headerSlot={headerContent}>
      <Head title={`Detail Keluhan #${report.id}`} />

      <div className="animate-fade-in-up">

        <PublicMessageOverview message={report} type="Keluhan" />

        {/* Assets */}
        {report.images && report.images.length > 0 && (
          <section className="mb-6" aria-labelledby="report-assets-heading">
            <h2 id="report-assets-heading" className="text-lg font-semibold text-foreground">Lampiran</h2>
            <AssetGrid
              assets={report.images.map(img => ({ file_path: img.file_path, file_type: img.file_type }))}
              onPreview={setPreviewAsset}
            />
          </section>
        )}

        {canRespond && (
          <div className="mb-6">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-foreground">Balas Keluhan</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sampaikan tindak lanjut atau ubah status penanganan keluhan ini.
                  </p>
                </div>
                <div className="w-full sm:w-auto sm:flex-shrink-0">
                  <MessageActionDialog
                    triggerLabel="Kirim Balasan"
                    triggerIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    triggerVariant="primary"
                    triggerSize="md"
                    triggerFullWidth={true}
                    triggerClassName="w-full sm:w-auto whitespace-nowrap bg-neutral hover:bg-neutral text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 font-medium transition-colors"
                    title="Kirim Balasan"
                    description={responseDescription}
                    maxWidth="3xl"
                    isOpen={isResponseModalOpen}
                    setOpen={setResponseModalOpen}
                    onClose={() => setResponseModalOpen(false)}
                  >
                    {(close) => (
                      <MessageResponseForm
                        type="report"
                        id={report.id}
                        canRespond={canRespond}
                        defaultSenderName={authUser?.name ?? ''}
                        defaultEmail={isAuthenticated ? authUser?.email ?? report.email ?? '' : ''}
                        defaultPhone={isAuthenticated ? report.reporter_phone ?? '' : ''}
                        onSuccess={() => {
                          handleResponseSuccess();
                          close();
                        }}
                        showContactFields={!isAuthenticated}
                        lockContactFields={false}
                        description={responseDescription}
                      />
                    )}
                  </MessageActionDialog>
                </div>
              </div>
            </div>
          </div>
        )}

        {report.responses && report.responses.length > 0 && (
          <div className="mb-6">
            <MessageResponseTimeline
              responses={report.responses}
              status={report.status}
              statusResolver={responseStatusResolver}
              heading="Balasan"
              minimal
              onPreviewAsset={(asset) => setPreviewAsset(asset)}
            />
          </div>
        )}

        {/* Comments Section */}
        <div className="mb-6">
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Komentar</h2>
                <p className="text-sm text-muted-foreground">Diskusikan perkembangan keluhan secara terbuka.</p>
              </div>
              <MessageActionDialog
                triggerLabel={replyingTo ? `Balas ${replyingTo.name}` : 'Tulis Komentar'}
                triggerIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                }
                triggerVariant="primary"
                triggerFullWidth={false}
                triggerClassName="whitespace-nowrap bg-neutral hover:bg-neutral text-white rounded-lg px-4 py-2 flex items-center gap-2 font-medium transition-colors"
                title={replyingTo ? `Balas ${replyingTo.name}` : 'Tulis Komentar'}
                description={replyingTo ? 'Balasan Anda akan terlihat oleh publik.' : 'Komentar Anda akan terlihat oleh publik.'}
                isOpen={isCommentModalOpen}
                setOpen={setCommentModalOpen}
                onOpen={() => setReplyingTo(null)}
                onClose={() => {
                  setCommentModalOpen(false);
                  setReplyingTo(null);
                }}
              >
                {(close) => (
                  <CommentForm
                    type="report"
                    id={report.id}
                    parentId={replyingTo?.id || null}
                    replyingTo={replyingTo?.name || null}
                    onSuccess={() => {
                      handleCommentSuccess();
                      close();
                      setCommentModalOpen(false);
                    }}
                    onCancel={handleCancelReply}
                  />
                )}
              </MessageActionDialog>
            </div>

            <CommentList
              comments={comments?.data || report.comments || []}
              onReply={handleReply}
              pagination={comments}
              commentCount={commentCount}
              minimal
            />
          </div>
        </div>

        <AssetPreviewDialog asset={previewAsset} onClose={() => setPreviewAsset(null)} />
      </div>
    </MainLayout>
  );
}
